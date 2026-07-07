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
  calculateTotalCents,
} from "../utils/money.js";
import {
  normalizeCartItem,
  validateCheckoutItems,
  buildSquareLineItems,
} from "../services/cart.service.js";
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
    const { items = [], language = "fr", orderNote = "" } = req.body;
    const normalizedLanguage = normalizeLanguage(language);

    const normalizedItems = items.map((item) =>
      normalizeCartItem(item, normalizedLanguage)
    );

    validateCheckoutItems(normalizedItems);

    const subtotalCents = calculateSubtotalCents(normalizedItems);
    const taxCents = calculateTaxCents(subtotalCents);
    const totalCents = calculateTotalCents(subtotalCents, taxCents);

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

    const lineItems = buildSquareLineItems(normalizedItems);

    const { squareBody, paymentLink } = await createSquarePaymentLink({
      normalizedLanguage,
      lineItems,
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