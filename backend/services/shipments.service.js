import { randomUUID } from "crypto";

import pool from "../db/pool.js";

import { hasRequiredShippingRecipient } from "./shipping.service.js";
import { notifyNewOrderShipment } from "./discord.service.js";
import { buildTrackingUrl, sendTrackingEmail } from "./trackingEmail.service.js";
import { editShipmentDiscordStatus } from "./discord.service.js";

function normalizeCartSnapshot(cartSnapshot) {
  if (Array.isArray(cartSnapshot)) {
    return cartSnapshot;
  }

  if (typeof cartSnapshot === "string") {
    try {
      const parsedCartSnapshot = JSON.parse(cartSnapshot);
      return Array.isArray(parsedCartSnapshot) ? parsedCartSnapshot : [];
    } catch {
      return [];
    }
  }

  return [];
}

function normalizeQuantity(quantity) {
  const parsedQuantity = Number(quantity);

  if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
    return 1;
  }

  return Math.floor(parsedQuantity);
}

export async function getOrderForShipment(orderId) {
  const result = await pool.query(
    `
    SELECT
      id,
      status,
      cart_snapshot,
      total_cents,
      currency,
      selected_carrier,
      shipping_carrier_label,
      shipping_service_label,
      shipping_cents
    FROM orders
    WHERE id = $1;
    `,
    [orderId]
  );

  return result.rows[0] || null;
}

export async function findShipmentByOrderId(orderId) {
  const result = await pool.query(
    `
    SELECT
      id,
      order_id,
      status,

      recipient_display_name,
      recipient_email,
      recipient_phone,

      address_line_1,
      address_line_2,
      locality,
      province,
      postal_code,
      country,

      carrier,
      tracking_number,
      tracking_url,

      admin_access_token,
      tracking_email_sent_at,
      discord_message_id,

      notes,
      created_at,
      updated_at
    FROM shipments
    WHERE order_id = $1;
    `,
    [orderId]
  );

  return result.rows[0] || null;
}

export async function findShipmentById(shipmentId) {
  const result = await pool.query(
    `
    SELECT
      id,
      order_id,
      status,

      recipient_display_name,
      recipient_email,
      recipient_phone,

      address_line_1,
      address_line_2,
      locality,
      province,
      postal_code,
      country,

      carrier,
      tracking_number,
      tracking_url,

      admin_access_token,
      tracking_email_sent_at,
      discord_message_id,

      notes,
      created_at,
      updated_at
    FROM shipments
    WHERE id = $1;
    `,
    [shipmentId]
  );

  return result.rows[0] || null;
}

export async function getShipmentItems(shipmentId) {
  const result = await pool.query(
    `
    SELECT
      id,
      shipment_id,
      parent_shipment_item_id,

      product_id,
      product_slug,
      cart_key,

      type,
      name,

      color_name,
      color_key,

      quantity,
      unit_price_cents,
      total_price_cents,

      status,
      sort_order,

      created_at,
      updated_at
    FROM shipment_items
    WHERE shipment_id = $1
    ORDER BY sort_order ASC, id ASC;
    `,
    [shipmentId]
  );

  return result.rows;
}

export async function getShipmentEvents(shipmentId) {
  const result = await pool.query(
    `
    SELECT
      id,
      shipment_id,
      shipment_item_id,

      event_type,
      previous_status,
      new_status,

      source,
      actor_name,
      actor_external_id,

      message,
      created_at
    FROM shipment_events
    WHERE shipment_id = $1
    ORDER BY created_at ASC, id ASC;
    `,
    [shipmentId]
  );

  return result.rows;
}

export async function getShipmentDetailsById(shipmentId) {
  const shipment = await findShipmentById(shipmentId);

  if (!shipment) {
    return null;
  }

  const [items, events] = await Promise.all([
    getShipmentItems(shipment.id),
    getShipmentEvents(shipment.id),
  ]);

  return {
    ...shipment,
    items,
    events,
  };
}

