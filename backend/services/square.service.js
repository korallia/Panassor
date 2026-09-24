import { createHmac, randomUUID, timingSafeEqual } from "crypto";

import { env } from "../config/env.js";
import { normalizeLanguage } from "../utils/language.js";

export function getSquareBaseUrl() {
  return env.square.environment === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

export function assertSquareConfig() {
  if (!env.square.accessToken) {
    throw new Error("SQUARE_ACCESS_TOKEN is missing");
  }

  if (!env.square.locationId) {
    throw new Error("SQUARE_LOCATION_ID is missing");
  }
}

export function buildSquareTaxes(language = "fr") {
  const normalizedLanguage = normalizeLanguage(language);

  return [
    {
      uid: "gst",
      name: normalizedLanguage === "en" ? "GST" : "TPS",
      percentage: "5",
      scope: "ORDER",
    },
    {
      uid: "qst",
      name: normalizedLanguage === "en" ? "QST" : "TVQ",
      percentage: "9.975",
      scope: "ORDER",
    },
  ];
}

export async function squareFetch(path, options = {}) {
  const response = await fetch(`${getSquareBaseUrl()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Square-Version": "2026-06-18",
      Authorization: `Bearer ${env.square.accessToken}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.errors?.[0]?.detail ||
        data?.errors?.[0]?.code ||
        `Square request failed: ${response.status}`
    );

    error.status = response.status;
    error.errors = data?.errors || [];
    throw error;
  }

  return data;
}

// Recursively replaces every real (already-assigned) Square catalog id in
// this object graph -- top-level id, nested item_data.variations[].id,
// nested modifier_list_data.modifiers[].id -- with a fresh client-supplied
// temporary id (Square recognizes any string starting with "#" as "assign
// me a real id on create"), and drops every `version` field. Used when an
// id we had stored turns out not to exist on Square at all anymore (see
// the NOT_FOUND branch below) -- most commonly because it was created
// under a DIFFERENT Square environment (sandbox vs production each have
// their own catalog, entirely separate ids) than the one we're calling
// right now.
// `staleIdMap` (mutated in place) records original id -> temp id for
// every real id replaced, so the caller can later translate its OWN
// stored ids (products.square_item_id, product_color_variants.square_
// variation_id, kit_components.square_modifier_id, etc.) into whatever
// Square actually assigned this time -- see upsertCatalogObject below.
function convertToFreshCatalogObject(node, staleIdMap) {
  if (Array.isArray(node)) {
    return node.map((item) => convertToFreshCatalogObject(item, staleIdMap));
  }

  if (node && typeof node === "object") {
    const cloned = { ...node };

    if (typeof cloned.id === "string" && !cloned.id.startsWith("#")) {
      const freshId = `#fresh_${randomUUID()}`;
      staleIdMap.set(cloned.id, freshId);
      cloned.id = freshId;
    }

    delete cloned.version;

    // image_ids points at a SEPARATE catalog object (an ITEM_IMAGE,
    // uploaded via uploadImageToSquare in square.catalog.service.js) by
    // id, not something nested inside this same request -- so there's
    // no id here we can "freshen". Drop the reference instead of
    // leaving a pointer to an image that doesn't exist under this
    // environment's account. products.square_image_id (and each
    // variant's own square_image_id) stays set in the DB either way, so
    // syncProductToSquare()'s own image re-upload step won't kick back
    // in automatically here -- images just won't show up for whatever
    // Square environment triggered this fallback. Fine for a sandbox
    // test; if real sandbox images are ever needed, clear those two
    // columns first so that upload step re-runs.
    delete cloned.image_ids;

    for (const [key, value] of Object.entries(cloned)) {
      if (value && typeof value === "object") {
        cloned[key] = convertToFreshCatalogObject(value, staleIdMap);
      }
    }

    return cloned;
  }

  return node;
}

// Same idea as convertToFreshCatalogObject's image_ids handling, but for
// an object that otherwise upserts FINE (its own id/version are valid --
// see the "expected ITEM_IMAGE" branch below) and just needs that one
// stale reference dropped, not a full recreate.
function stripImageIdsDeep(node) {
  if (Array.isArray(node)) {
    return node.map((item) => stripImageIdsDeep(item));
  }

  if (node && typeof node === "object") {
    const cloned = { ...node };
    delete cloned.image_ids;

    for (const [key, value] of Object.entries(cloned)) {
      if (value && typeof value === "object") {
        cloned[key] = stripImageIdsDeep(value);
      }
    }

    return cloned;
  }

  return node;
}

