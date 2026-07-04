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
    <footer className="relative z-10 shrink-0 border-t border-[#6f5423]/75 bg-[#070403]/96 px-4 pb-4 pt-4 sm:px-5 sm:pb-5 md:px-8 md:pb-6 md:pt-5">
      <div className="flex items-end justify-between gap-4">
        <p className="font-['IM_Fell_English_SC'] text-[0.62rem] uppercase tracking-[0.2em] text-[#c89b3c] sm:text-[0.68rem] md:text-xs md:tracking-[0.26em]">
          {copy.subtotal}
        </p>

        <p className="font-['EB_Garamond'] text-[2rem] leading-none text-[#e7c97b] sm:text-3xl md:text-4xl">
          {formatPrice(subtotalCents, language)}
        </p>
      </div>

      <p className="mt-2 font-['EB_Garamond'] text-sm leading-5 text-[#d7c8ad]/74 sm:mt-3 md:mt-4 md:text-base md:leading-6">
        {copy.checkoutNote}
      </p>

      <button
        type="button"
        disabled={itemCount === 0}
        className="mt-3 inline-flex w-full items-center justify-center border border-[#c89b3c] bg-[#24170d] px-4 py-3 font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.18em] text-[#e7c97b] transition hover:bg-[#c89b3c] hover:text-[#080504] disabled:cursor-not-allowed disabled:border-[#6f5423]/50 disabled:bg-[#120c07]/70 disabled:text-[#8c7650] sm:mt-4 md:mt-5 md:px-5 md:py-4 md:text-sm md:tracking-[0.22em]"
      >
        {copy.checkout}
      </button>
    </footer>
  );
}

export default CartDrawerFooter;