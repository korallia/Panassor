// Script de test ponctuel — a lancer toi-meme dans TON terminal (pas via moi),
// depuis la racine du projet: node test-canada-post-live.mjs
// Utilise le vrai service backend/services/canadaPost.service.js, ton .env
// reel, et l'adresse d'origine (centre de depot) configuree dans env.js.
import "dotenv/config";
import { env } from "./backend/config/env.js";
import { getCanadaPostDomesticRates } from "./backend/services/canadaPost.service.js";

async function main() {
  console.log("Origine utilisee:", env.shippingOrigin.postalCode, `(${env.shippingOrigin.city}, ${env.shippingOrigin.province})`);

  try {
    const rates = await getCanadaPostDomesticRates({
      originPostalCode: env.shippingOrigin.postalCode,
      destinationPostalCode: "K1K1K1", // Ottawa, juste pour tester
      weightKg: 1.11,
      dimensionsCm: { length: 30.48, width: 25.4, height: 11.43 },
    });
    console.log("SUCCES — tarifs recus:");
    console.log(JSON.stringify(rates, null, 2));
  } catch (err) {
    console.error("ERREUR:", err.message);
    if (err.cause) console.error("CAUSE:", err.cause);
  }
}

main();
