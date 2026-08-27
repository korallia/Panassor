// Script de debug ponctuel -- affiche la reponse BRUTE complete de
// l'Estimate API (pas juste la version normalisee), pour voir s'il y a
// un indice sur pourquoi le tableau d'estimations est vide en sandbox.
import "dotenv/config";
import { env } from "./backend/config/env.js";

const SANDBOX_BASE_URL = "https://shipapi-sandbox.purolator.com";
const TOKEN_URL = "https://shipapi.purolator.com/auth/v1/token";
const ESTIMATE_URL = `${SANDBOX_BASE_URL}/rate/v1/shipment`;

async function getToken() {
  const basicAuth = Buffer.from(`${env.purolator.clientId}:${env.purolator.clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${basicAuth}` },
    body: JSON.stringify({ grant_type: "client_credentials", scope: "portal_api" }),
  });
  const data = await res.json();
  return data.access_token;
}

async function main() {
  const token = await getToken();

  const body = {
    lineOfBusiness: "Courier",
    shipmentDate: new Date().toISOString().slice(0, 10),
    outboundShipment: {
      billingInformation: {
        billingAccountNumber: env.purolator.testSenderAccount,
        displayPublishedRates: false,
      },
      senderInformation: {
        companyName: env.shippingOrigin.name,
        streetAddress: [env.shippingOrigin.street],
        city: env.shippingOrigin.city,
        provinceStateCode: env.shippingOrigin.province,
        country: env.shippingOrigin.country,
        postalZipCode: env.shippingOrigin.postalCode.replace(/(.{3})(.{3})/, "$1 $2"),
      },
      receiverInformation: {
        companyName: "Client",
        city: "Ottawa",
        provinceStateCode: "ON",
        country: "CA",
        postalZipCode: "K1K 1K1",
      },
      shipmentInformation: {
        serviceId: "PurolatorExpressBox9AM",
        unitOfMeasurement: "Imperial",
        showAlternativeServicesIndicator: true,
        totalWeight: 2.45,
        totalPackages: 1,
        packageInformation: [
          { packageWeight: 2.45, packageLength: 12.01, packageWidth: 10.0, packageHeight: 4.49 },
        ],
      },
    },
  };

  console.log("REQUEST BODY:");
  console.log(JSON.stringify(body, null, 2));

  const response = await fetch(ESTIMATE_URL, {
    method: "POST",
    headers: {
      "x-api-key": env.purolator.apiKey,
      Language: "EN",
      RequestReference: crypto.randomUUID(),
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  console.log("\nSTATUS:", response.status);
  console.log("RAW RESPONSE BODY:");
  console.log(text);
}

main().catch((err) => console.error("ERREUR SCRIPT:", err));
