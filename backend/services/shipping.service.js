function normalizeText(value) {
  const normalizedValue = String(value || "").trim();
  return normalizedValue || null;
}

function getShipmentFulfillments(squareOrder) {
  const fulfillments = squareOrder?.fulfillments;

  if (!Array.isArray(fulfillments)) {
    return [];
  }

  return fulfillments.filter(
    (fulfillment) =>
      fulfillment?.type === "SHIPMENT" &&
      fulfillment?.shipment_details?.recipient
  );
}

export function extractSquareShipmentRecipient(squareOrder) {
  const shipmentFulfillment = getShipmentFulfillments(squareOrder).find(
    (fulfillment) => fulfillment?.shipment_details?.recipient?.address
  );

  if (!shipmentFulfillment) {
    return null;
  }

  const recipient = shipmentFulfillment.shipment_details.recipient;
  const address = recipient.address || {};

  return {
    recipientDisplayName: normalizeText(recipient.display_name),
    recipientEmail: normalizeText(recipient.email_address),
    recipientPhone: normalizeText(recipient.phone_number),

    address: {
      line1: normalizeText(address.address_line_1),
      line2: normalizeText(address.address_line_2),
      locality: normalizeText(address.locality),
      province: normalizeText(address.administrative_district_level_1),
      postalCode: normalizeText(address.postal_code),
      country: normalizeText(address.country),
    },

    squareFulfillmentUid: shipmentFulfillment.uid || null,
  };
}

export function hasRequiredShippingRecipient(shippingRecipient) {
  return Boolean(
    shippingRecipient?.address?.line1 &&
      shippingRecipient?.address?.locality &&
      shippingRecipient?.address?.province &&
      shippingRecipient?.address?.postalCode &&
      shippingRecipient?.address?.country
  );
}