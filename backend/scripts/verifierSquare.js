// scripts/verifierSquare.js — LECTURE SEULE : compare la base et Square.
//
// Usage (depuis la racine du projet, avec le .env de l'environnement voulu) :
//   node backend/scripts/verifierSquare.js
//
// Pour chaque produit : est-ce qu'il existe sur Square, avec les bonnes
// variations (couleurs, options) et les bons prix ? Et pour chaque kit : est-ce
// que la liste « outil au choix » de Square contient les bons outils ?
// N'écrit RIEN, ni dans la base ni dans Square. Pour corriger un produit :
//   node backend/scripts/syncProducts.js --product <slug>
import "dotenv/config";
import db from "../db/pool.js";
import { squareFetch, assertSquareConfig } from "../services/square.service.js";

assertSquareConfig();
console.log(`Environnement Square : ${process.env.SQUARE_ENVIRONMENT || "(non defini)"}`);
console.log(`Base : ${new URL(process.env.DATABASE_URL).hostname}\n`);

const money = (cents) => `${(Number(cents) / 100).toFixed(2)} $`;

// Objets Square par id (par paquets de 1000), sans les objets supprimés.
async function retrieve(ids) {
  const found = new Map();
  const unique = [...new Set(ids.filter(Boolean))];
  for (let i = 0; i < unique.length; i += 1000) {
    const data = await squareFetch("/v2/catalog/batch-retrieve", {
      method: "POST",
      body: JSON.stringify({ object_ids: unique.slice(i, i + 1000) }),
    });
    for (const object of data.objects || []) if (!object.is_deleted) found.set(object.id, object);
  }
  return found;
}

const products = (
  await db.query(
    `SELECT p.id, p.slug_fr, p.name_fr, p.is_kit, p.price_cents, p.square_item_id, p.square_default_variation_id,
            c.name_fr AS collection, c.status
     FROM products p JOIN collections c ON c.id = p.collection_id
     ORDER BY c.name_fr, p.is_kit DESC, p.name_fr`
  )
).rows;
const variants = (
  await db.query(
    `SELECT v.product_id, v.id, v.square_variation_id, v.price_delta_cents, col.name_fr AS color
     FROM product_variants v JOIN colors col ON col.id = v.color_id
     WHERE v.color_id IS NOT NULL`
  )
).rows;
const options = (
  await db.query(`SELECT product_id, id, label_fr, price_cents, square_variation_id FROM product_options`)
).rows;
const toolLists = (
  await db.query(
    `SELECT kc.id, kc.kit_product_id, kc.square_modifier_id AS list_id, p.name_fr AS slot
     FROM kit_components kc
     JOIN products p ON p.id = kc.included_product_id
     JOIN products kit ON kit.id = kc.kit_product_id AND kit.is_kit
     WHERE p.customizable`
  )
).rows;
const toolChoices = (
  await db.query(
    `SELECT m.kit_component_id, m.square_modifier_id, p.name_fr AS tool
     FROM kit_component_modifiers m JOIN products p ON p.id = m.tool_product_id`
  )
).rows;

const square = await retrieve([
  ...products.map((p) => p.square_item_id),
  ...toolLists.map((t) => t.list_id),
]);

let okCount = 0;
const report = [];

for (const product of products) {
  const problems = [];
  const item = product.square_item_id && square.get(product.square_item_id);

  if (product.price_cents == null) problems.push("pas de prix dans la base (jamais envoyé à Square)");
  else if (!product.square_item_id) problems.push("jamais synchronisé (pas d'article Square)");
  else if (!item) problems.push("l'article Square n'existe plus (supprimé ou autre compte Square)");
  else {
    const squareVariations = new Map(
      (item.item_data?.variations || []).map((v) => [v.id, v.item_variation_data || {}])
    );
    const expected = [];
    for (const v of variants.filter((x) => x.product_id === product.id)) {
      expected.push({ label: `couleur ${v.color}`, id: v.square_variation_id, price: Number(product.price_cents) + Number(v.price_delta_cents || 0) });
    }
    for (const o of options.filter((x) => x.product_id === product.id)) {
      expected.push({ label: `option « ${o.label_fr} »`, id: o.square_variation_id, price: Number(o.price_cents) });
    }
    if (expected.length === 0) {
      expected.push({ label: "variation par défaut", id: product.square_default_variation_id, price: Number(product.price_cents) });
    }

    for (const e of expected) {
      if (!e.id) problems.push(`${e.label} : jamais envoyée à Square`);
      else if (!squareVariations.has(e.id)) problems.push(`${e.label} : absente de l'article Square`);
      else {
        const amount = squareVariations.get(e.id).price_money?.amount;
        if (amount !== e.price) problems.push(`${e.label} : prix Square ${money(amount ?? 0)} ≠ base ${money(e.price)}`);
      }
    }
    const known = new Set(expected.map((e) => e.id));
    for (const [id, data] of squareVariations) {
      if (!known.has(id)) problems.push(`variation « ${data.name || id} » sur Square mais plus dans la base`);
    }
    if (item.item_data?.name !== product.name_fr) problems.push(`nom Square « ${item.item_data?.name} » ≠ base « ${product.name_fr} »`);

    // Kits : listes « outil au choix ».
    if (product.is_kit) {
      for (const list of toolLists.filter((t) => t.kit_product_id === product.id)) {
        const squareList = list.list_id && square.get(list.list_id);
        if (!list.list_id || !squareList) {
          problems.push(`liste « ${list.slot} » (outil au choix) : absente de Square`);
          continue;
        }
        const squareModifiers = new Set((squareList.modifier_list_data?.modifiers || []).map((m) => m.id));
        for (const choice of toolChoices.filter((c) => c.kit_component_id === list.id)) {
          if (!choice.square_modifier_id || !squareModifiers.has(choice.square_modifier_id)) {
            problems.push(`outil « ${choice.tool} » : absent de la liste outil au choix sur Square`);
          }
        }
      }
    }
  }

  if (problems.length === 0) okCount += 1;
  else report.push({ product, problems });
}

for (const { product, problems } of report) {
  const where = `${product.collection}${product.status !== "published" ? ` (${product.status})` : ""}`;
  console.log(`✗ ${product.name_fr}  [${product.slug_fr} · ${where}]`);
  for (const problem of problems) console.log(`    - ${problem}`);
}
console.log(`\n${okCount} produit(s) à jour, ${report.length} à revoir.`);
if (report.length) {
  console.log("Pour corriger : node backend/scripts/syncProducts.js --product <slug>  (essaie --dry-run d'abord)");
}
// Pas de process.exit() : sous Windows, quitter pendant que la connexion se
// ferme affiche « Assertion failed … UV_HANDLE_CLOSING ».
await db.end();
