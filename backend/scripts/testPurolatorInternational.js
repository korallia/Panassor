// scripts/testPurolatorInternational.js
//
// Sonde Purolator pour la livraison internationale : pour quelques
// destinations types, demande TOUS les services offerts (alternatives
// incluses) et affiche leur code, prix et délai. Sert à confirmer les
// vrais codes de service avant de brancher le calcul dans le panier.
// Lecture seulement : un calcul de prix, aucune expédition créée.
//
// Usage : node backend/scripts/testPurolatorInternational.js

import "dotenv/config";
import { getPurolatorEstimate } from "../services/purolator.service.js";

const PARCEL = {
  weightKg: 1.11,
  dimensionsCm: { length: 30.48, width: 25.4, height: 11.43 },
};

const DESTINATIONS = [
  { label: "États-Unis (New York)", country: "US", province: "NY", city: "New York", postalCode: "10001" },
  { label: "États-Unis (Californie)", country: "US", province: "CA", city: "Los Angeles", postalCode: "90001" },
  { label: "France (Paris)", country: "FR", province: "", city: "Paris", postalCode: "75001" },
  { label: "Royaume-Uni (Londres)", country: "GB", province: "", city: "London", postalCode: "SW1A 1AA" },
  { label: "Allemagne (Berlin)", country: "DE", province: "", city: "Berlin", postalCode: "10115" },
  { label: "Australie (Sydney)", country: "AU", province: "NSW", city: "Sydney", postalCode: "2000" },
];

const SERVICE_IDS = ["PurolatorExpressInternational", "PurolatorExpressU.S.", "PurolatorGroundU.S."];

console.log(`Purolator : environnement ${process.env.PUROLATOR_ENVIRONMENT || "(non défini)"}\n`);

for (const destination of DESTINATIONS) {
  console.log(`== ${destination.label}`);
  const seen = new Set();

  for (const serviceId of SERVICE_IDS) {
    try {
      const rates = await getPurolatorEstimate({
        destinationPostalCode: destination.postalCode,
        destinationCity: destination.city,
        destinationProvince: destination.province,
        destinationCountry: destination.country,
        serviceId,
        showAlternativeServicesIndicator: true,
        ...PARCEL,
      });

      for (const rate of rates) {
        if (seen.has(rate.serviceCode)) continue;
        seen.add(rate.serviceCode);
        console.log(
          `   ${rate.serviceCode.padEnd(34)} ${(rate.priceCents / 100).toFixed(2).padStart(8)} $   ${rate.expectedTransitDays ?? "?"} jour(s)`
        );
      }
    } catch (error) {
      const detail = JSON.stringify(error.body?.errors || error.body || error.message).slice(0, 220);
      console.log(`   (${serviceId}) refusé : ${detail}`);
    }
  }

  console.log("");
}
