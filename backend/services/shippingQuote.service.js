import { env } from "../config/env.js";
import { getCanadaPostDomesticRates } from "./canadaPost.service.js";
import {
  getPurolatorEstimate,
  PUROLATOR_DOMESTIC_SERVICE_ID,
} from "./purolator.service.js";
import { computeParcelForCartItems } from "./packing.service.js";

// Unified shipping-quote service: chooses between Postes Canada
// (domestic standard tiers) and Purolator (domestic Express + all
// international) based on destination, matching the shipping plan
// (section 02/03). Both carriers are queried in parallel for a domestic
// quote so the cart can show the 2-option picker Korallia asked for.

// Matches the 6 significant characters only -- formatting (spaces,
// hyphens, case) is normalized away first below, so "j0l 1m0",
// "J0L1M0", "j0l-1m0" and "J0L  1M0" (double space) are all accepted the
// same way. This is about tolerating how a real Canadian postal code can
// be typed, NOT about correcting actual character typos (e.g. a letter
// "O" for the digit "0") -- guessing those would risk misreading a
// genuine international code as a domestic one.
const CA_POSTAL_CODE_REGEX =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d$/i;

export function isDomesticPostalCode(postalCode) {
  const normalized = String(postalCode || "")
    .replace(/[\s-]+/g, "")
    .toUpperCase();
  return CA_POSTAL_CODE_REGEX.test(normalized);
}

// Purolator's Estimate API requires the receiver's city (confirmed via a
// live 400: "Sortant: Receveur la ville est un champ obligatoire") but
// the cart only collects a bare postal code -- no city/province field.
// Standard Canada Post FSA-to-province mapping (first letter) is always
// accurate; the "city" is only a representative placeholder (the
// province's largest city) since we don't have the shopper's real one.
// This is fine for an ESTIMATE (postal code drives the actual rating
// zone) but would need a real address before ever printing a label.
const PROVINCE_BY_POSTAL_CODE_LETTER = {
  A: { province: "NL", city: "St. John's" },
  B: { province: "NS", city: "Halifax" },
  C: { province: "PE", city: "Charlottetown" },
  E: { province: "NB", city: "Moncton" },
  G: { province: "QC", city: "Quebec" },
  H: { province: "QC", city: "Montreal" },
  J: { province: "QC", city: "Montreal" },
  K: { province: "ON", city: "Ottawa" },
  L: { province: "ON", city: "Toronto" },
  M: { province: "ON", city: "Toronto" },
  N: { province: "ON", city: "London" },
  P: { province: "ON", city: "Sudbury" },
  R: { province: "MB", city: "Winnipeg" },
  S: { province: "SK", city: "Saskatoon" },
  T: { province: "AB", city: "Calgary" },
  V: { province: "BC", city: "Vancouver" },
  X: { province: "NT", city: "Yellowknife" },
  Y: { province: "YT", city: "Whitehorse" },
};

function guessCityAndProvinceFromPostalCode(postalCode) {
  const firstLetter = String(postalCode || "").trim().charAt(0).toUpperCase();

  return (
    PROVINCE_BY_POSTAL_CODE_LETTER[firstLetter] || {
      province: "ON",
      city: "Toronto",
    }
  );
}

// TODO(shipping-weight): placeholder parcel weight/dimensions until real
// per-product weighing is done (see the shipping plan + the "Fiche
// complete d'inventaire" to-do). Uses the "grande boite" dimensions
// (12 x 10 x 4.5 in) and the surgeon-kit weight, since kits are the
// heaviest/most common shipped item.
const PLACEHOLDER_PARCEL = {
  weightKg: 1.11,
  dimensionsCm: { length: 30.48, width: 25.4, height: 11.43 },
};

function buildTransitEtaLabels(transitDays) {
  const days = Number(transitDays);

  if (!Number.isFinite(days) || days <= 0) {
    return { etaLabel_fr: "", etaLabel_en: "" };
  }

  return {
    etaLabel_fr: `${days} jour${days > 1 ? "s" : ""} ouvrable${days > 1 ? "s" : ""}`,
    etaLabel_en: `${days} business day${days > 1 ? "s" : ""}`,
  };
}

