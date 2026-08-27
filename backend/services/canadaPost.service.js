import { env } from "../config/env.js";

// Canada Post's new (2026) Developer Portal API: REST/JSON only, OAuth2
// client_credentials. Docs: developer-developpeur.canadapost-postescanada.ca
// -> APIs -> Rating 4.0.0 -> API references -> Get Rates.

const API_BASE_URL =
  "https://api.canadapost-postescanada.ca/prod/devportal-portaildesdeveloppeurs";

const TOKEN_URL = `${API_BASE_URL}/cpc-api-native-oauth-provider/oauth2/token`;
const RATES_URL = `${API_BASE_URL}/rating/v1/prices`;

// The two domestic service codes we surface to shoppers (see the
// shipping plan, section 02): Postes Canada standard tiers. Purolator
// Express covers the "fast" domestic option separately.
export const CANADA_POST_DOMESTIC_SERVICE_CODES = ["DOM.EP", "DOM.XP"];

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

  const response = await fetch(TOKEN_URL, {
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

  const response = await fetch(RATES_URL, {
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
  // NOTE: the live response uses kebab-case keys for these two fields
  // ("service-name", "price-details") even though serviceCode and
  // serviceStandard's own children are camelCase -- confirmed via a raw
  // debug call. Reading the camelCase names we originally guessed
  // silently returned undefined (blank service name, $0.00 price).
  return (Array.isArray(data) ? data : []).map((service) => ({
    id: `cp-${service.serviceCode}`.toLowerCase(),
    carrier: "postes_canada",
    carrierLabel: "Postes Canada",
    serviceCode: service.serviceCode,
    serviceLabel: service["service-name"],
    priceCents: Math.round(Number(service["price-details"]?.due || 0) * 100),
    expectedDeliveryDate:
      service.serviceStandard?.expectedDeliveryDate || null,
    expectedTransitDays:
      service.serviceStandard?.expectedTransitTime ?? null,
  }));
}
