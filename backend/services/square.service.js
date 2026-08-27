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

export async function upsertCatalogObject(object) {
  try {
    return await squareFetch("/v2/catalog/object", {
      method: "POST",
      body: JSON.stringify({ idempotency_key: randomUUID(), object }),
    });
  } catch (err) {
    const errorText = err.message || "";
    console.log(">>> CATCH upsertCatalogObject:", errorText);

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