export async function getShipmentDetailsByOrderId(orderId) {
  const shipment = await findShipmentByOrderId(orderId);

  if (!shipment) {
    return null;
  }

  const [items, events] = await Promise.all([
    getShipmentItems(shipment.id),
    getShipmentEvents(shipment.id),
  ]);

  return {
    ...shipment,
    items,
    events,
  };
}

export async function createShipmentEvent({
  shipmentId,
  shipmentItemId = null,
  eventType,
  previousStatus = null,
  newStatus = null,
  source = "system",
  actorName = null,
  actorExternalId = null,
  message = null,
}) {
  const result = await pool.query(
    `
    INSERT INTO shipment_events (
      shipment_id,
      shipment_item_id,

      event_type,
      previous_status,
      new_status,

      source,
      actor_name,
      actor_external_id,

      message
    )
    VALUES (
      $1,
      $2,

      $3,
      $4,
      $5,

      $6,
      $7,
      $8,

      $9
    )
    RETURNING id;
    `,
    [
      shipmentId,
      shipmentItemId,

      eventType,
      previousStatus,
      newStatus,

      source,
      actorName,
      actorExternalId,

      message,
    ]
  );

  return result.rows[0];
}

async function createShipmentFromOrder({ order, shippingRecipient }) {
  // Generated here (not a DB default) to match the existing
  // orders.thank_you_token pattern -- a secret token in a link, not a
  // real login, giving access to just this one shipment's tracking-entry
  // page (see shipments.controller.js's getShipmentTrackingEntry).
  const adminAccessToken = randomUUID();

  const result = await pool.query(
    `
    INSERT INTO shipments (
      order_id,
      status,

      recipient_display_name,
      recipient_email,
      recipient_phone,

      address_line_1,
      address_line_2,
      locality,
      province,
      postal_code,
      country,

      carrier,
      admin_access_token
    )
    VALUES (
      $1,
      'pending',

      $2,
      $3,
      $4,

      $5,
      $6,
      $7,
      $8,
      $9,
      $10,

      $11,
      $12
    )
    RETURNING
      id,
      order_id,
      status,

      recipient_display_name,
      recipient_email,
      recipient_phone,

      address_line_1,
      address_line_2,
      locality,
      province,
      postal_code,
      country,

      carrier,
      tracking_number,
      tracking_url,

      admin_access_token,
      tracking_email_sent_at,
      discord_message_id,

      notes,
      created_at,
      updated_at;
    `,
    [
      order.id,

      shippingRecipient.recipientDisplayName,
      shippingRecipient.recipientEmail,
      shippingRecipient.recipientPhone,

      shippingRecipient.address.line1,
      shippingRecipient.address.line2,
      shippingRecipient.address.locality,
      shippingRecipient.address.province,
      shippingRecipient.address.postalCode,
      shippingRecipient.address.country,

      // Set once at checkout time from the shopper's chosen shipping
      // option (orders.selected_carrier) -- NULL for any order placed
      // before this existed, or if shipping validation somehow didn't
      // run. Korallia can still fill it in manually on the tracking-entry
      // page either way.
      order.selected_carrier || null,
      adminAccessToken,
    ]
  );

  const shipment = result.rows[0];

  await createShipmentEvent({
    shipmentId: shipment.id,
    eventType: "shipment_created",
    newStatus: shipment.status,
    message: `Shipment created for order #${order.id}.`,
  });

  return shipment;
}

