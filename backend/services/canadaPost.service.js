import { env } from "../config/env.js";
import { fetchWithRetry } from "../utils/fetchWithRetry.js";

// Canada Post's new (2026) Developer Portal API: REST/JSON only, OAuth2
// client_credentials. Docs: developer-developpeur.canadapost-postescanada.ca
// -> APIs -> Rating 4.0.0 -> API references -> Get Rates.

const API_BASE_URL =
  "https://api.canadapost-postescanada.ca/prod/devportal-portaildesdeveloppeurs";

const TOKEN_URL = `${API_BASE_URL}/cpc-api-native-oauth-provider/oauth2/token`;
const RATES_URL = `${API_BASE_URL}/rating/v1/prices`;

// Un seul service Postes Canada exposé aux clients : Colis standard.
// Purolator Express couvre l'option "rapide" separement -- Korallia a
// choisi de ne pas montrer Colis accelere / Xpresspost pour garder le
// cart simple (2026-09-10).
//
// Code a confirmer au premier vrai appel en prod (pas trouve dans une
// spec OpenAPI ici) -- suit la meme convention que DOM.EP/DOM.XP deja
// confirmes ("DOM." + 2 lettres), donc "DOM.RP" (Regular Parcel) est le
// candidat le plus probable pour Colis standard.
export const CANADA_POST_DOMESTIC_SERVICE_CODES = ["DOM.RP"];

let cachedToken = null; // { accessToken, expiresAt: epochMs }

function assertCanadaPostConfig() {
  if (!env.canadaPost.apiKey || !env.canadaPost.apiSecret) {
    throw new Error(
      "CANADA_POST_API_KEY / CANADA_POST_API_SECRET is missing"
    );
  }
}

