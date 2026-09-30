// =========================================
// ENVOIS -- ACCÈS À LA BASE DE DONNÉES
//
// Seulement des lectures et écritures dans shipments, shipment_items et
// shipment_events. Aucune logique d'affaires, aucun appel externe
// (Square, Discord, courriel) : ça, c'est dans shipmentCreation.service.js,
// shipmentTracking.service.js et discord/discordManager.js.
// =========================================

import pool from "../../db/pool.js";

export async function getOrderForShipment(orderId) {
  const result = await pool.query(
    `
    SELECT
      id,
      order_number,
      status,
      cart_snapshot,
      total_cents,
      currency,
      selected_carrier,
      shipping_carrier_label,
      shipping_service_label,
      shipping_cents,
      discount_cents,
      discount_label,
      paid_total_cents
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

export async function refreshShipmentRecipientFromSquare({
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

// Le courriel de suivi est parti (voir shipmentTracking.service.js).
export async function markTrackingEmailSent(shipmentId) {
  await pool.query(
    `UPDATE shipments SET tracking_email_sent_at = NOW() WHERE id = $1;`,
    [shipmentId]
  );
}

// Id du message Discord de la commande, pour le modifier plus tard
// (voir discord/discordManager.js).
export async function saveDiscordMessageId(shipmentId, discordMessageId) {
  await pool.query(
    `UPDATE shipments SET discord_message_id = $1 WHERE id = $2;`,
    [discordMessageId, shipmentId]
  );
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