async function createShipmentItemsFromOrder({ shipmentId, order }) {
  const cartItems = normalizeCartSnapshot(order.cart_snapshot);

  for (const [itemIndex, item] of cartItems.entries()) {
    const quantity = normalizeQuantity(item.quantity);

    const parentResult = await pool.query(
      `
      INSERT INTO shipment_items (
        shipment_id,
        parent_shipment_item_id,

        product_id,
        product_slug,
        cart_key,

        type,
        name,

        color_name,
        color_key,

        quantity,
        unit_price_cents,
        total_price_cents,

        status,
        sort_order
      )
      VALUES (
        $1,
        NULL,

        $2,
        $3,
        $4,

        $5,
        $6,

        $7,
        $8,

        $9,
        $10,
        $11,

        'pending',
        $12
      )
      RETURNING id;
      `,
      [
        shipmentId,

        item.productId || null,
        item.productSlug || null,
        item.cartKey || null,

        item.type || "product",
        item.name || "Produit Panassor",

        item.colorName || null,
        item.colorKey || null,

        quantity,
        Number(item.unitPriceCents || 0),
        Number(item.totalPriceCents || 0),

        itemIndex,
      ]
    );

    const parentShipmentItem = parentResult.rows[0];

    await createShipmentEvent({
      shipmentId,
      shipmentItemId: parentShipmentItem.id,
      eventType: "shipment_item_created",
      newStatus: "pending",
      message: `Shipment item created: ${item.name || "Produit Panassor"}.`,
    });

    if (Array.isArray(item.selectedItems) && item.selectedItems.length > 0) {
      for (const [selectedIndex, selectedItem] of item.selectedItems.entries()) {
        const childResult = await pool.query(
          `
          INSERT INTO shipment_items (
            shipment_id,
            parent_shipment_item_id,

            product_id,
            product_slug,
            cart_key,

            type,
            name,

            color_name,
            color_key,

            quantity,
            unit_price_cents,
            total_price_cents,

            status,
            sort_order
          )
          VALUES (
            $1,
            $2,

            $3,
            $4,
            NULL,

            'selected_item',
            $5,

            NULL,
            NULL,

            1,
            0,
            0,

            'pending',
            $6
          )
          RETURNING id;
          `,
          [
            shipmentId,
            parentShipmentItem.id,

            selectedItem.productId || null,
            selectedItem.productSlug || null,
            selectedItem.name || "Outil sélectionné",

            itemIndex * 100 + selectedIndex + 1,
          ]
        );

        const childShipmentItem = childResult.rows[0];

        await createShipmentEvent({
          shipmentId,
          shipmentItemId: childShipmentItem.id,
          eventType: "shipment_item_created",
          newStatus: "pending",
          message: `Selected item created: ${
            selectedItem.name || "Outil sélectionné"
          }.`,
        });
      }
    }
  }
}

async function refreshShipmentRecipientFromSquare({
  shipmentId,
  shippingRecipient,
}) {
  const result = await pool.query(
    `
    UPDATE shipments
    SET
      recipient_display_name = COALESCE($1, recipient_display_name),
      recipient_email = COALESCE($2, recipient_email),
      recipient_phone = COALESCE($3, recipient_phone),

      address_line_1 = COALESCE($4, address_line_1),
      address_line_2 = COALESCE($5, address_line_2),
      locality = COALESCE($6, locality),
      province = COALESCE($7, province),
      postal_code = COALESCE($8, postal_code),
      country = COALESCE($9, country)
    WHERE id = $10
    RETURNING
      id,
      order_id,
      status,

      recipient_display_name,
      recipient_email,
      recipient_phone,

      address_line_1,
      address_line_2,
      locality,
      province,
      postal_code,
      country,

      carrier,
      tracking_number,
      tracking_url,

      notes,
      created_at,
      updated_at;
    `,
    [
      shippingRecipient.recipientDisplayName,
      shippingRecipient.recipientEmail,
      shippingRecipient.recipientPhone,

      shippingRecipient.address.line1,
      shippingRecipient.address.line2,
      shippingRecipient.address.locality,
      shippingRecipient.address.province,
      shippingRecipient.address.postalCode,
      shippingRecipient.address.country,

      shipmentId,
    ]
  );

  return result.rows[0] || null;
}

