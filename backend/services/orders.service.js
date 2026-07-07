import pool from "../db/pool.js";

import { getSquareOrder, getSquarePayment } from "./square.service.js";
import { extractSquareShipmentRecipient } from "./shipping.service.js";
import {
  ensureShipmentForOrderId,
  getShipmentDetailsByOrderId,
} from "./shipments.service.js";

export async function createPendingLocalOrder({
  thankYouToken,
  normalizedItems,
  subtotalCents,
  taxCents,
  totalCents,
  orderNote,
}) {
  const result = await pool.query(
    `
    INSERT INTO orders (
      status,
      thank_you_token,

      subtotal_cents,
      tax_cents,
      total_cents,
      currency,

      order_note,
      cart_snapshot
    )
    VALUES (
      'pending',
      $1,

      $2,
      $3,
      $4,
      'CAD',

      $5,
      $6::jsonb
    )
    RETURNING
      id,
      thank_you_token;
    `,
    [
      thankYouToken,

      subtotalCents,
      taxCents,
      totalCents,

      orderNote?.trim() || null,
      JSON.stringify(normalizedItems),
    ]
  );

  return result.rows[0];
}

export async function attachSquarePaymentLinkToLocalOrder({
  localOrderId,
  paymentLink,
  squareBody,
}) {
  const result = await pool.query(
    `
    UPDATE orders
    SET
      square_order_id = $1,
      square_payment_link_id = $2,
      checkout_url = $3,
      square_payload = $4::jsonb
    WHERE id = $5
    RETURNING
      id,
      square_order_id,
      square_payment_link_id,
      checkout_url;
    `,
    [
      paymentLink.order_id,
      paymentLink.id,
      paymentLink.url,
      JSON.stringify(squareBody),
      localOrderId,
    ]
  );

  return result.rows[0] || null;
}

export async function createLocalOrder({
  paymentLink,
  normalizedItems,
  subtotalCents,
  taxCents,
  totalCents,
  orderNote,
  squareBody,
  thankYouToken = null,
}) {
  const result = await pool.query(
    `
    INSERT INTO orders (
      status,
      thank_you_token,

      square_order_id,
      square_payment_link_id,
      checkout_url,

      subtotal_cents,
      tax_cents,
      total_cents,
      currency,

      order_note,
      cart_snapshot,
      square_payload
    )
    VALUES (
      'pending',
      $1,

      $2,
      $3,
      $4,

      $5,
      $6,
      $7,
      'CAD',

      $8,
      $9::jsonb,
      $10::jsonb
    )
    RETURNING id;
    `,
    [
      thankYouToken,

      paymentLink.order_id,
      paymentLink.id,
      paymentLink.url,

      subtotalCents,
      taxCents,
      totalCents,

      orderNote?.trim() || null,
      JSON.stringify(normalizedItems),
      JSON.stringify(squareBody),
    ]
  );

  return result.rows[0];
}

export function getLocalOrderStatusFromSquarePayment(payment) {
  if (payment.status === "COMPLETED") {
    return "paid";
  }

  if (payment.status === "FAILED" || payment.status === "CANCELED") {
    return "failed";
  }

  return null;
}

export async function updateLocalOrderFromSquarePayment(payment) {
  const nextStatus = getLocalOrderStatusFromSquarePayment(payment);

  if (!nextStatus) {
    console.log("Square payment status does not update local order yet:", {
      paymentId: payment.id,
      squareOrderId: payment.order_id,
      status: payment.status,
    });

    return null;
  }

  const result = await pool.query(
    `
    UPDATE orders
    SET
      status = $1::order_status,
      square_payment_id = $2,
      square_payment_snapshot = $3::jsonb
    WHERE square_order_id = $4
    RETURNING id, status;
    `,
    [nextStatus, payment.id, JSON.stringify(payment), payment.order_id]
  );

  const updatedOrder = result.rows[0];

  if (!updatedOrder) {
    console.warn("No local order found for Square payment:", {
      paymentId: payment.id,
      squareOrderId: payment.order_id,
      status: payment.status,
    });

    return null;
  }

  console.log("Local order updated from Square payment:", {
    localOrderId: updatedOrder.id,
    squareOrderId: payment.order_id,
    paymentId: payment.id,
    status: updatedOrder.status,
  });

  return updatedOrder;
}

export async function updateLocalOrderSquareOrderSnapshot(squareOrder) {
  if (!squareOrder?.id) {
    return null;
  }

  const result = await pool.query(
    `
    UPDATE orders
    SET
      square_order_snapshot = $1::jsonb
    WHERE square_order_id = $2
    RETURNING id, status;
    `,
    [JSON.stringify(squareOrder), squareOrder.id]
  );

  return result.rows[0] || null;
}

export function getPaymentIdFromSquareOrder(squareOrder) {
  const tenders = squareOrder?.tenders || [];

  if (!Array.isArray(tenders) || tenders.length === 0) {
    return null;
  }

  return tenders[0]?.payment_id || tenders[0]?.id || null;
}

