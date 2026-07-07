import pool from "../db/pool.js";
import { getSquareOrder, getSquarePayment } from "./square.service.js";
import { updateLocalOrderShippingFromSquareOrder } from "./shipping.service.js";

export async function createLocalOrder({
  paymentLink,
  normalizedLanguage,
  normalizedItems,
  subtotalCents,
  taxCents,
  totalCents,
  orderNote,
  squareBody,
}) {
  const result = await pool.query(
    `
    INSERT INTO orders (
      status,
      square_order_id,
      square_payment_link_id,
      checkout_url,
      language,
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
      paymentLink.order_id,
      paymentLink.id,
      paymentLink.url,
      normalizedLanguage,
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
      square_payment_snapshot = $3::jsonb,
      paid_at = CASE
        WHEN $1 = 'paid' THEN COALESCE(paid_at, NOW())
        ELSE paid_at
      END,
      failed_at = CASE
        WHEN $1 = 'failed' THEN COALESCE(failed_at, NOW())
        ELSE failed_at
      END
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

export function getPaymentIdFromSquareOrder(squareOrder) {
  const tenders = squareOrder?.tenders || [];

  if (!Array.isArray(tenders) || tenders.length === 0) {
    return null;
  }

  return tenders[0]?.payment_id || tenders[0]?.id || null;
}

export async function syncLocalOrderFromSquareOrder(squareOrderId) {
  const squareOrder = await getSquareOrder(squareOrderId);
  const paymentId = getPaymentIdFromSquareOrder(squareOrder);

  if (!paymentId) {
    const shippingOrder = await updateLocalOrderShippingFromSquareOrder(
      squareOrder,
      null
    );

    console.log("Square order has no payment/tender yet:", {
      squareOrderId,
      state: squareOrder?.state,
    });

    return {
      synced: Boolean(shippingOrder),
      reason: "Square order has no payment/tender yet.",
      squareOrder,
      payment: null,
      localOrder: null,
      shippingOrder,
    };
  }

  const payment = await getSquarePayment(paymentId);
  const localOrder = await updateLocalOrderFromSquarePayment(payment);
  const shippingOrder = await updateLocalOrderShippingFromSquareOrder(
    squareOrder,
    payment
  );

  return {
    synced: Boolean(localOrder || shippingOrder),
    reason:
      localOrder || shippingOrder
        ? "Local order updated."
        : "No matching local order found.",
    squareOrder,
    payment,
    localOrder,
    shippingOrder,
  };
}

export async function findLocalOrderById(id) {
  const result = await pool.query(
    `
    SELECT id, square_order_id
    FROM orders
    WHERE id = $1;
    `,
    [id]
  );

  return result.rows[0] || null;
}

export async function getOrderSummaryById(id) {
  const result = await pool.query(
    `
    SELECT
      id,
      status,
      language,
      subtotal_cents,
      tax_cents,
      total_cents,
      currency,

      customer_email,
      customer_phone,
      customer_first_name,
      customer_last_name,

      shipping_address_line_1,
      shipping_address_line_2,
      shipping_locality,
      shipping_province,
      shipping_postal_code,
      shipping_country,

      cart_snapshot,

      paid_at,
      created_at,
      updated_at
    FROM orders
    WHERE id = $1;
    `,
    [id]
  );

  const order = result.rows[0];

  if (!order) {
    return null;
  }

  return {
    id: order.id,
    status: order.status,
    language: order.language,

    customer: {
      email: order.customer_email,
      phone: order.customer_phone,
      firstName: order.customer_first_name,
      lastName: order.customer_last_name,
    },

    shippingAddress: {
      line1: order.shipping_address_line_1,
      line2: order.shipping_address_line_2,
      locality: order.shipping_locality,
      province: order.shipping_province,
      postalCode: order.shipping_postal_code,
      country: order.shipping_country,
    },

    totals: {
      subtotalCents: order.subtotal_cents,
      taxCents: order.tax_cents,
      totalCents: order.total_cents,
      currency: order.currency,
    },

    items: Array.isArray(order.cart_snapshot) ? order.cart_snapshot : [],

    paidAt: order.paid_at,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  };
}