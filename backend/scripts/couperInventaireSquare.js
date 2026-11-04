// scripts/couperInventaireSquare.js — coupe le suivi d'inventaire de Square.
//
// Le stock est maintenant compté par l'atelier seulement. Ce script enlève le
// suivi de stock sur TOUTES les variations de Square (couleurs, options
// d'aiguilles, variations par défaut), et aussi sur chaque emplacement.
// Il ne touche ni aux prix, ni aux noms, ni aux images.
//
// Usage (depuis la racine du projet, avec le .env de l'environnement voulu) :
//   node backend/scripts/couperInventaireSquare.js              -> APERÇU, rien n'est changé
//   node backend/scripts/couperInventaireSquare.js --appliquer  -> change pour vrai
import "dotenv/config";
import { squareFetch, assertSquareConfig } from "../services/square.service.js";

assertSquareConfig();
const apply = process.argv.includes("--appliquer");
console.log(`Environnement Square : ${process.env.SQUARE_ENVIRONMENT || "(non defini)"}`);
console.log(apply ? "Mode : APPLIQUER\n" : "Mode : aperçu (ajoute --appliquer pour changer pour vrai)\n");

// Tous les articles de Square, avec leurs variations.
const items = [];
let cursor;
do {
  const query = new URLSearchParams({ types: "ITEM", ...(cursor && { cursor }) });
  const data = await squareFetch(`/v2/catalog/list?${query}`);
  items.push(...(data.objects || []).filter((object) => !object.is_deleted));
  cursor = data.cursor;
} while (cursor);

// Variations encore suivies (par la variation ou par un emplacement).
const toFix = [];
for (const item of items) {
  for (const variation of item.item_data?.variations || []) {
    const data = variation.item_variation_data || {};
    const overrides = data.location_overrides || [];
    const tracked = data.track_inventory || overrides.some((o) => o.track_inventory || o.sold_out);
    if (!tracked) continue;
    toFix.push({ item: item.item_data.name, variation, label: data.name || "(par défaut)" });
  }
}

if (!toFix.length) {
  console.log("Rien à changer : aucune variation n'est suivie.");
  process.exit(0);
}
for (const { item, label } of toFix) console.log(`  ${item} — ${label}`);
console.log(`\n${toFix.length} variation(s) encore suivie(s).`);
if (!apply) process.exit(0);

// Mise à jour par paquets de 100 (on renvoie chaque variation, suivi coupé).
for (let i = 0; i < toFix.length; i += 100) {
  const objects = toFix.slice(i, i + 100).map(({ variation }) => {
    const data = { ...variation.item_variation_data, track_inventory: false };
    if (data.location_overrides) {
      data.location_overrides = data.location_overrides.map(({ sold_out, sold_out_valid_until, ...o }) => ({
        ...o,
        track_inventory: false,
        inventory_alert_type: "NONE",
      }));
    }
    delete data.inventory_alert_threshold;
    return { type: "ITEM_VARIATION", id: variation.id, version: variation.version, item_variation_data: { ...data, inventory_alert_type: "NONE" } };
  });
  await squareFetch("/v2/catalog/batch-upsert", {
    method: "POST",
    body: JSON.stringify({ idempotency_key: `couper-inventaire-${Date.now()}-${i}`, batches: [{ objects }] }),
  });
}
console.log("Suivi d'inventaire coupé ✓ — rafraîchis la page Articles de Square.");