export async function syncLocalOrderFromSquareOrder(squareOrderId) {
  const squareOrder = await getSquareOrder(squareOrderId);
  const snapshotOrder = await updateLocalOrderSquareOrderSnapshot(squareOrder);

  const paymentId = getPaymentIdFromSquareOrder(squareOrder);

  if (!paymentId) {
    console.log("Square order has no payment/tender yet:", {
      squareOrderId,
      state: squareOrder?.state,
    });

    return {
      synced: Boolean(snapshotOrder),
      reason: "Square order snapshot updated, but no payment/tender found.",
      squareOrder,
      payment: null,
      localOrder: snapshotOrder,
      shipment: null,
    };
  }

  const payment = await getSquarePayment(paymentId);
  const localOrder = await updateLocalOrderFromSquarePayment(payment);
  const shippingRecipient = extractSquareShipmentRecipient(squareOrder);

  let shipment = null;
  const shipmentOrderId = localOrder?.id || snapshotOrder?.id;

  if (shipmentOrderId) {
    shipment = await ensureShipmentForOrderId(
      shipmentOrderId,
      shippingRecipient
    );
  }

  return {
    synced: Boolean(localOrder || snapshotOrder || shipment),
    reason:
      localOrder || snapshotOrder || shipment
        ? "Local order updated."
        : "No matching local order found.",
    squareOrder,
    payment,
    localOrder: localOrder || snapshotOrder,
    shipment,
  };
}

export async function fakeSquarePaidShippingForLocalOrder(orderId) {
  const localOrder = await findLocalOrderById(orderId);

  if (!localOrder) {
    return null;
  }

  if (!localOrder.square_order_id) {
    throw new Error("Local order has no Square order ID");
  }

  const fakePayment = {
    id: `fake-payment-${localOrder.id}`,
    order_id: localOrder.square_order_id,
    status: "COMPLETED",
    source_type: "CARD",
    total_money: {
      amount: 33918,
      currency: "CAD",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const fakeSquareOrder = {
    id: localOrder.square_order_id,
    state: "COMPLETED",
    tenders: [
      {
        id: "fake-tender-1",
        payment_id: fakePayment.id,
      },
    ],
    fulfillments: [
      {
        uid: "fake-fulfillment-1",
        type: "SHIPMENT",
        state: "PROPOSED",
        shipment_details: {
          recipient: {
            display_name: "Jane Doe",
            email_address: "jane.doe@example.com",
            phone_number: "+12025550143",
            address: {
              address_line_1: "123 rue des Artisans",
              address_line_2: "Appartement 4",
              locality: "Montréal",
              administrative_district_level_1: "QC",
              postal_code: "H2X 1Y4",
              country: "CA",
            },
          },
        },
      },
    ],
  };

  const snapshotOrder = await updateLocalOrderSquareOrderSnapshot(
    fakeSquareOrder
  );

  const localOrderUpdate = await updateLocalOrderFromSquarePayment(fakePayment);

  const shippingRecipient = extractSquareShipmentRecipient(fakeSquareOrder);

  const shipmentOrderId = localOrderUpdate?.id || snapshotOrder?.id || orderId;

  const shipment = await ensureShipmentForOrderId(
    shipmentOrderId,
    shippingRecipient
  );

  return {
    localOrderId: orderId,
    squareOrderId: localOrder.square_order_id,
    fakePayment,
    fakeSquareOrder,
    localOrderUpdate,
    snapshotOrder,
    shippingRecipient,
    shipment,
  };
}

export async function findLocalOrderById(id) {
  const result = await pool.query(
    `
    SELECT
      id,
      square_order_id,
      thank_you_token
    FROM orders
    WHERE id = $1;
    `,
    [id]
  );

  return result.rows[0] || null;
}

function mapShipmentForOrderSummary(shipment) {
  if (!shipment) {
    return null;
  }

  return {
    id: shipment.id,
    status: shipment.status,

    recipient: {
      displayName: shipment.recipient_display_name,
      email: shipment.recipient_email,
      phone: shipment.recipient_phone,
    },

    address: {
      line1: shipment.address_line_1,
      line2: shipment.address_line_2,
      locality: shipment.locality,
      province: shipment.province,
      postalCode: shipment.postal_code,
      country: shipment.country,
    },

    tracking: {
      carrier: shipment.carrier,
      trackingNumber: shipment.tracking_number,
      trackingUrl: shipment.tracking_url,
    },

    notes: shipment.notes,
    createdAt: shipment.created_at,
    updatedAt: shipment.updated_at,
  };
}

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

export async function getOrderSummaryById(id, thankYouToken = null) {
  const queryParams = [id];
  let tokenCondition = "";

  if (thankYouToken) {
    queryParams.push(thankYouToken);
    tokenCondition = "AND thank_you_token = $2";
  }

  const result = await pool.query(
    `
    SELECT
      id,
      status,
      subtotal_cents,
      tax_cents,
      total_cents,
      currency,
      cart_snapshot,
      created_at,
      updated_at
    FROM orders
    WHERE id = $1
      ${tokenCondition};
    `,
    queryParams
  );

  const order = result.rows[0];

  if (!order) {
    return null;
  }

  const shipment = await getShipmentDetailsByOrderId(order.id);

  return {
    id: order.id,
    status: order.status,

    totals: {
      subtotalCents: order.subtotal_cents,
      taxCents: order.tax_cents,
      totalCents: order.total_cents,
      currency: order.currency,
    },

    items: normalizeCartSnapshot(order.cart_snapshot),

    shipment: mapShipmentForOrderSummary(shipment),

    createdAt: order.created_at,
    updatedAt: order.updated_at,
  };
}