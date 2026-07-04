function formatPrice(priceCents, language = "fr", currency = "CAD") {
  if (priceCents == null) return "";

  const locale = language === "en" ? "en-CA" : "fr-CA";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

function CartDrawerFooter({ subtotalCents, itemCount, copy, language }) {
  return (
    <footer className="relative z-10 shrink-0 border-t border-[#6f5423]/75 bg-[#070403]/92 px-6 pb-6 pt-5 sm:px-8">
      <div className="flex items-end justify-between gap-4">
        <p className="font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.26em] text-[#c89b3c]">
          {copy.subtotal}
        </p>

        <p className="font-['EB_Garamond'] text-4xl leading-none text-[#e7c97b]">
          {formatPrice(subtotalCents, language)}
        </p>
      </div>

      <p className="mt-4 font-['EB_Garamond'] text-base leading-6 text-[#d7c8ad]/74">
        {copy.checkoutNote}
      </p>

      <button
        type="button"
        disabled={itemCount === 0}
        className="mt-5 inline-flex w-full items-center justify-center border border-[#c89b3c] bg-[#24170d] px-5 py-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#e7c97b] transition hover:bg-[#c89b3c] hover:text-[#080504] disabled:cursor-not-allowed disabled:border-[#6f5423]/50 disabled:bg-[#120c07]/70 disabled:text-[#8c7650]"
      >
        {copy.checkout}
      </button>
    </footer>
  );
}

export default CartDrawerFooter;