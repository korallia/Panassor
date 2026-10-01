// scripts/testCanadaPostVariants.js
//
// Diagnostic de l'erreur 9111 (« pas de service approprié ») vers
// l'international : envoie la même demande France en changeant une
// chose à la fois, pour trouver ce qui bloque. Lecture seulement.
//
// Usage : node backend/scripts/testCanadaPostVariants.js

import "dotenv/config";
import { getCanadaPostRates } from "../services/canadaPost.service.js";

const ORIGIN = process.env.SHIPPING_ORIGIN_POSTAL_CODE || "J0N1G0";
const PARCEL = { weightKg: 1.11, dimensionsCm: { length: 30.48, width: 25.4, height: 11.43 } };
const FR = { international: { countryCode: "FR" } };

// Tout échouait vers la France avec n'importe quel colis ou compte :
// on teste donc d'autres pays et d'autres formes de destination.
const SMALL = { weightKg: 0.5, dimensionsCm: { length: 20, width: 15, height: 5 } };
const VARIANTS = [
  { label: "France (témoin de l'échec)", destination: FR },
  { label: "France + code postal", destination: { international: { countryCode: "FR", postalCode: "75001" } } },
  { label: "Royaume-Uni", destination: { international: { countryCode: "GB" } } },
  { label: "Allemagne", destination: { international: { countryCode: "DE" } } },
  { label: "Mexique", destination: { international: { countryCode: "MX" } } },
  { label: "Australie", destination: { international: { countryCode: "AU" } } },
  { label: "Japon", destination: { international: { countryCode: "JP" } } },
  { label: "France, petit colis, service INT.SP.AIR seul", destination: FR, parcel: SMALL, tweak: (b) => { b.services = ["INT.SP.AIR"]; } },
  { label: "France, petit colis, service INT.TP seul", destination: FR, parcel: SMALL, tweak: (b) => { b.services = ["INT.TP"]; } },
  { label: "États-Unis (témoin OK)", destination: { unitedStates: { zipCode: "10001" } } },
];

for (const v of VARIANTS) {
  try {
    const rates = await getCanadaPostRates({
      originPostalCode: ORIGIN,
      destination: v.destination || FR,
      ...(v.parcel || PARCEL),
      tweakBody: v.tweak,
    });
    console.log(`OK    ${v.label} -> ${rates.map((r) => `${r.serviceCode} ${(r.priceCents / 100).toFixed(2)}$`).join(", ") || "(vide)"}`);
  } catch (error) {
    const e = error.body?.errors?.[0];
    console.log(`ÉCHEC ${v.label} -> ${e ? `${e.errorCode} ${e.message}` : error.message}`);
  }
}