export async function upsertCatalogObject(object) {
  try {
    return await squareFetch("/v2/catalog/object", {
      method: "POST",
      body: JSON.stringify({ idempotency_key: randomUUID(), object }),
    });
  } catch (err) {
    const errorText = err.message || "";
    console.log(">>> CATCH upsertCatalogObject:", errorText);

    // "Object `<id>` ... references an object with token `<id>`, which
    // does not exist. Expected an object of type ITEM_IMAGE." -- this
    // object's OWN id/version are fine (it upserts as a normal update),
    // but products.square_image_id (stored separately, set once by
    // uploadImageToSquare) points at an image that doesn't exist under
    // the account/environment we're calling right now. Retry once with
    // that reference dropped instead of failing the whole sync -- the
    // item just ends up with no image attached here, which
    // syncProductToSquare's own upload step won't fix automatically
    // (see convertToFreshCatalogObject's note on image_ids above), but a
    // missing image is a much smaller problem than syncFailing outright.
    const referencesMissingImage = errorText.includes(
      "Expected an object of type ITEM_IMAGE"
    );

    if (referencesMissingImage) {
      console.warn(
        `>>> RETRY: dropping a stale image_ids reference and retrying without it (image doesn't exist on this Square account/environment).`
      );

      const objectWithoutImages = stripImageIdsDeep(object);

      return await squareFetch("/v2/catalog/object", {
        method: "POST",
        body: JSON.stringify({ idempotency_key: randomUUID(), object: objectWithoutImages }),
      });
    }

    // "Received request to update nonexistent object <id>" -- the id we
    // had saved (from products/kit_components) doesn't exist on Square
    // at all under the credentials we're currently using. Recreate the
    // whole object fresh instead of updating: this is exactly what
    // happens the first time you sync a catalog that was previously
    // synced to a DIFFERENT Square environment (e.g. switching
    // SQUARE_ENVIRONMENT from production to sandbox for a test).
    const isNonexistentObject = errorText.includes("nonexistent object");

    if (isNonexistentObject) {
      console.warn(
        `>>> RETRY: id ${object.id} doesn't exist on this Square account/environment -- recreating as a brand-new catalog object instead of updating.`
      );

      const staleIdMap = new Map(); // original id -> temp "#fresh_..." id
      const freshObject = convertToFreshCatalogObject(object, staleIdMap);

      const freshData = await squareFetch("/v2/catalog/object", {
        method: "POST",
        body: JSON.stringify({ idempotency_key: randomUUID(), object: freshObject }),
      });

      // Translate every id we replaced back to whatever Square actually
      // assigned it this time, so callers can update their OWN stored
      // columns (square_variation_id, square_modifier_id, ...) even
      // though these ids never went through the usual `#variation_<n>` /
      // `#modifier_<n>_<n>` naming convention their id_mappings-parsing
      // code looks for (that convention is only used the FIRST time a
      // variant/modifier is created -- this path is for recreating one
      // that already had an id, just not one valid here).
      const freshIdMappings = freshData.id_mappings || [];
      const staleIdToRealId = {};

      for (const [originalId, tempId] of staleIdMap.entries()) {
        if (tempId === freshObject.id) {
          // The top-level object's own real id is already right there
          // on the response -- no id_mappings entry for it.
          if (freshData.catalog_object?.id) {
            staleIdToRealId[originalId] = freshData.catalog_object.id;
          }
          continue;
        }

        const resolvedMapping = freshIdMappings.find(
          (mapping) => mapping.client_object_id === tempId
        );

        if (resolvedMapping) {
          staleIdToRealId[originalId] = resolvedMapping.object_id;
        }
      }

      return { ...freshData, staleIdToRealId };
    }

    const isVersionMismatch = errorText.includes("VERSION_MISMATCH");
    const match = errorText.match(/object_id=(\w+)/);
    const conflictingId = match?.[1];

    console.log(`>>> isVersionMismatch=${isVersionMismatch}, conflictingId=${conflictingId}`);

    if (!isVersionMismatch || !conflictingId) {
      throw err;
    }

    console.warn(`>>> RETRY: refetch version actuelle pour ${conflictingId}`);
    const current = await squareFetch(`/v2/catalog/object/${conflictingId}`, { method: "GET" });
    const newVersion = current.object.version;
    console.log(">>> Nouvelle version obtenue:", newVersion);

    if (object.id === conflictingId) {
      object.version = newVersion;
    }

    if (object.item_data?.variations) {
      for (const variation of object.item_data.variations) {
        if (variation.id === conflictingId) {
          variation.version = newVersion;
        }
      }
    }

    if (object.modifier_list_data?.modifiers) {
      for (const modifier of object.modifier_list_data.modifiers) {
        if (modifier.id === conflictingId) {
          modifier.version = newVersion;
        }
      }
    }

    return await squareFetch("/v2/catalog/object", {
      method: "POST",
      body: JSON.stringify({ idempotency_key: randomUUID(), object }),
    });
  }
}
export async function getSquareOrder(squareOrderId) {
  const data = await squareFetch(`/v2/orders/${squareOrderId}`);

  return data.order;
}

export async function getSquarePayment(paymentId) {
  const data = await squareFetch(`/v2/payments/${paymentId}`);

  return data.payment;
}

export async function createSquarePaymentLink({
  normalizedLanguage,
  lineItems,
  serviceCharges,
  redirectUrl,
  buyerLanguageKey,
  orderNote,
}) {
  assertSquareConfig();

  const squareBody = {
    idempotency_key: randomUUID(),
    order: {
      location_id: env.square.locationId,
      line_items: lineItems,
      taxes: buildSquareTaxes(normalizedLanguage),
      ...(serviceCharges?.length ? { service_charges: serviceCharges } : {}),
    },
    checkout_options: {
      buyer_language_key: buyerLanguageKey,
      redirect_url: redirectUrl,
      ask_for_shipping_address: true,
      enable_coupon: true,
    },
  };

  if (orderNote?.trim()) {
    squareBody.payment_note = orderNote.trim();
  }

  console.log("Square checkout payload:", JSON.stringify(squareBody, null, 2));

  const squareData = await squareFetch("/v2/online-checkout/payment-links", {
    method: "POST",
    body: JSON.stringify(squareBody),
  });

  return {
    squareBody,
    paymentLink: squareData.payment_link,
  };
}

export function verifySquareWebhookSignature(req, rawBody) {
  if (env.square.skipWebhookSignature) {
    console.warn("Square webhook signature validation skipped.");
    return true;
  }

  const signatureKey = env.square.webhookSignatureKey;
  const webhookUrl = env.square.webhookUrl;
  const squareSignature = req.get("x-square-hmacsha256-signature");

  if (!signatureKey || !webhookUrl || !squareSignature) {
    console.warn("Missing Square webhook signature config or header.");

    return false;
  }

  const hmac = createHmac("sha256", signatureKey);
  hmac.update(webhookUrl + rawBody);

  const expectedSignature = hmac.digest("base64");

  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(squareSignature);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}