function normalizePostalCode(postalCode) {
  return String(postalCode || "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

// Canada Post's schema validation requires dimensions in a strict
// "999.9" format (max 1 decimal digit) — e.g. 30.48 is rejected, 30.5
// is accepted. Round instead of truncating so we stay accurate to
// within 5mm, which is well inside any real packing tolerance.
function roundToOneDecimal(value) {
  return Math.round(Number(value) * 10) / 10;
}

async function fetchAccessToken() {
  assertCanadaPostConfig();

  const response = await fetchWithRetry(TOKEN_URL, {
    method: "POST",
    headers: {
      "X-IBM-Client-Id": env.canadaPost.apiKey,
      "X-IBM-Client-Secret": env.canadaPost.apiSecret,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "merchant",
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.error_description || data?.error || `Canada Post auth failed: ${response.status}`
    );
    error.status = response.status;
    error.body = data;
    throw error;
  }

  return data;
}

// Caches the bearer token in memory for the life of the process, minus a
// 60s safety margin before its real expiry.
async function getAccessToken() {
  const now = Date.now();

  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.accessToken;
  }

  const tokenResponse = await fetchAccessToken();
  const expiresInMs = Number(tokenResponse.expires_in || 0) * 1000;

  cachedToken = {
    accessToken: tokenResponse.access_token,
    expiresAt: now + Math.max(expiresInMs - 60_000, 0),
  };

  return cachedToken.accessToken;
}

/**
 * Get live Canada Post rates for a domestic (Canada -> Canada) shipment.
 *
 * @param {Object} params
 * @param {string} params.originPostalCode - e.g. "J0L1M0"
 * @param {string} params.destinationPostalCode - e.g. "K1K1K1"
 * @param {number} params.weightKg - parcel weight in kilograms
 * @param {{length:number,width:number,height:number}} [params.dimensionsCm] - cm
 * @param {string[]} [params.serviceCodes] - defaults to the 2 domestic codes above
 */
export async function getCanadaPostDomesticRates({
  originPostalCode,
  destinationPostalCode,
  weightKg,
  dimensionsCm,
  serviceCodes = CANADA_POST_DOMESTIC_SERVICE_CODES,
}) {
  assertCanadaPostConfig();

  const accessToken = await getAccessToken();

  const body = {
    quoteType: "commercial",
    parcelCharacteristics: {
      weight: weightKg,
      ...(dimensionsCm
        ? {
            dimensions: {
              length: roundToOneDecimal(dimensionsCm.length),
              width: roundToOneDecimal(dimensionsCm.width),
              height: roundToOneDecimal(dimensionsCm.height),
            },
          }
        : {}),
    },
    services: serviceCodes,
    originPostalCode: normalizePostalCode(originPostalCode),
    destination: {
      domestic: {
        postalCode: normalizePostalCode(destinationPostalCode),
      },
    },
  };

  // customerNumber (Solutions for Small Business / commercial) gets
  // discounted rates instead of consumer "counter" rates. contractId is
  // only added on top of that for a negotiated commercial contract.
  if (env.canadaPost.customerNumber) {
    body.customerNumber = env.canadaPost.customerNumber;
  }

  if (env.canadaPost.contractNumber) {
    body.contractId = env.canadaPost.contractNumber;
  }

  const response = await fetchWithRetry(RATES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Language": "fr-CA",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.messages?.[0]?.description ||
        data?.message ||
        `Canada Post rating failed: ${response.status}`
    );
    error.status = response.status;
    error.body = data;
    throw error;
  }

  // Normalize into the shape the frontend's shipping-quote contract
  // expects (see src/utils/shippingPlaceholder.js) — cents, not dollars.
  //
  // NOTE: Postes Canada n'est pas cohérent sur la casse de ces deux champs
  // -- confirmé le 2026-09-10 via un vrai appel de PRODUCTION que ces
  // champs arrivent en camelCase ("serviceName", "priceDetails"), alors
  // qu'un appel de debug antérieur (probablement contre Test/sandbox)
  // avait montré du kebab-case ("service-name", "price-details"). On
  // accepte les deux pour ne pas se refaire prendre si l'un des deux
  // environnements change de comportement encore une fois.
  return (Array.isArray(data) ? data : [])
    .map((service) => {
      const priceDetails = service.priceDetails || service["price-details"];

      return {
        id: `cp-${service.serviceCode}`.toLowerCase(),
        carrier: "postes_canada",
        carrierLabel: "Postes Canada",
        serviceCode: service.serviceCode,
        serviceLabel: service.serviceName || service["service-name"],
        priceCents: Math.round(Number(priceDetails?.due || 0) * 100),
        expectedDeliveryDate:
          service.serviceStandard?.expectedDeliveryDate || null,
        expectedTransitDays:
          service.serviceStandard?.expectedTransitTime ?? null,
      };
    })
    // Defensive: a missing/zero price field would otherwise silently show
    // up as "free shipping" in the cart. Drop it and log instead --
    // better to show one fewer option than to undercharge for real.
    .filter((rate) => {
      if (rate.priceCents > 0) return true;
      console.error(
        `Canada Post returned a non-positive price (${rate.priceCents} cents) for service ${rate.serviceCode} -- dropping this option instead of showing free shipping.`
      );
      return false;
    });
}

// =========================================
// TRACKING (Get Tracking Summary, PIN-based)
//
// Confirmed against Canada Post's Tracking 1.0.0 OpenAPI spec (Korallia
// downloaded it from the dev portal): GET /tracking/v1/pins/{pin}/summaries,
// same OAuth2 bearer token as Rating. Response is an array with one
// object; `actualDeliveryDate` is blank/absent until delivered, then
// holds the delivery date -- that's the field the poller checks.
// =========================================

const TRACKING_BASE_URL = `${API_BASE_URL}/tracking/v1`;

/**
 * @param {string} pin - the Canada Post tracking number (PIN)
 * @returns {Promise<{delivered: boolean, deliveredAt: string|null, rawEventDescription: string|null}>}
 */
export async function getCanadaPostTrackingStatus(pin) {
  assertCanadaPostConfig();

  const accessToken = await getAccessToken();

  const response = await fetchWithRetry(
    `${TRACKING_BASE_URL}/pins/${encodeURIComponent(pin)}/summaries`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Accept-Language": "fr-CA",
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.detail || data?.title || `Canada Post tracking failed: ${response.status}`
    );
    error.status = response.status;
    error.body = data;
    throw error;
  }

  // Response is an array (usually 1 item) of tracking-summary objects.
  const summary = Array.isArray(data) ? data[0] : null;

  if (!summary) {
    return { delivered: false, deliveredAt: null, rawEventDescription: null };
  }

  return {
    delivered: Boolean(summary.actualDeliveryDate),
    deliveredAt: summary.actualDeliveryDate || null,
    rawEventDescription: summary.eventDescription || null,
  };
}
