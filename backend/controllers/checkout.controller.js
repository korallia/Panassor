import { randomUUID } from "crypto";

import { env } from "../config/env.js";
import {
  normalizeLanguage,
  getBuyerLanguageKey,
  getThankYouPath,
} from "../utils/language.js";
import {
  calculateSubtotalCents,
  calculateTaxCents,
} from "../utils/money.js";
import {
  normalizeCartItem,
  validateCheckoutItems,
  buildSquareLineItems,
} from "../services/cart.service.js";
import { validateSelectedShippingOption } from "../services/shippingQuote.service.js";
import { createSquarePaymentLink } from "../services/square.service.js";
import {
  attachSquarePaymentLinkToLocalOrder,
  createPendingLocalOrder,
} from "../services/orders.service.js";

function buildThankYouRedirectUrl({ language, localOrderId, thankYouToken }) {
  const thankYouPath = getThankYouPath(language);
  const params = new URLSearchParams();

  params.set("orderId", String(localOrderId));
  params.set("key", thankYouToken);

  return `${env.siteUrl}${thankYouPath}?${params.toString()}`;
}

export async function createCheckout(req, res) {
  try {
    const { items = [], language = "fr", orderNote = "", shipping } = req.body;
    const normalizedLanguage = normalizeLanguage(language);

    const normalizedItems = items.map((item) =>
      normalizeCartItem(item, normalizedLanguage)
    );

    validateCheckoutItems(normalizedItems);

    // Never trust the shipping price the client submitted -- re-run the
    // same quote from the destination they gave us and use whatever
    // price THAT returns. Throws (409) if the chosen option no longer
    // exists (e.g. rates changed, or the client tampered with the id).
    const validatedShipping = await validateSelectedShippingOption(shipping);
    const shippingCents = validatedShipping?.priceCents || 0;

    const subtotalCents = calculateSubtotalCents(normalizedItems);
    const taxCents = calculateTaxCents(subtotalCents + shippingCents);
    const totalCents = subtotalCents + shippingCents + taxCents;

    const thankYouToken = randomUUID();

    const localOrder = await createPendingLocalOrder({
      thankYouToken,
      normalizedItems,
      subtotalCents,
      taxCents,
      totalCents,
      orderNote,
    });

    const redirectUrl = buildThankYouRedirectUrl({
      language: normalizedLanguage,
      localOrderId: localOrder.id,
      thankYouToken,
    });

    const lineItems = await buildSquareLineItems(normalizedItems);

    // A service charge, not a line item -- keeps shipping out of the
    // "N items" count and displayed in its own row (like taxes), instead
    // of looking like a purchased product. SUBTOTAL_PHASE + taxable:true
    // matches our own tax calc above (GST/QST computed on subtotal +
    // shipping).
    const serviceCharges = validatedShipping
      ? [
          {
            uid: "shipping",
            name:
              normalizedLanguage === "en"
                ? `Shipping — ${validatedShipping.carrierLabel} ${validatedShipping.serviceLabel}`
                : `Livraison — ${validatedShipping.carrierLabel} ${validatedShipping.serviceLabel}`,
            amount_money: {
              amount: validatedShipping.priceCents,
              currency: "CAD",
            },
            calculation_phase: "SUBTOTAL_PHASE",
            taxable: true,
          },
        ]
      : [];

    const { squareBody, paymentLink } = await createSquarePaymentLink({
      normalizedLanguage,
      lineItems,
      serviceCharges,
      redirectUrl,
      buyerLanguageKey: getBuyerLanguageKey(normalizedLanguage),
      orderNote,
    });

    await attachSquarePaymentLinkToLocalOrder({
      localOrderId: localOrder.id,
      paymentLink,
      squareBody,
    });

    res.json({
      checkoutUrl: paymentLink.url,
      localOrderId: localOrder.id,
      thankYouToken,
      squareOrderId: paymentLink.order_id,
      squarePaymentLinkId: paymentLink.id,
    });
  } catch (error) {
    console.error("Checkout failed:", error);

    res.status(error.status || 500).json({
      message: error.message || "Checkout failed",
      errors: error.errors || [],
    });
  }
}