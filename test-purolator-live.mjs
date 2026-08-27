// Script de test ponctuel -- a lancer toi-meme dans TON terminal (pas via
// moi), depuis la racine du projet: node test-purolator-live.mjs
import "dotenv/config";
import { getPurolatorEstimate } from "./backend/services/purolator.service.js";

async function main() {
  try {
    const estimates = await getPurolatorEstimate({
      destinationPostalCode: "K1K1K1",
      destinationCity: "Ottawa",
      destinationProvince: "ON",
      destinationCountry: "CA",
      weightKg: 1.11,
      dimensionsCm: { length: 30.5, width: 25.4, height: 11.4 },
    });
    console.log("SUCCES -- estimations recues:");
    console.log(JSON.stringify(estimates, null, 2));
  } catch (err) {
    console.error("ERREUR:", err.message);
    if (err.body) console.error("BODY:", JSON.stringify(err.body, null, 2));
    if (err.requestReference) console.error("REQUEST REFERENCE (a donner a Purolator):", err.requestReference);
    if (err.responseHeaders) console.error("RESPONSE HEADERS:", JSON.stringify(err.responseHeaders, null, 2));
  }
}

main();
