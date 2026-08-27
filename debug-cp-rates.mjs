import "dotenv/config";
import { env } from "./backend/config/env.js";

const API_BASE_URL =
  "https://api.canadapost-postescanada.ca/prod/devportal-portaildesdeveloppeurs";
const TOKEN_URL = `${API_BASE_URL}/cpc-api-native-oauth-provider/oauth2/token`;
const RATES_URL = `${API_BASE_URL}/rating/v1/prices`;

async function main() {
  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "X-IBM-Client-Id": env.canadaPost.apiKey,
      "X-IBM-Client-Secret": env.canadaPost.apiSecret,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials", scope: "merchant" }),
  });
  const tokenData = await tokenRes.json();
  console.log("TOKEN STATUS:", tokenRes.status);

  const reqBody = {
    quoteType: "commercial",
    parcelCharacteristics: {
      weight: 1.11,
      dimensions: { length: 30.5, width: 25.4, height: 11.4 },
    },
    services: ["DOM.EP", "DOM.XP"],
    originPostalCode: env.shippingOrigin.postalCode,
    destination: { domestic: { postalCode: "K1K1K1" } },
    customerNumber: env.canadaPost.customerNumber,
  };
  console.log("REQUEST BODY:", JSON.stringify(reqBody, null, 2));

  const ratesRes = await fetch(RATES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Language": "fr-CA",
    },
    body: JSON.stringify(reqBody),
  });
  const rawText = await ratesRes.text();
  console.log("RATES STATUS:", ratesRes.status);
  console.log("RATES RAW BODY:", rawText);
}
main().catch((e) => console.error("SCRIPT ERROR:", e));
