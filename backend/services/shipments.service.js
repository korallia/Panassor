import pool from "../db/pool.js";

import { hasRequiredShippingRecipient } from "./shipping.service.js";

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
      cart_snapshot
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
      country
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
      $10
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