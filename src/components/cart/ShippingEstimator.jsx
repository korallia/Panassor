import { useEffect } from "react";

import { useShippingQuote } from "../../hooks/useShippingQuote";
import { getCountryOptions } from "../../content/countries";

const CARRIER_NAMES = { postes_canada: "Postes Canada", purolator: "Purolator" };

// Mêmes messages pour chaque transporteur : « chargement… » pendant qu'il
// répond, « temporairement indisponible » s'il ne répond pas.
function carrierLoadingText(carrier, language) {
  const name = CARRIER_NAMES[carrier] || carrier;
  return language === "en" ? `Loading ${name} rates…` : `Chargement des tarifs ${name}…`;
}

function carrierUnavailableText(carrier, language) {
  const name = CARRIER_NAMES[carrier] || carrier;
  return language === "en"
    ? `${name} is temporarily unavailable. Please choose another shipping option or try again later.`
    : `${name} est temporairement indisponible. Veuillez choisir une autre option de livraison ou réessayer plus tard.`;
}

function formatPrice(cents, language) {
  return new Intl.NumberFormat(language === "en" ? "en-CA" : "fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format((cents || 0) / 100);
}

function ShippingEstimator({ copy = {}, language, selectedShipping, onSelect, items = [] }) {
  const {
    postalCode,
    setPostalCode,
    status,
    quote,
    destination,
    error,
    pendingCarriers,
    requestQuote,
    country,
    setCountry,
    askCountry,
  } = useShippingQuote(items);

  function handleCountryChange(event) {
    const nextCountry = event.target.value;
    setCountry(nextCountry);

    if (selectedShipping) {
      onSelect(null);
    }

    if (nextCountry) {
      requestQuote(nextCountry);
    }
  }

  // Transporteurs attendus : les deux, au Canada comme ailleurs.
  const expectedCarriers = ["purolator", "postes_canada"];

  function handleSubmit(event) {
    event.preventDefault();

    if (selectedShipping) {
      onSelect(null);
    }

    requestQuote();
  }

  // When the cart changes after a shipping option was already picked,
  // useShippingQuote silently re-fetches the quote (see its cart-change
  // effect) -- this keeps the picked option's stored price/eta in sync
  // with that refreshed quote instead of showing a stale number all the
  // way to checkout. If the same service isn't offered anymore at the
  // new parcel size (rare), clear the selection so checkout can't go
  // through with an option that no longer exists.
  useEffect(() => {
    if (!selectedShipping || !quote) {
      return;
    }

    const stillOffered = quote.options.find(
      (option) => option.id === selectedShipping.id
    );

    if (!stillOffered) {
      // Son transporteur n'a pas encore repondu (Postes Canada lent) :
      // on attend sa reponse avant de conclure que l'option a disparu.
      if (pendingCarriers.includes(selectedShipping.carrier)) {
        return;
      }
      onSelect(null);
      return;
    }

    if (stillOffered.priceCents !== selectedShipping.priceCents) {
      onSelect({
        ...stillOffered,
        postalCode: destination?.postalCode || "",
        city: destination?.city || "",
        country: destination?.country || "CA",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote, pendingCarriers]);

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

      {/* Adresse canadienne : champ + bouton sur une ligne. Hors Canada
          (version A) : le champ seul, puis « dans quel pays ? » avec la
          liste des pays et le bouton. */}
      <form onSubmit={handleSubmit} className="mt-4 sm:mt-5">
        <div className="flex gap-2">
          <input
            type="text"
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
            placeholder={copy.postalCodePlaceholder}
            className="min-w-0 flex-1 border border-[#6f5423]/55 bg-[#080504]/82 px-4 py-3 font-['EB_Garamond'] text-base text-[#f3e7cf] outline-none transition placeholder:text-[#8f7a58]/70 focus:border-[#c89b3c]/80 sm:py-3.5 sm:text-lg"
          />

          {!askCountry && (
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 border border-[#c89b3c] bg-[#8b5e1a] px-5 py-3 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.14em] text-[#f8edd3] transition hover:bg-[#d4a64a] hover:text-[#120904] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 sm:text-base"
            >
              {status === "loading" ? copy.calculatingLabel : copy.calculateLabel}
            </button>
          )}
        </div>

        {askCountry && (
          <>
            <p className="mt-3 font-['EB_Garamond'] text-base text-[#e7c97b] sm:text-lg">
              {copy.countryQuestion}
            </p>

            <div className="mt-2 flex gap-2">
              <select
                value={country}
                onChange={handleCountryChange}
                aria-label={copy.countryQuestion}
                className="min-w-0 flex-1 border border-[#c89b3c]/80 bg-[#080504]/82 px-4 py-3 font-['EB_Garamond'] text-base text-[#f3e7cf] outline-none transition focus:border-[#c89b3c] sm:py-3.5 sm:text-lg"
              >
                <option value="">{copy.countryPlaceholder}</option>
                {getCountryOptions(language).map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={status === "loading"}
                className="shrink-0 border border-[#c89b3c] bg-[#8b5e1a] px-5 py-3 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.14em] text-[#f8edd3] transition hover:bg-[#d4a64a] hover:text-[#120904] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 sm:text-base"
              >
                {status === "loading" ? copy.calculatingLabel : copy.calculateLabel}
              </button>
            </div>
          </>
        )}
      </form>

      {status === "error" && (
        <p className="mt-2 font-['EB_Garamond'] text-sm text-red-300">
          {error === "EMPTY_POSTAL_CODE"
            ? copy.emptyPostalCodeError
            : error === "INVALID_POSTAL_CODE"
              ? copy.invalidPostalCodeError
              : error === "TOO_MANY_REQUESTS"
                ? copy.tooManyRequestsError
                : copy.genericError}
        </p>
      )}

      {status === "success" && quote && (
        <div className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4">

          {quote.options.map((option) => {
            const isSelected = selectedShipping?.id === option.id;
            const etaLabel =
              language === "en" ? option.etaLabel_en : option.etaLabel_fr;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  onSelect({
                    ...option,
                    // Carried through to checkout so the backend can
                    // re-run the same quote and verify this price before
                    // charging it (see useCheckout.js + checkout.controller.js).
                    postalCode: destination?.postalCode || "",
                    city: destination?.city || "",
                    country: destination?.country || "CA",
                  })
                }
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

          {quote.country !== "CA" && (
            <p className="font-['EB_Garamond'] text-sm italic text-[#d7c8ad]/70">
              {copy.dutiesNote}
            </p>
          )}

          {expectedCarriers.map((carrier) =>
            pendingCarriers.includes(carrier) ? (
              <p
                key={carrier}
                className="animate-pulse font-['EB_Garamond'] text-sm italic text-[#d7c8ad]/70"
              >
                {carrierLoadingText(carrier, language)}
              </p>
            ) : !quote.options.some((option) => option.carrier === carrier) ? (
              <p key={carrier} className="font-['EB_Garamond'] text-sm italic text-[#d7c8ad]/70">
                {carrierUnavailableText(carrier, language)}
              </p>
            ) : null
          )}
        </div>
      )}
    </section>
  );
}

export default ShippingEstimator;
