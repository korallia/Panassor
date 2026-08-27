import { useShippingQuote } from "../../hooks/useShippingQuote";

function formatPrice(cents, language) {
  return new Intl.NumberFormat(language === "en" ? "en-CA" : "fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format((cents || 0) / 100);
}

function ShippingEstimator({ copy = {}, language, selectedShipping, onSelect }) {
  const { postalCode, setPostalCode, status, quote, error, requestQuote } =
    useShippingQuote();

  function handleSubmit(event) {
    event.preventDefault();

    if (selectedShipping) {
      onSelect(null);
    }

    requestQuote();
  }

  return (
    <section className="border-t border-[#6f5423]/35 pt-3 sm:pt-4">
      <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c] sm:text-base">
        {copy.label}
      </p>

      <div className="mt-2 flex items-center gap-3">
        <span className="h-px w-14 bg-[#c89b3c]/55" />
        <span className="font-['IM_Fell_English_SC'] text-sm leading-none text-[#c89b3c]/80">
          ✦
        </span>
        <span className="h-px w-14 bg-[#c89b3c]/55" />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2 sm:mt-5">
        <input
          type="text"
          value={postalCode}
          onChange={(event) => setPostalCode(event.target.value)}
          placeholder={copy.postalCodePlaceholder}
          className="min-w-0 flex-1 border border-[#6f5423]/55 bg-[#080504]/82 px-4 py-3 font-['EB_Garamond'] text-base text-[#f3e7cf] outline-none transition placeholder:text-[#8f7a58]/70 focus:border-[#c89b3c]/80 sm:py-3.5 sm:text-lg"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 border border-[#c89b3c] bg-[#8b5e1a] px-5 py-3 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.14em] text-[#f8edd3] transition hover:bg-[#d4a64a] hover:text-[#120904] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 sm:text-base"
        >
          {status === "loading" ? copy.calculatingLabel : copy.calculateLabel}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-2 font-['EB_Garamond'] text-sm text-red-300">
          {error === "EMPTY_POSTAL_CODE"
            ? copy.emptyPostalCodeError
            : copy.genericError}
        </p>
      )}

      {status === "success" && quote && (
        <div className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4">
          {quote.country === "INTL" && (
            <p className="font-['EB_Garamond'] text-sm italic text-[#d7c8ad]/70">
              {copy.internationalNote}
            </p>
          )}

          {quote.options.map((option) => {
            const isSelected = selectedShipping?.id === option.id;
            const etaLabel =
              language === "en" ? option.etaLabel_en : option.etaLabel_fr;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option)}
                className={`flex w-full items-center justify-between gap-4 border px-4 py-3.5 text-left transition sm:py-4 ${
                  isSelected
                    ? "border-[#c89b3c] bg-[#c89b3c]/12"
                    : "border-[#6f5423]/45 bg-[#080504]/60 hover:border-[#c89b3c]/60"
                }`}
              >
                <span>
                  <span className="block font-['EB_Garamond'] text-base text-[#f3e7cf] sm:text-lg">
                    {option.carrierLabel} — {option.serviceLabel}
                  </span>
                  <span className="mt-0.5 block font-['EB_Garamond'] text-sm text-[#d7c8ad]/70">
                    {etaLabel}
                  </span>
                </span>

                <span className="flex shrink-0 items-center gap-3">
                  <span className="font-['IM_Fell_English_SC'] text-lg text-[#fff1d2] sm:text-xl">
                    {formatPrice(option.priceCents, language)}
                  </span>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center border text-xs leading-none ${
                      isSelected
                        ? "border-[#c89b3c] bg-[#c89b3c] text-[#080504]"
                        : "border-[#6f5423]/60 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ShippingEstimator;
