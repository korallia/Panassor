import { useCheckout } from "../../hooks/useCheckout";

function formatPrice(cents, language) {
  return new Intl.NumberFormat(language === "en" ? "en-CA" : "fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format((cents || 0) / 100);
}

function CartDrawerFooter({
  subtotalCents = 0,
  shippingCents = 0,
  estimatedTotalCents = 0,
  hasSelectedShipping = false,
  itemCount = 0,
  copy = {},
  language,
}) {
  const { startCheckout, isCheckingOut, checkoutError, canCheckout } =
    useCheckout();

  const subtotalLabel =
    copy.subtotalLabel || (language === "en" ? "Subtotal" : "Sous-total");

  const shippingLabel =
    copy.shippingLabel || (language === "en" ? "Shipping" : "Livraison");

  const shippingPendingLabel =
    copy.shippingPending ||
    (language === "en" ? "To be determined" : "À déterminer");

  const estimatedTotalLabel =
    copy.estimatedTotal ||
    (language === "en" ? "Estimated total" : "Total estimé");

  const checkoutLabel =
    copy.checkoutLabel || (language === "en" ? "Checkout" : "Passer à la caisse");

  const checkoutLoadingLabel =
    copy.checkoutLoadingLabel ||
    (language === "en" ? "Opening checkout..." : "Ouverture du paiement...");

  const itemLabel =
    itemCount > 1
      ? language === "en"
        ? "items"
        : "articles"
      : language === "en"
        ? "item"
        : "article";

  return (
    <div className="relative z-10 border-t border-[#c89b3c]/25 bg-[#080504] p-5">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.2em] text-[#c89b3c]/80">
            {subtotalLabel}
          </p>

          <p className="mt-1 font-['EB_Garamond'] text-sm text-[#d7c8ad]/70">
            {itemCount} {itemLabel}
          </p>
        </div>

        <p className="font-['IM_Fell_English_SC'] text-xl text-[#fff1d2]">
          {formatPrice(subtotalCents, language)}
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4 border-t border-[#c89b3c]/15 pt-3">
        <p className="font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.2em] text-[#c89b3c]/80">
          {shippingLabel}
        </p>

        <p className="font-['EB_Garamond'] text-sm text-[#d7c8ad]">
          {hasSelectedShipping
            ? formatPrice(shippingCents, language)
            : shippingPendingLabel}
        </p>
      </div>

      {hasSelectedShipping && (
        <div className="mb-4 flex items-end justify-between gap-4 border-t border-[#c89b3c]/25 pt-3">
          <p className="font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.2em] text-[#c89b3c]/80">
            {estimatedTotalLabel}
          </p>

          <p className="font-['IM_Fell_English_SC'] text-2xl text-[#fff1d2]">
            {formatPrice(estimatedTotalCents, language)}
          </p>
        </div>
      )}

      {checkoutError && (
        <p className="mb-3 font-['EB_Garamond'] text-sm text-red-300">
          {checkoutError}
        </p>
      )}

      <button
        type="button"
        onClick={startCheckout}
        disabled={!canCheckout}
        className="w-full border border-[#c89b3c] bg-[#c89b3c] px-5 py-3 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.18em] text-[#080504] transition hover:bg-[#f3d37a] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCheckingOut ? checkoutLoadingLabel : checkoutLabel}
      </button>
    </div>
  );
}

export default CartDrawerFooter;