import { env } from "../config/env.js";
import { fetchWithRetry } from "../utils/fetchWithRetry.js";

// Purolator's new (2026) REST API Portal: OAuth2 client_credentials over
// HTTP Basic Auth, plus a separate x-api-key header on every call after
// auth. Docs: ship.purolator.com/developer -> REST APIs -> Authentication
// API / Estimate API.

const PRODUCTION_BASE_URL = "https://shipapi.purolator.com";
// Confirmed from the Estimate API's own OpenAPI spec ("servers" array):
// business APIs (Estimate, etc.) are hosted on a SEPARATE sandbox stage,
// distinct from production. Our test/dev app only ever gets a
// "portal_api_sandbox"-scoped token (confirmed via JWT decode), so calling
// the production host with it triggers an IAM-style
// "explicit deny in an identity-based policy" / AccessDeniedException --
// this was the actual root cause of the persistent 403 on Estimate.
const SANDBOX_BASE_URL = "https://shipapi-sandbox.purolator.com";

// Authentication has empirically worked fine against the production host
// even for a sandbox-scoped app, so we leave the token endpoint as-is and
// only switch hosts for the business APIs (Estimate, etc.) below.
const API_BASE_URL = PRODUCTION_BASE_URL;
const TOKEN_URL = `${API_BASE_URL}/auth/v1/token`;

function getBusinessApiBaseUrl() {
  return env.purolator.environment === "production" ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL;
}

// Real domestic "fast" service Purolator offers alongside Postes Canada's
// standard tier (see the shipping plan, section 02/03). International
// uses a separate service id below. NOTE: these exact serviceId strings
// are our best guess from Purolator's docs example
// ("PurolatorExpressBox9AM" was shown for a *specific* guaranteed-time
// product) -- we ask for alternatives too so we can confirm/correct the
// right id from a live response.
const DOMESTIC_SERVICE_ID = "PurolatorExpress";
const INTERNATIONAL_SERVICE_ID = "PurolatorExpressInternational";

let cachedToken = null; // { accessToken, expiresAt: epochMs }

function assertPurolatorConfig() {
  if (!env.purolator.clientId || !env.purolator.clientSecret || !env.purolator.apiKey) {
    throw new Error(
      "PUROLATOR_CLIENT_ID / PUROLATOR_CLIENT_SECRET / PUROLATOR_API_KEY is missing"
    );
  }
}

// Purolator wants postal codes formatted with a space (e.g. "A7A 4Y7"),
// unlike Canada Post's Rating API which wants no space.
function formatPostalCode(postalCode) {
  const normalized = String(postalCode || "")
    .replace(/\s+/g, "")
    .toUpperCase();

  if (normalized.length !== 6) {
    return normalized;
  }

  return `${normalized.slice(0, 3)} ${normalized.slice(3)}`;
}

