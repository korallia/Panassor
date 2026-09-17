import { useState } from "react";

import { createCheckout } from "../../backend/panassorApi";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

const LAST_CHECKOUT_STORAGE_KEY = "panassor_last_checkout";

export function useCheckout() {
  const { items, orderNote, selectedShipping } = useCart();
  const { language } = useLanguage();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  async function startCheckout() {
    if (isCheckingOut) return;

    if (!items.length) {
      setCheckoutError(
        language === "en" ? "Your cart is empty." : "Ton panier est vide."
      );
      return;
    }

    if (!selectedShipping) {
      setCheckoutError(
        language === "en"
          ? "Choose a shipping option before checking out."
          : "Choisis une option de livraison avant de passer à la caisse."
      );
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError("");

    try {
      // `shipping` is forwarded with its destination (postalCode/city,
      // attached in ShippingEstimator.jsx) so the backend can re-run the
      // same quote and verify the price before charging it -- see
      // checkout.controller.js's validateSelectedShippingOption call.
      const checkout = await createCheckout({
        language,
        orderNote,
        items,
        shipping: selectedShipping,
      });

      if (!checkout?.checkoutUrl) {
        throw new Error("Missing checkout URL");
      }

      window.sessionStorage.setItem(
        LAST_CHECKOUT_STORAGE_KEY,
        JSON.stringify({
          localOrderId: checkout.localOrderId,
          squareOrderId: checkout.squareOrderId,
          squarePaymentLinkId: checkout.squarePaymentLinkId,
        })
      );

      window.location.href = checkout.checkoutUrl;
    } catch (error) {
      console.error("Checkout failed:", error);

      setCheckoutError(
        language === "en"
          ? "Unable to open checkout. Please try again."
          : "Impossible d’ouvrir le paiement. Réessaie dans un instant."
      );

      setIsCheckingOut(false);
    }
  }

  return {
    startCheckout,
    isCheckingOut,
    checkoutError,
    canCheckout: items.length > 0 && Boolean(selectedShipping) && !isCheckingOut,
  };
}