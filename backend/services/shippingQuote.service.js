import { env } from "../config/env.js";
import { getCanadaPostDomesticRates, getCanadaPostRates } from "./canadaPost.service.js";
import {
  getPurolatorEstimate,
  PUROLATOR_DOMESTIC_SERVICE_ID,
} from "./purolator.service.js";
import { computeParcelForCartItems } from "./packing.service.js";
import {
  CANADA_POST_US_SERVICE_CODES,
  CANADA_POST_WORLD_SERVICE_CODES,
  CANADA_POST_MAX_OPTIONS,
  canadaPostDestination,
  US_SERVICE_ID,
  WORLD_SERVICE_ID,
  isValidCountryCode,
  isValidUsZip,
  usStateFromZip,
} from "./internationalShipping.js";

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

// Même principe pour Purolator : même destination + même colis dans les
// 15 dernières minutes = même prix, on ne rappelle pas Purolator. Rend
// aussi le « Calculer » instantané quand le client revient au panier, et
// la revalidation au paiement réutilise le même prix que celui affiché.
const PUROLATOR_CACHE_FRESH_MS = 15 * 60 * 1000;
const PUROLATOR_CACHE_MAX_ENTRIES = 500;
const purolatorRateCache = new Map();

async function getPurolatorEstimateCached(params) {
  const d = params.dimensionsCm || {};
  const key = [
    String(params.destinationPostalCode || "").replace(/[\s-]+/g, "").toUpperCase(),
    String(params.destinationCity || "").trim().toLowerCase(),
    params.destinationCountry || "CA",
    params.serviceId || "",
    params.weightKg,
    d.length,
    d.width,
    d.height,
  ].join("|");

  const cached = purolatorRateCache.get(key);
  if (cached && Date.now() - cached.storedAt < PUROLATOR_CACHE_FRESH_MS) {
    return cached.rates;
  }

  const rates = await getPurolatorEstimate(params);
  if (rates.length > 0) {
    if (purolatorRateCache.size >= PUROLATOR_CACHE_MAX_ENTRIES) {
      purolatorRateCache.delete(purolatorRateCache.keys().next().value);
    }
    purolatorRateCache.set(key, { rates, storedAt: Date.now() });
  }
  return rates;
}

// Garde-fous sur ce que le navigateur envoie : un panier réel n'a jamais
// des centaines de lignes ni une ville de 500 caractères.
const MAX_CART_LINES = 30;
const MAX_QUANTITY_PER_LINE = 20;
const MAX_CITY_LENGTH = 80;

function assertReasonableQuoteInput({ city, items }) {
  if (!Array.isArray(items) || items.length > MAX_CART_LINES) {
    throw invalidRequestError("INVALID_CART");
  }

  for (const item of items) {
    const quantity = Number(item?.quantity ?? 1);
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_LINE) {
      throw invalidRequestError("INVALID_CART");
    }
  }

  if (String(city || "").length > MAX_CITY_LENGTH) {
    throw invalidRequestError("INVALID_CITY");
  }
}

function invalidRequestError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

const ALL_CARRIERS = ["postes_canada", "purolator"];

// `carriers` (optionnel) : limite le devis a certains transporteurs. Le
// panier fait 2 requetes en parallele (une par transporteur) pour afficher
// Purolator tout de suite sans attendre Postes Canada, qui peut prendre
// 10-30 s quand leur API Rating est lente. Sans `carriers` = les deux,
// comme avant.
function normalizeCarriers(carriers) {
  if (!Array.isArray(carriers) || carriers.length === 0) return ALL_CARRIERS;
  const wanted = carriers.filter((carrier) => ALL_CARRIERS.includes(carrier));
  return wanted.length ? wanted : ALL_CARRIERS;
}

