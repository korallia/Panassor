// scripts/syncProducts.js
//
// Usage (depuis la racine du projet) :
//   node backend/scripts/syncProducts.js                               -> TOUS les produits
//   node backend/scripts/syncProducts.js --collection <slug>           -> une seule collection
//   node backend/scripts/syncProducts.js --collection <slug> --dry-run -> apercu, rien n'est envoye
//   node backend/scripts/syncProducts.js --product <slug> [--product <slug2>] -> seulement ces produits
//   node backend/scripts/syncProducts.js --modifiers-only              -> met a jour SEULEMENT les
//       listes "outil au choix" de TOUS les kits (ex. apres la publication d'une collection qui
//       ajoute des outils). Ne touche ni aux articles, ni aux prix, ni a l'inventaire.
import "dotenv/config";
import { syncAllProductsToSquare } from "../services/square.catalog.service.js";
import { syncKitComponentModifierLists } from "../services/square.kitModifiers.service.js";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const collectionIndex = args.indexOf("--collection");
const collectionSlug = collectionIndex !== -1 ? args[collectionIndex + 1] : undefined;
const productSlugs = args
  .map((arg, index) => (arg === "--product" ? args[index + 1] : null))
  .filter((slug) => slug && !slug.startsWith("--"));

if (collectionIndex !== -1 && (!collectionSlug || collectionSlug.startsWith("--"))) {
  console.error("Il manque le slug apres --collection (ex: --collection ma-collection)");
  process.exit(1);
}

console.log(`Environnement Square : ${process.env.SQUARE_ENVIRONMENT || "(non defini)"}`);

if (args.includes("--modifiers-only")) {
  try {
    const results = await syncKitComponentModifierLists();
    console.log(`Listes "outil au choix" mises a jour : ${results.length}`);
    process.exit(0);
  } catch (error) {
    console.error("Synchro des outils au choix annulee :", error.message);
    process.exit(1);
  }
}

try {
  const results = await syncAllProductsToSquare({ collectionSlug, productSlugs, dryRun });
  if (!dryRun) {
    console.log(JSON.stringify(results, null, 2));
    const failed = results.filter((r) => !r.ok);
    console.log(`\n${results.length - failed.length} OK, ${failed.length} en echec`);
  }
  process.exit(0);
} catch (error) {
  console.error("Synchro annulee :", error.message);
  process.exit(1);
}
