import { normalizeLanguage, getBuyerLanguageKey, getRedirectUrl } from "../utils/language.js";
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
import { createLocalOrder } from "../services/orders.service.js";

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

    const lineItems = buildSquareLineItems(normalizedItems);

    const { squareBody, paymentLink } = await createSquarePaymentLink({
      normalizedLanguage,
      lineItems,
      redirectUrl: getRedirectUrl(normalizedLanguage),
      buyerLanguageKey: getBuyerLanguageKey(normalizedLanguage),
      orderNote,
    });

    const localOrder = await createLocalOrder({
      paymentLink,
      normalizedLanguage,
      normalizedItems,
      subtotalCents,
      taxCents,
      totalCents,
      orderNote,
      squareBody,
    });

    res.json({
      checkoutUrl: paymentLink.url,
      localOrderId: localOrder.id,
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