export async function ensureShipmentForOrderId(orderId, shippingRecipient) {
  const order = await getOrderForShipment(orderId);

  if (!order) {
    return null;
  }

  if (order.status !== "paid") {
    console.log("Shipment not created because order is not paid:", {
      orderId: order.id,
      status: order.status,
    });

    return null;
  }

  const existingShipment = await findShipmentByOrderId(order.id);

  if (!hasRequiredShippingRecipient(shippingRecipient)) {
    console.log(
      "Shipment not created because Square shipping recipient is incomplete:",
      {
        orderId: order.id,
        hasRecipient: Boolean(shippingRecipient),
        hasLine1: Boolean(shippingRecipient?.address?.line1),
        hasLocality: Boolean(shippingRecipient?.address?.locality),
        hasProvince: Boolean(shippingRecipient?.address?.province),
        hasPostalCode: Boolean(shippingRecipient?.address?.postalCode),
        hasCountry: Boolean(shippingRecipient?.address?.country),
      }
    );

    return existingShipment || null;
  }

  if (existingShipment) {
    const refreshedShipment = await refreshShipmentRecipientFromSquare({
      shipmentId: existingShipment.id,
      shippingRecipient,
    });

    return refreshedShipment || existingShipment;
  }

  const shipment = await createShipmentFromOrder({
    order,
    shippingRecipient,
  });

  await createShipmentItemsFromOrder({
    shipmentId: shipment.id,
    order,
  });

  // This is a brand-new shipment (i.e. a brand-new paid order with
  // known shipping details) — notify Discord. Not awaited/blocking:
  // notifyNewOrderShipment already swallows its own errors so a
  // Discord hiccup never breaks order/shipment creation.
  const shipmentItems = await getShipmentItems(shipment.id);
  notifyNewOrderShipment({ order, shipment, shipmentItems });

  return shipment;
}

export async function updateShipmentStatus({
  shipmentId,
  status,
  source = "system",
  actorName = null,
  actorExternalId = null,
  message = null,
}) {
  const currentShipment = await findShipmentById(shipmentId);

  if (!currentShipment) {
    return null;
  }

  if (currentShipment.status === status) {
    return currentShipment;
  }

  const result = await pool.query(
    `
    UPDATE shipments
    SET
      status = $1::shipment_status
    WHERE id = $2
    RETURNING
      id,
      order_id,
      status,

      recipient_display_name,
      recipient_email,
      recipient_phone,

      address_line_1,
      address_line_2,
      locality,
      province,
      postal_code,
      country,

      carrier,
      tracking_number,
      tracking_url,

      notes,
      created_at,
      updated_at;
    `,
    [status, shipmentId]
  );

  const updatedShipment = result.rows[0];

  await createShipmentEvent({
    shipmentId,
    eventType: "shipment_status_updated",
    previousStatus: currentShipment.status,
    newStatus: status,
    source,
    actorName,
    actorExternalId,
    message:
      message ||
      `Shipment status updated from ${currentShipment.status} to ${status}.`,
  });

  return updatedShipment;
}

export async function updateShipmentItemStatus({
  shipmentItemId,
  status,
  source = "system",
  actorName = null,
  actorExternalId = null,
  message = null,
}) {
  const currentResult = await pool.query(
    `
    SELECT
      id,
      shipment_id,
      status,
      name
    FROM shipment_items
    WHERE id = $1;
    `,
    [shipmentItemId]
  );

  const currentItem = currentResult.rows[0];

  if (!currentItem) {
    return null;
  }

  if (currentItem.status === status) {
    return currentItem;
  }

  const result = await pool.query(
    `
    UPDATE shipment_items
    SET
      status = $1::shipment_item_status
    WHERE id = $2
    RETURNING
      id,
      shipment_id,
      parent_shipment_item_id,

      product_id,
      product_slug,
      cart_key,

      type,
      name,

      color_name,
      color_key,

      quantity,
      unit_price_cents,
      total_price_cents,

      status,
      sort_order,

      created_at,
      updated_at;
    `,
    [status, shipmentItemId]
  );

  const updatedItem = result.rows[0];

  await createShipmentEvent({
    shipmentId: currentItem.shipment_id,
    shipmentItemId: currentItem.id,
    eventType: "shipment_item_status_updated",
    previousStatus: currentItem.status,
    newStatus: status,
    source,
    actorName,
    actorExternalId,
    message:
      message ||
      `Shipment item "${currentItem.name}" updated from ${currentItem.status} to ${status}.`,
  });

  return updatedItem;
}

