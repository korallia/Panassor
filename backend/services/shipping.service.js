import pool from "../db/pool.js";

export function splitDisplayName(displayName = "") {
  const cleanedName = String(displayName || "").trim();

  if (!cleanedName) {
    return {
      firstName: null,
      lastName: null,
    };
  }

  const parts = cleanedName.split(/\s+/);

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: null,
    };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.at(-1),
  };
}

export function getShipmentRecipientFromSquareOrder(squareOrder) {
  const fulfillments = Array.isArray(squareOrder?.fulfillments)
    ? squareOrder.fulfillments
    : [];

  const shipmentFulfillment = fulfillments.find(
    (fulfillment) => fulfillment?.type === "SHIPMENT"
  );

  return shipmentFulfillment?.shipment_details?.recipient || null;
}

export function normalizeSquareAddress(address) {
  if (!address) {
    return {
      addressLine1: null,
      addressLine2: null,
      locality: null,
      province: null,
      postalCode: null,
      country: null,
    };
  }

  return {
    addressLine1: address.address_line_1 || null,
    addressLine2: address.address_line_2 || null,
    locality: address.locality || null,
    province: address.administrative_district_level_1 || null,
    postalCode: address.postal_code || null,
    country: address.country || null,
  };
}

export async function updateLocalOrderShippingFromSquareOrder(
  squareOrder,
  payment = null
) {
  const recipient = getShipmentRecipientFromSquareOrder(squareOrder);
  const address = normalizeSquareAddress(recipient?.address);
  const nameParts = splitDisplayName(recipient?.display_name);

  const email = recipient?.email_address || payment?.buyer_email_address || null;
  const phone = recipient?.phone_number || null;

  const result = await pool.query(
    `
    UPDATE orders
    SET
      customer_email = COALESCE($1, customer_email),
      customer_phone = COALESCE($2, customer_phone),
      customer_first_name = COALESCE($3, customer_first_name),
      customer_last_name = COALESCE($4, customer_last_name),

      shipping_address_line_1 = COALESCE($5, shipping_address_line_1),
      shipping_address_line_2 = COALESCE($6, shipping_address_line_2),
      shipping_locality = COALESCE($7, shipping_locality),
      shipping_province = COALESCE($8, shipping_province),
      shipping_postal_code = COALESCE($9, shipping_postal_code),
      shipping_country = COALESCE($10, shipping_country),

      square_order_snapshot = $11::jsonb
    WHERE square_order_id = $12
    RETURNING
      id,
      status,
      customer_email,
      customer_phone,
      customer_first_name,
      customer_last_name,
      shipping_address_line_1,
      shipping_address_line_2,
      shipping_locality,
      shipping_province,
      shipping_postal_code,
      shipping_country;
    `,
    [
      email,
      phone,
      nameParts.firstName,
      nameParts.lastName,
      address.addressLine1,
      address.addressLine2,
      address.locality,
      address.province,
      address.postalCode,
      address.country,
      JSON.stringify(squareOrder),
      squareOrder.id,
    ]
  );

  const updatedOrder = result.rows[0];

  if (!updatedOrder) {
    console.warn("No local order found while updating shipping address:", {
      squareOrderId: squareOrder.id,
    });

    return null;
  }

  console.log("Local order shipping/contact updated from Square order:", {
    localOrderId: updatedOrder.id,
    squareOrderId: squareOrder.id,
    shippingAddressLine1: updatedOrder.shipping_address_line_1,
    postalCode: updatedOrder.shipping_postal_code,
  });

  return updatedOrder;
}