// scripts/testCanadaPostInternational.js
//
// Sonde Postes Canada pour les États-Unis et l'international : demande
// les services standards (pas d'express) et affiche code, nom, prix et
// délai. Lecture seulement : un calcul de prix, aucune expédition créée.
//
// Les codes de service sont imposés : si Postes Canada ignorait la
// destination (comme au premier essai), il refuserait ces codes au lieu
// de renvoyer un tarif canadien en silence.
//
// Usage : node backend/scripts/testCanadaPostInternational.js
//   Diagnostic (PowerShell) : $env:CP_DEBUG_RAW="1"; node backend/scripts/testCanadaPostInternational.js

import "dotenv/config";
import { getCanadaPostRates } from "../services/canadaPost.service.js";

const PARCEL = {
  weightKg: 1.11,
  dimensionsCm: { length: 30.48, width: 25.4, height: 11.43 },
};
const ORIGIN = process.env.SHIPPING_ORIGIN_POSTAL_CODE || "J0N1G0";

const USA_SERVICES = ["USA.EP", "USA.TP", "USA.SP.AIR"];
const INT_SERVICES = ["INT.TP", "INT.SP.SURF", "INT.SP.AIR", "INT.IP.SURF", "INT.IP.AIR"];

// CP_DEBUG_RAW=1 : affiche la demande et la réponse brutes (2 destinations).
const ALL_DESTINATIONS = [
  { label: "États-Unis (New York)", us: "10001" },
  { label: "États-Unis (Los Angeles)", us: "90001" },
  { label: "France", country: "FR" },
  { label: "Royaume-Uni", country: "GB" },
  { label: "Allemagne", country: "DE" },
  { label: "Australie", country: "AU" },
];
const DESTINATIONS = process.env.CP_DEBUG_RAW === "1"
  ? [ALL_DESTINATIONS[0], ALL_DESTINATIONS[2]]
  : ALL_DESTINATIONS;

// Format de la doc officielle (« united-states / zip-code »,
// « international / country-code »), en tirets puis en camelCase.
function destinationShapes(destination) {
  if (destination.us) {
    return [
      { "united-states": { "zip-code": destination.us } },
      { unitedStates: { zipCode: destination.us } },
    ];
  }
  return [
    { international: { "country-code": destination.country } },
    { international: { countryCode: destination.country } },
  ];
}

for (const destination of DESTINATIONS) {
  console.log(`== ${destination.label}`);
  const services = destination.us ? USA_SERVICES : INT_SERVICES;
  let done = false;

  for (const shape of destinationShapes(destination)) {
    try {
      const rates = await getCanadaPostRates({ originPostalCode: ORIGIN, destination: shape, serviceCodes: services, ...PARCEL });
      const codes = rates.map((rate) => rate.serviceCode);
      const real = codes.length > 0 && codes.every((code) => /^(USA|INT)\./.test(code));
      console.log(`   forme ${JSON.stringify(shape)} : ${real ? "OK" : "réponse suspecte"}`);
      for (const rate of rates) {
        console.log(
          `   ${String(rate.serviceCode).padEnd(12)} ${String(rate.serviceLabel).padEnd(42)} ${(rate.priceCents / 100).toFixed(2).padStart(8)} $   ${rate.expectedTransitDays ?? "?"} jour(s)`
        );
      }
      if (real) { done = true; break; }
    } catch (error) {
      const detail = JSON.stringify(error.body?.messages || error.body || error.message).slice(0, 220);
      console.log(`   forme refusée ${JSON.stringify(shape)} : ${detail}`);
    }
  }

  if (!done) console.log("   aucune forme confirmée");
  console.log("");
}