export async function updateShipmentTracking({
  shipmentId,
  carrier = null,
  trackingNumber = null,
  trackingUrl = null,
  source = "system",
  actorName = null,
  actorExternalId = null,
}) {
  const result = await pool.query(
    `
    UPDATE shipments
    SET
      carrier = COALESCE($1, carrier),
      tracking_number = COALESCE($2, tracking_number),
      tracking_url = COALESCE($3, tracking_url)
    WHERE id = $4
    RETURNING
      id,
      order_id,
      status,

      recipient_display_name,
      recipient_email,
      recipient_phone,

      address_line_1,
      address_line_2,
      locality,
      province,
      postal_code,
      country,

      carrier,
      tracking_number,
      tracking_url,
      discord_message_id,

      notes,
      created_at,
      updated_at;
    `,
    [carrier, trackingNumber, trackingUrl, shipmentId]
  );

  const updatedShipment = result.rows[0];

  if (!updatedShipment) {
    return null;
  }

  await createShipmentEvent({
    shipmentId,
    eventType: "shipment_tracking_updated",
    source,
    actorName,
    actorExternalId,
    message: `Tracking updated for shipment #${shipmentId}.`,
  });

  return updatedShipment;
}
const TRACKING_ENTRY_CARRIERS = new Set(["postes_canada", "purolator"]);