async function fetchAccessToken() {
  assertPurolatorConfig();

  const basicAuth = Buffer.from(
    `${env.purolator.clientId}:${env.purolator.clientSecret}`
  ).toString("base64");

  const response = await fetchWithRetry(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`,
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      scope: "portal_api",
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.error_description || data?.error || `Purolator auth failed: ${response.status}`
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

function buildAddress({ companyName, street, city, province, country, postalCode }) {
  return {
    companyName,
    streetAddress: [street],
    city,
    provinceStateCode: province,
    country,
    postalZipCode: formatPostalCode(postalCode),
  };
}

/**
 * Get a live Purolator shipping estimate.
 *
 * @param {Object} params
 * @param {string} params.destinationPostalCode
 * @param {string} [params.destinationCity] - best-effort; Purolator's
 *   schema example includes city/province on the receiver, but we may
 *   only have a bare postal code from the cart's shopper input.
 * @param {string} [params.destinationProvince]
 * @param {string} [params.destinationCountry] - ISO 2-letter, defaults "CA"
 * @param {number} params.weightKg
 * @param {{length:number,width:number,height:number}} [params.dimensionsCm]
 * @param {string} [params.serviceId] - defaults to the domestic Express
 *   service id; pass INTERNATIONAL_SERVICE_ID for international quotes.
 */
export async function getPurolatorEstimate({
  destinationPostalCode,
  destinationCity = "",
  destinationProvince = "",
  destinationCountry = "CA",
  weightKg,
  dimensionsCm,
  serviceId = DOMESTIC_SERVICE_ID,
  // Purolator returns extra "alternative" services alongside the one
  // requested when this is true -- handy while we were still confirming
  // which serviceId strings are valid, but the cart only wants exactly
  // the one requested service now.
  showAlternativeServicesIndicator = true,
}) {
  assertPurolatorConfig();

  const accessToken = await getAccessToken();

  // 1kg = 2.20462 lb, 1cm = 0.393701 in -- Purolator's example request
  // uses "Imperial" units (lb/in).
  const weightLb = weightKg * 2.20462;
  const dims = dimensionsCm
    ? {
        packageLength: Number((dimensionsCm.length * 0.393701).toFixed(2)),
        packageWidth: Number((dimensionsCm.width * 0.393701).toFixed(2)),
        packageHeight: Number((dimensionsCm.height * 0.393701).toFixed(2)),
      }
    : {};

  const billingAccountNumber =
    env.purolator.environment === "production"
      ? env.purolator.accountNumber
      : env.purolator.testSenderAccount;

  const sender = buildAddress({
    companyName: env.shippingOrigin.name,
    street: env.shippingOrigin.street,
    city: env.shippingOrigin.city,
    province: env.shippingOrigin.province,
    country: env.shippingOrigin.country,
    postalCode: env.shippingOrigin.postalCode,
  });

  const receiver = buildAddress({
    companyName: "Client",
    street: "",
    city: destinationCity,
    province: destinationProvince,
    country: destinationCountry,
    postalCode: destinationPostalCode,
  });

  const body = {
    lineOfBusiness: "Courier",
    outboundShipment: {
      billingInformation: {
        billingAccountNumber,
        displayPublishedRates: false,
      },
      senderInformation: sender,
      receiverInformation: receiver,
      shipmentInformation: {
        serviceId,
        unitOfMeasurement: "Imperial",
        showAlternativeServicesIndicator,
        totalWeight: Number(weightLb.toFixed(2)),
        totalPackages: 1,
        packageInformation: [
          {
            packageWeight: Number(weightLb.toFixed(2)),
            ...dims,
          },
        ],
      },
    },
  };

  const requestReference = crypto.randomUUID();

  const estimateUrl = `${getBusinessApiBaseUrl()}/rate/v1/shipment`;

  const response = await fetchWithRetry(estimateUrl, {
    method: "POST",
    headers: {
      "x-api-key": env.purolator.apiKey,
      Language: "fr",
      RequestReference: requestReference,
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.message || data?.error_description || `Purolator estimate failed: ${response.status}`
    );
    error.status = response.status;
    error.body = data;
    error.requestReference = requestReference;
    // Capture every response header -- API-gateway-fronted APIs (this looks
    // AWS-API-Gateway-shaped from the "explicit deny in an identity-based
    // policy" phrasing) usually stamp a request/trace id here even when the
    // JSON body is a bare {"Message": "..."}. That id is what Purolator
    // support needs to look up *why* the deny happened on their end.
    error.responseHeaders = Object.fromEntries(response.headers.entries());
    throw error;
  }

  // NOTE: the OpenAPI spec documents outboundShipmentEstimates as an
  // OBJECT wrapping a `shipmentEstimate` array ({shipmentEstimate: [...]})
  // but the live API actually returns outboundShipmentEstimates itself as
  // an ARRAY, with each item wrapping a single `shipmentEstimate` object
  // ([{shipmentEstimate: {...}}, ...]). Confirmed via a raw debug call --
  // the spec and the live response disagree here, so we parse the real
  // (array-of-wrappers) shape.
  const estimates = (data?.outboundShipmentEstimates || [])
    .map((wrapper) => wrapper?.shipmentEstimate)
    .filter(Boolean);

  // Normalized into the same shape as the Canada Post quotes.
  return estimates
    .map((estimate) => ({
      id: `purolator-${estimate.serviceId}`.toLowerCase(),
      carrier: "purolator",
      carrierLabel: "Purolator",
      serviceCode: estimate.serviceId,
      serviceLabel: estimate.serviceId,
      priceCents: Math.round(Number(estimate.totalPrice || 0) * 100),
      expectedDeliveryDate: estimate.expectedDeliveryDate || null,
      expectedTransitDays: estimate.estimatedTransitDays ?? null,
    }))
    // Defensive: a missing/zero price field would otherwise silently show
    // up as "free shipping" in the cart. Drop it and log instead --
    // better to show one fewer option than to undercharge for real.
    .filter((rate) => {
      if (rate.priceCents > 0) return true;
      console.error(
        `Purolator returned a non-positive price (${rate.priceCents} cents) for service ${rate.serviceCode} -- dropping this option instead of showing free shipping.`
      );
      return false;
    });
}

export const PUROLATOR_DOMESTIC_SERVICE_ID = DOMESTIC_SERVICE_ID;
export const PUROLATOR_INTERNATIONAL_SERVICE_ID = INTERNATIONAL_SERVICE_ID;

// =========================================
// TRACKING (search by tracking id)
//
// Confirmed against Purolator's Tracking OpenAPI spec (Korallia
// downloaded it from the API Portal): POST /track/v1/shipment, same
// bearer token + x-api-key as the Estimate call above. The delivered
// signal is package.details.deliveryDetails.deliveryDateTime -- only
// present once the package has actually been delivered (it also carries
// who signed for it, per the spec), so that's what the poller checks.
// =========================================

/**
 * @param {string} pin - the Purolator tracking number
 * @returns {Promise<{delivered: boolean, deliveredAt: string|null, rawStatusDescription: string|null}>}
 */
export async function getPurolatorTrackingStatus(pin) {
  assertPurolatorConfig();

  const accessToken = await getAccessToken();

  const body = {
    language: "en",
    search: [{ trackingId: pin }],
  };

  const response = await fetchWithRetry(
    `${getBusinessApiBaseUrl()}/track/v1/shipment`,
    {
      method: "POST",
      headers: {
        "x-api-key": env.purolator.apiKey,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.errors?.[0]?.description ||
        `Purolator tracking failed: ${response.status}`
    );
    error.status = response.status;
    error.body = data;
    throw error;
  }

  const searchResultPin = data?.searchResult?.[0]?.pin;
  const purolatorPackage = searchResultPin?.shipment?.package?.[0];
  const deliveryDetails = purolatorPackage?.details?.deliveryDetails;

  return {
    delivered: Boolean(deliveryDetails?.deliveryDateTime),
    deliveredAt: deliveryDetails?.deliveryDateTime || null,
    rawStatusDescription: purolatorPackage?.status?.description || null,
  };
}
