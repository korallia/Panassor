// =========================================
// ENVOIS -- CRÉATION
//
// D'une commande payée (avec l'adresse reçue de Square) à un envoi prêt à
// préparer : l'envoi, ses articles, puis l'annonce dans Discord.
// Appelé par le webhook Square et la synchro de la page merci.
// =========================================

import { randomUUID } from "crypto";

import pool from "../../db/pool.js";
import { hasRequiredShippingRecipient } from "../shipping.service.js";
import { announceNewOrder } from "../discord/discordManager.js";
import {
  createShipmentEvent,
  findShipmentByOrderId,
  getOrderForShipment,
  getShipmentItems,
  refreshShipmentRecipientFromSquare,
} from "./shipments.repository.js";
import { normalizeCartSnapshot, normalizeQuantity } from "./shipmentItems.util.js";

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
  // announceNewOrder already swallows its own errors so a
  // Discord hiccup never breaks order/shipment creation.
  const shipmentItems = await getShipmentItems(shipment.id);
  announceNewOrder({ order, shipment, shipmentItems });

  return shipment;
}