// Normalizes either carrier service's already-normalized rate object
// (see canadaPost.service.js / purolator.service.js) into the
// {id, carrier, carrierLabel, serviceLabel, priceCents, etaLabel_fr,
// etaLabel_en} shape ShippingEstimator.jsx expects.
function toFrontendOption(rate) {
  return {
    id: rate.id,
    carrier: rate.carrier,
    carrierLabel: rate.carrierLabel,
    serviceLabel: rate.serviceLabel,
    priceCents: rate.priceCents,
    ...buildTransitEtaLabels(rate.expectedTransitDays),
  };
}

// Cache en memoire des tarifs Postes Canada (le serveur EC2/pm2 est un
// process persistant, donc le cache survit entre les requetes).
//  - Frais (< 30 min) : on ne rappelle pas Postes Canada. C'est surtout ce
//    qui protege le paiement : validateSelectedShippingOption() refait un
//    devis au clic sur "Payer", et avant ca un timeout/401 a ce moment-la
//    faisait echouer la commande.
//  - Perime (< 24 h) : seulement si l'appel en direct echoue, pour que le
//    client voie quand meme les options Postes Canada au dernier prix connu.
const CP_CACHE_FRESH_MS = 30 * 60 * 1000;
const CP_CACHE_STALE_MS = 24 * 60 * 60 * 1000;
const CP_CACHE_MAX_ENTRIES = 500;
const canadaPostRateCache = new Map(); // key -> { rates, storedAt }

function canadaPostCacheKey({ destinationPostalCode, weightKg, dimensionsCm }) {
  const postal = String(destinationPostalCode || "").replace(/[\s-]+/g, "").toUpperCase();
  const d = dimensionsCm || {};
  return [postal, weightKg, d.length, d.width, d.height].join("|");
}

async function getCanadaPostRatesCached(params) {
  const key = canadaPostCacheKey(params);
  const cached = canadaPostRateCache.get(key);
  const age = cached ? Date.now() - cached.storedAt : Infinity;

  if (cached && age < CP_CACHE_FRESH_MS) {
    return cached.rates;
  }

  try {
    const rates = await getCanadaPostDomesticRates(params);
    if (rates.length > 0) {
      if (canadaPostRateCache.size >= CP_CACHE_MAX_ENTRIES) {
        canadaPostRateCache.delete(canadaPostRateCache.keys().next().value);
      }
      canadaPostRateCache.set(key, { rates, storedAt: Date.now() });
    }
    return rates;
  } catch (error) {
    if (cached && age < CP_CACHE_STALE_MS) {
      console.warn(
        `[shipping-quote] Canada Post live call failed (${error.message}) -- using cached rates from ${Math.round(age / 60000)} min ago`
      );
      return cached.rates;
    }
    throw error;
  }
}

function invalidRequestError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