export async function getShippingQuote({ postalCode, city, country, items = [], carriers }) {
  const wantedCarriers = normalizeCarriers(carriers);
  const trimmedPostalCode = String(postalCode || "").trim();
  const trimmedCity = String(city || "").trim();

  if (!trimmedPostalCode) {
    throw invalidRequestError("EMPTY_POSTAL_CODE");
  }

  // Assez large pour tous les formats du monde (le plus long fait 10 caractères).
  if (trimmedPostalCode.length > 16) {
    throw invalidRequestError("INVALID_POSTAL_CODE");
  }

  assertReasonableQuoteInput({ city: trimmedCity, items });

  if (!isDomesticPostalCode(trimmedPostalCode)) {
    return getInternationalQuote({
      postalCode: trimmedPostalCode,
      city: trimmedCity,
      country: String(country || "").trim().toUpperCase(),
      items,
      wantedCarriers,
    });
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

  const skipped = (carrier) =>
    Promise.reject(Object.assign(new Error("SKIPPED"), { skipped: true, carrier }));

  const [canadaPostResult, purolatorResult] = await Promise.allSettled([
    !wantedCarriers.includes("postes_canada") ? skipped("postes_canada") : getCanadaPostRatesCached({
      originPostalCode: env.shippingOrigin.postalCode,
      destinationPostalCode: trimmedPostalCode,
      ...parcel,
    }).finally(() => {
      console.log(`[shipping-quote] Canada Post took ${Date.now() - canadaPostStartedAt}ms`);
    }),
    !wantedCarriers.includes("purolator") ? skipped("purolator") : getPurolatorEstimateCached({
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
  } else if (!canadaPostResult.reason?.skipped) {
    console.error("Canada Post rate lookup failed:", canadaPostResult.reason);
  }

  if (purolatorResult.status === "fulfilled") {
    options.push(...purolatorResult.value.map(toFrontendOption));
  } else if (!purolatorResult.reason?.skipped) {
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
// Hors Canada : Purolator seulement (voir internationalShipping.js). Le pays
// vient du panier, qui le demande quand le code postal n'est pas canadien.
async function getInternationalQuote({ postalCode, city, country, items, wantedCarriers }) {
  if (!country) {
    throw invalidRequestError("COUNTRY_REQUIRED");
  }

  if (!isValidCountryCode(country)) {
    throw invalidRequestError("INVALID_COUNTRY");
  }

  if (country === "US" && !isValidUsZip(postalCode)) {
    throw invalidRequestError("INVALID_POSTAL_CODE");
  }

  const parcel = (await computeParcelForCartItems(items)) || PLACEHOLDER_PARCEL;
  const timed = (label, promise) => {
    const startedAt = Date.now();
    return promise.finally(() =>
      console.log(`[shipping-quote] ${label} ${country} took ${Date.now() - startedAt}ms`)
    );
  };
  const skipped = () => Promise.reject(Object.assign(new Error("SKIPPED"), { skipped: true }));

  const [purolatorResult, canadaPostResult] = await Promise.allSettled([
    !wantedCarriers.includes("purolator")
      ? skipped()
      : timed("Purolator", getPurolatorEstimateCached({
          destinationPostalCode: postalCode,
          destinationCity: city,
          destinationProvince: country === "US" ? usStateFromZip(postalCode) : "",
          destinationCountry: country,
          serviceId: country === "US" ? US_SERVICE_ID : WORLD_SERVICE_ID,
          showAlternativeServicesIndicator: false,
          ...parcel,
        })),
    !wantedCarriers.includes("postes_canada")
      ? skipped()
      : timed("Canada Post", getCanadaPostInternationalRatesCached({ country, postalCode, parcel })),
  ]);

  const options = [];

  for (const [label, result] of [["Purolator", purolatorResult], ["Canada Post", canadaPostResult]]) {
    if (result.status === "fulfilled") {
      options.push(...result.value.map(toFrontendOption));
    } else if (!result.reason?.skipped) {
      console.error(
        `[shipping-quote] ${label} international (${country}) failed:`,
        result.reason?.message,
        result.reason?.body ? JSON.stringify(result.reason.body).slice(0, 400) : ""
      );
    }
  }

  if (options.length === 0) {
    const quoteError = new Error("QUOTE_FAILED");
    quoteError.status = 502;
    throw quoteError;
  }

  return { country, options };
}

// Tarifs Postes Canada hors Canada, gardés 30 min comme au Canada. Ne
// garde que les services demandés : la sandbox de Postes Canada renvoie
// une réponse d'exemple (un service canadien), qu'on ne doit jamais
// montrer comme un vrai prix international.
const canadaPostIntlCache = new Map();

async function getCanadaPostInternationalRatesCached({ country, postalCode, parcel }) {
  const serviceCodes = country === "US" ? CANADA_POST_US_SERVICE_CODES : CANADA_POST_WORLD_SERVICE_CODES;
  const d = parcel.dimensionsCm || {};
  const key = [country, country === "US" ? String(postalCode).slice(0, 5) : "", parcel.weightKg, d.length, d.width, d.height].join("|");

  const cached = canadaPostIntlCache.get(key);
  if (cached && Date.now() - cached.storedAt < CP_CACHE_FRESH_MS) {
    return cached.rates;
  }

  // Une seule demande SANS liste de services : Postes Canada renvoie ce
  // qu'il offre vraiment pour ce colis. Avec une liste, un seul service
  // inapproprié fait échouer toute la demande (erreur 9111).
  const offered = await getCanadaPostRates({
    originPostalCode: env.shippingOrigin.postalCode,
    destination: canadaPostDestination(country, postalCode),
    ...parcel,
  });

  const rates = serviceCodes
    .map((code) => offered.find((rate) => rate.serviceCode === code))
    .filter(Boolean)
    .slice(0, CANADA_POST_MAX_OPTIONS);

  if (rates.length === 0 && offered.length > 0) {
    console.warn(
      `[shipping-quote] Canada Post (${country}) offre seulement : ${offered.map((r) => r.serviceCode).join(", ")}`
    );
  }

  if (rates.length === 0) {
    console.warn(
      `[shipping-quote] Canada Post international (${country}) : aucun des services demandés (${serviceCodes.join(", ")}) dans la réponse -- réponse d'exemple de la sandbox, ou services non offerts pour ce colis.`
    );
  }

  if (rates.length > 0) {
    if (canadaPostIntlCache.size >= CP_CACHE_MAX_ENTRIES) {
      canadaPostIntlCache.delete(canadaPostIntlCache.keys().next().value);
    }
    canadaPostIntlCache.set(key, { rates, storedAt: Date.now() });
  }

  return rates;
}

export async function validateSelectedShippingOption(shipping, items = []) {
  if (!shipping || !shipping.id) {
    return null;
  }

  // Ne re-verifie que le transporteur de l'option choisie : un client qui
  // a pris Purolator ne doit pas attendre (ni echouer) a cause de Postes
  // Canada au moment de payer.
  const selectedCarrier = String(shipping.id).startsWith("cp-")
    ? "postes_canada"
    : "purolator";

  const freshQuote = await getShippingQuote({
    postalCode: shipping.postalCode,
    city: shipping.city,
    country: shipping.country,
    items,
    carriers: [selectedCarrier],
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