function trackingEntryError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Powers the tracking-entry page (see shipments.controller.js's
// getShipmentTrackingEntry/postShipmentTrackingEntry) -- the key is
// shipments.admin_access_token, a per-shipment secret link (same idea as
// orders.thank_you_token), not a real login.
export async function getShipmentForTrackingEntry({ shipmentId, key }) {
  const shipment = await findShipmentById(shipmentId);

  if (!shipment || !key || shipment.admin_access_token !== key) {
    return null;
  }

  const shipmentItems = await getShipmentItems(shipment.id);

  // The shipping option the shopper actually picked and paid for at
  // checkout -- shown on the tracking-entry page so Korallia knows which
  // service to buy at the counter, since shipment.carrier (the dropdown
  // she fills in below) is entered manually and defaults to "postes_canada"
  // regardless of what was paid for.
  const order = await getOrderForShipment(shipment.order_id);

  return { shipment, shipmentItems, order };
}

// Saves the carrier/tracking number Korallia enters on that page, marks
// the shipment "shipped", and sends the customer their tracking email --
// all in one step since there's no separate "confirm" action in the UI.
// Re-submitting (e.g. to fix a typo) just re-sends the email with the
// corrected info rather than tracking a stricter "already sent" guard --
// simplest option, and a rare enough case that a duplicate corrected
// email is a fine trade-off.
export async function submitShipmentTracking({
  shipmentId,
  key,
  carrier,
  trackingNumber,
  trackingUrl,
}) {
  const shipment = await findShipmentById(shipmentId);

  if (!shipment || !key || shipment.admin_access_token !== key) {
    throw trackingEntryError(404, "SHIPMENT_NOT_FOUND");
  }

  const normalizedCarrier = String(carrier || "").trim();
  const normalizedTrackingNumber = String(trackingNumber || "").trim();

  if (!TRACKING_ENTRY_CARRIERS.has(normalizedCarrier)) {
    throw trackingEntryError(400, "INVALID_CARRIER");
  }

  if (!normalizedTrackingNumber) {
    throw trackingEntryError(400, "MISSING_TRACKING_NUMBER");
  }

  const resolvedTrackingUrl =
    String(trackingUrl || "").trim() ||
    buildTrackingUrl(normalizedCarrier, normalizedTrackingNumber);

  const updatedShipment = await updateShipmentTracking({
    shipmentId,
    carrier: normalizedCarrier,
    trackingNumber: normalizedTrackingNumber,
    trackingUrl: resolvedTrackingUrl,
    source: "admin-tracking-form",
  });

  await updateShipmentStatus({
    shipmentId,
    status: "shipped",
    source: "admin-tracking-form",
    message: `Tracking entered via the admin form (${normalizedCarrier} ${normalizedTrackingNumber}).`,
  });

  const order = await getOrderForShipment(updatedShipment.order_id);
  const shipmentItems = await getShipmentItems(shipmentId);

  try {
    await sendTrackingEmail({
      recipientEmail: updatedShipment.recipient_email,
      recipientName: updatedShipment.recipient_display_name,
      orderId: order?.id ?? updatedShipment.order_id,
      shipmentItems,
      carrier: normalizedCarrier,
      trackingNumber: normalizedTrackingNumber,
      trackingUrl: resolvedTrackingUrl,
    });

    await pool.query(
      `UPDATE shipments SET tracking_email_sent_at = NOW() WHERE id = $1;`,
      [shipmentId]
    );
  } catch (error) {
    // The tracking is saved either way -- don't lose that just because
    // the email send hiccuped. Surface it so the admin page can tell
    // Korallia to retry the send instead of assuming it went out.
    console.error(
      `Tracking email failed to send for shipment #${shipmentId}:`,
      error
    );
    throw trackingEntryError(502, "TRACKING_SAVED_EMAIL_FAILED");
  }

  // Move the Discord order message from "reçue" to "en chemin" now that
  // a real tracking number exists. Never throws (see discord.service.js)
  // -- a Discord hiccup here must never undo the tracking/email work
  // above, which already succeeded.
  await editShipmentDiscordStatus({
    order,
    shipment: updatedShipment,
    shipmentItems,
    stage: "in_transit",
    trackingUrl: resolvedTrackingUrl,
  });

  return {
    ...updatedShipment,
    status: "shipped",
    tracking_email_sent_at: new Date().toISOString(),
  };
}

// =========================================
// AUTOMATIC DELIVERY DETECTION (carrier tracking poller)
//
// Used by jobs/trackingPoller.js -- see that file for the actual polling
// loop and the carrier-specific tracking calls.
// =========================================

export async function getShipmentsAwaitingDelivery() {
  const result = await pool.query(
    `
    SELECT
      id,
      order_id,
      carrier,
      tracking_number,
      discord_message_id,

      recipient_display_name,
      recipient_email,
      recipient_phone,

      address_line_1,
      address_line_2,
      locality,
      province,
      postal_code,
      country,

      tracking_url
    FROM shipments
    WHERE status = 'shipped'
      AND carrier IS NOT NULL
      AND tracking_number IS NOT NULL
    ORDER BY updated_at ASC;
    `
  );

  return result.rows;
}

export async function touchShipmentTrackingCheckedAt(shipmentId) {
  await pool.query(
    `UPDATE shipments SET carrier_tracking_checked_at = NOW() WHERE id = $1;`,
    [shipmentId]
  );
}

export async function markShipmentDelivered({ shipmentId, deliveredAt }) {
  const currentShipment = await findShipmentById(shipmentId);

  if (!currentShipment || currentShipment.status === "delivered") {
    return currentShipment;
  }

  const result = await pool.query(
    `
    UPDATE shipments
    SET
      status = 'delivered'::shipment_status,
      delivered_at = COALESCE($1::timestamp, NOW()),
      carrier_tracking_checked_at = NOW()
    WHERE id = $2
    RETURNING
      id,
      order_id,
      status,

      recipient_display_name,
      recipient_email,
      recipient_phone,

      address_line_1,
      address_line_2,
      locality,
      province,
      postal_code,
      country,

      carrier,
      tracking_number,
      tracking_url,
      discord_message_id,

      notes,
      created_at,
      updated_at;
    `,
    [deliveredAt || null, shipmentId]
  );

  const updatedShipment = result.rows[0];

  await createShipmentEvent({
    shipmentId,
    eventType: "shipment_status_updated",
    previousStatus: currentShipment.status,
    newStatus: "delivered",
    source: "carrier-tracking-poller",
    message: `Delivery detected automatically via carrier tracking (${currentShipment.carrier}).`,
  });

  return updatedShipment;
}