export async function getShippingQuote({ postalCode, city, items = [] }) {
  const trimmedPostalCode = String(postalCode || "").trim();
  const trimmedCity = String(city || "").trim();

  if (!trimmedPostalCode) {
    throw invalidRequestError("EMPTY_POSTAL_CODE");
  }

  if (!isDomesticPostalCode(trimmedPostalCode)) {
    // TODO(shipping-intl): the cart only collects a bare postal code, with
    // no destination-country field, so we can't build a real Purolator
    // international estimate yet (the Estimate API needs the receiver's
    // country/city/province, not just a postal code). Keeping the same
    // flat placeholder price the mock used until that's designed -- see
    // the "customs/duties payer for Purolator international" open
    // question in the shipping plan.
    return {
      country: "INTL",
      options: [
        {
          id: "purolator-international",
          carrier: "purolator",
          carrierLabel: "Purolator",
          serviceLabel: "International",
          priceCents: 4500,
          etaLabel_fr: "7 à 10 jours ouvrables",
          etaLabel_en: "7 to 10 business days",
        },
      ],
    };
  }

  // Real per-product weight/dimensions once they're measured (see
  // packing.service.js); falls back to the flat placeholder while any
  // cart item is missing real data, or when this isn't called with cart
  // items at all (e.g. an older caller).
  const computedParcel = await computeParcelForCartItems(items);
  const parcel = computedParcel || PLACEHOLDER_PARCEL;

  if (computedParcel) {
    console.log(
      `[shipping-quote] using real packed parcel: ${computedParcel.weightKg}kg, box "${computedParcel.boxSlug}"`
    );
  }

  // Timed separately (rather than guessing) so we can actually see, per
  // carrier, where time goes in the deployed logs -- Korallia noticed
  // Canada Post feeling slower than Purolator in QA, and since the cart
  // waits on Promise.allSettled (i.e. the SLOWER of the two), Canada
  // Post being slow drags the whole "Calculer" click even though the
  // calls run in parallel.
  const canadaPostStartedAt = Date.now();
  const purolatorStartedAt = Date.now();

  const [canadaPostResult, purolatorResult] = await Promise.allSettled([
    getCanadaPostRatesCached({
      originPostalCode: env.shippingOrigin.postalCode,
      destinationPostalCode: trimmedPostalCode,
      ...parcel,
    }).finally(() => {
      console.log(`[shipping-quote] Canada Post took ${Date.now() - canadaPostStartedAt}ms`);
    }),
    getPurolatorEstimate({
      destinationPostalCode: trimmedPostalCode,
      // Real city from the shopper when they gave us one (the input asks
      // for "Ville, Code postal" now); falls back to a guessed
      // representative city only if it's missing, so this never 400s on
      // Purolator's required receiver-city field.
      destinationCity:
        trimmedCity || guessCityAndProvinceFromPostalCode(trimmedPostalCode).city,
      destinationProvince: guessCityAndProvinceFromPostalCode(trimmedPostalCode).province,
      destinationCountry: "CA",
      serviceId: PUROLATOR_DOMESTIC_SERVICE_ID,
      showAlternativeServicesIndicator: false,
      ...parcel,
    }).finally(() => {
      console.log(`[shipping-quote] Purolator took ${Date.now() - purolatorStartedAt}ms`);
    }),
  ]);

  const options = [];

  if (canadaPostResult.status === "fulfilled") {
    options.push(...canadaPostResult.value.map(toFrontendOption));
  } else {
    console.error("Canada Post rate lookup failed:", canadaPostResult.reason);
  }

  if (purolatorResult.status === "fulfilled") {
    options.push(...purolatorResult.value.map(toFrontendOption));
  } else {
    console.error(
      "Purolator rate lookup failed:",
      purolatorResult.reason?.message,
      "BODY:",
      JSON.stringify(purolatorResult.reason?.body, null, 2)
    );
  }

  // If BOTH carriers failed, surface a real error instead of a silently
  // empty option list -- the frontend already has an error state for this.
  if (options.length === 0) {
    const error = new Error("QUOTE_FAILED");
    error.status = 502;
    throw error;
  }

  return { country: "CA", options };
}

// Re-validates a shopper-selected shipping option server-side before it's
// trusted for checkout. Never bill the client-submitted priceCents
// directly -- re-run the same quote from the destination they gave us,
// confirm the chosen option still exists in it, and return THAT freshly
// computed option (its price is what gets charged).
export async function validateSelectedShippingOption(shipping, items = []) {
  if (!shipping || !shipping.id) {
    return null;
  }

  const freshQuote = await getShippingQuote({
    postalCode: shipping.postalCode,
    city: shipping.city,
    items,
  });

  const matchedOption = freshQuote.options.find(
    (option) => option.id === shipping.id
  );

  if (!matchedOption) {
    const error = new Error("SHIPPING_OPTION_UNAVAILABLE");
    error.status = 409;
    throw error;
  }

  return matchedOption;
}
