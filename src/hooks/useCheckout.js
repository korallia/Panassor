import { useState } from "react";

import { createCheckout } from "../api/panassorApi";
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

      // 409 = le serveur a refuse le panier : soit la livraison choisie
      // n'existe plus, soit un produit n'a plus d'equivalent dans Square
      // (voir buildSquareLineItems dans cart.service.js).
      const isShippingGone = error?.message === "SHIPPING_OPTION_UNAVAILABLE";
      const isProductGone = error?.status === 409 && !isShippingGone;

      setCheckoutError(
        isProductGone
          ? language === "en"
            ? "An item in your cart is no longer available. Please remove it and try again."
            : "Un produit de ton panier n’est plus disponible. Retire-le et réessaie."
          : isShippingGone
            ? language === "en"
              ? "Your shipping option is no longer available. Please recalculate shipping."
              : "L’option de livraison n’est plus disponible. Recalcule la livraison."
            : language === "en"
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