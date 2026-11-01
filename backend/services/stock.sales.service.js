// Ventes → stock de l'atelier.
//
// Quand Square confirme un paiement, on retire du stock de l'atelier (table
// stock) ce que la commande a fait sortir, et on laisse une ligne par chose
// retirée dans l'historique (stock_movements, raison « vente », personne
// vide = Square). Toutes les lignes d'une commande ont la même note
// « Commande #67 (Square …) » : l'atelier les regroupe en une seule ligne.
//
// Ce qui est retiré :
//   produit régulier (outil / pièce vendu seul) → lui-même
//   kit d'une couleur → l'étui de cette couleur, les pièces fixes du kit,
//                       et l'outil choisi par le client (modificateur Square)
//   aiguilles dans un kit → la recette de leur option PAR DÉFAUT
//                       (suture : « 1 droite + 1 courbe ») ; le client ne
//                       choisit pas encore ses aiguilles dans un kit
//   option vendue (aiguilles seules) → ce que l'option dit de retirer
//                       (product_options.variant_ids, migration 015)
// Pas encore : ensembles.
//
// Square renvoie souvent le même paiement plusieurs fois : si la commande a
// déjà une ligne « vente » dans l'historique, on ne retire rien de nouveau.
import pool from "../db/pool.js";

// Lignes de stock d'un produit compté « en tout » (pas par sorte) : outil, pièce.
async function ownStockRow(productId) {
  const own = await pool.query(`SELECT id FROM stock WHERE product_id = $1 AND variant_id IS NULL`, [productId]);
  return own.rows[0] || null;
}

// Ce que retire une option : sa recette (variant_ids, migration 015), sinon
// « quantity » pièces du stock du produit (aiguilles de douleur : une seule sorte).
async function removalsForOption(option, multiplier, source) {
  const removals = [];
  if (option.variant_ids?.length) {
    for (const variantId of option.variant_ids) {
      const row = await pool.query(`SELECT id FROM stock WHERE variant_id = $1`, [variantId]);
      if (row.rows[0]) removals.push({ stockId: row.rows[0].id, quantity: multiplier, source });
    }
    return removals;
  }
  const own = await ownStockRow(option.product_id);
  const sorts = own
    ? [own]
    : (await pool.query(
        `SELECT s.id FROM stock s JOIN product_variants v ON v.id = s.variant_id
         WHERE s.product_id = $1 AND v.color_id IS NULL`,
        [option.product_id]
      )).rows;
  if (sorts.length === 1) removals.push({ stockId: sorts[0].id, quantity: (option.quantity || 1) * multiplier, source });
  else console.warn(`>>> Option « ${option.label_fr} » : pas de recette et plusieurs sortes, rien retiré.`);
  return removals;
}

// Une pièce d'un kit (ou l'outil choisi) : si le produit a des options
// (aiguilles), le kit contient son option PAR DÉFAUT (la première, migration
// 007 : « 1 droite + 1 courbe ») et on retire sa recette. Sinon, le produit lui-même.
async function removalsForKitPiece(productId, multiplier, source) {
  const defaultOption = await pool.query(
    `SELECT product_id, quantity, variant_ids, label_fr FROM product_options
     WHERE product_id = $1 ORDER BY sort_order, id LIMIT 1`,
    [productId]
  );
  if (defaultOption.rows[0]) return removalsForOption(defaultOption.rows[0], multiplier, source);
  const own = await ownStockRow(productId);
  if (own) return [{ stockId: own.id, quantity: multiplier, source }];
  console.warn(`>>> Pièce ${productId} d'un kit : ni stock propre ni option par défaut, rien retiré.`);
  return [];
}

// Ce que retire une ligne de commande : [{ stockId, quantity, source }]
async function removalsForLineItem(lineItem) {
  const variationId = lineItem.catalog_object_id;
  if (!variationId) return [];
  const count = Number(lineItem.quantity || 1);

  // Kit vendu dans une couleur (variation de couleur du kit).
  const kitResult = await pool.query(
    `SELECT p.id AS kit_id, p.name_fr, v.id AS variant_id, c.name_fr AS color
     FROM product_variants v
     JOIN products p ON p.id = v.product_id AND p.is_kit
     LEFT JOIN colors c ON c.id = v.color_id
     WHERE v.square_variation_id = $1
     UNION ALL
     SELECT p.id, p.name_fr, NULL, NULL
     FROM products p
     WHERE p.square_default_variation_id = $1 AND p.is_kit`,
    [variationId]
  );
  const kit = kitResult.rows[0];
  if (kit) {
    const source = kit.color ? `${kit.name_fr} (${kit.color})` : kit.name_fr;
    const removals = [];

    // 1. L'étui de la couleur vendue.
    const leather = await pool.query(
      kit.variant_id
        ? `SELECT id FROM stock WHERE product_id = $1 AND variant_id = $2`
        : `SELECT id FROM stock WHERE product_id = $1 AND variant_id IS NULL`,
      kit.variant_id ? [kit.kit_id, kit.variant_id] : [kit.kit_id]
    );
    if (leather.rows[0]) removals.push({ stockId: leather.rows[0].id, quantity: count, source });

    // 2. Les pièces fixes (pas les outils au choix).
    const components = await pool.query(
      `SELECT kc.included_product_id, kc.quantity
       FROM kit_components kc JOIN products p ON p.id = kc.included_product_id
       WHERE kc.kit_product_id = $1 AND NOT p.customizable`,
      [kit.kit_id]
    );
    for (const component of components.rows) {
      removals.push(...(await removalsForKitPiece(component.included_product_id, (component.quantity || 1) * count, source)));
    }

    // 3. L'outil choisi par le client (modificateur Square de la ligne).
    for (const modifier of lineItem.modifiers || []) {
      if (!modifier.catalog_object_id) continue;
      const match = await pool.query(
        `SELECT tool_product_id FROM kit_component_modifiers WHERE square_modifier_id = $1`,
        [modifier.catalog_object_id]
      );
      const toolId = match.rows[0]?.tool_product_id;
      if (!toolId) continue;
      removals.push(...(await removalsForKitPiece(toolId, count, source)));
    }
    return removals;
  }

  // Option vendue (aiguilles : « 2 courbes », « 1 droite + 1 courbe », « 1 aiguille »…).
  // L'option dit elle-même quoi retirer (migration 015) : variant_ids liste les
  // sortes, répétées autant de fois qu'il y en a ([Courbe, Courbe]). Liste vide :
  // l'option retire « quantity » pièces du stock du produit.
  const optionResult = await pool.query(
    `SELECT o.product_id, o.quantity, o.variant_ids, o.label_fr, p.name_fr
     FROM product_options o JOIN products p ON p.id = o.product_id
     WHERE o.square_variation_id = $1`,
    [variationId]
  );
  const option = optionResult.rows[0];
  if (option) return removalsForOption(option, count, `${option.name_fr} (${option.label_fr})`);

  // Produit régulier vendu seul (variation par défaut, ni kit ni ensemble).
  const regular = await pool.query(
    `SELECT s.id
     FROM products p
     JOIN stock s ON s.product_id = p.id AND s.variant_id IS NULL
     WHERE p.square_default_variation_id = $1
       AND NOT p.is_kit
       AND NOT EXISTS (SELECT 1 FROM kit_components kc WHERE kc.kit_product_id = p.id)`,
    [variationId]
  );
  if (regular.rows[0]) return [{ stockId: regular.rows[0].id, quantity: count, source: null }];
  return [];
}

export async function deductAtelierStockForSquareOrder(squareOrder, orderNumber = null) {
  if (!squareOrder?.id) return { deducted: 0 };

  // Tout ce que la commande retire, additionné par ligne de stock.
  const byStock = new Map();
  for (const lineItem of squareOrder.line_items || []) {
    for (const { stockId, quantity, source } of await removalsForLineItem(lineItem)) {
      const entry = byStock.get(stockId) || { quantity: 0, sources: new Set() };
      entry.quantity += quantity;
      entry.sources.add(source || "vendu seul");
      byStock.set(stockId, entry);
    }
  }
  if (byStock.size === 0) return { deducted: 0 };

  const ref = `(Square ${squareOrder.id})`;
  const label = orderNumber ? `Commande #${orderNumber} ${ref}` : `Vente ${ref}`;

  const client = await pool.connect();
  let deducted = 0;
  try {
    await client.query("BEGIN");
    // Un seul traitement à la fois par commande (si Square envoie 2 fois en même temps).
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [squareOrder.id]);

    const already = await client.query(
      `SELECT 1 FROM stock_movements WHERE reason = 'vente' AND note LIKE '%' || $1 || '%' LIMIT 1`,
      [ref]
    );
    if (already.rows.length) {
      await client.query("ROLLBACK");
      return { deducted: 0, already: true };
    }

    for (const [stockId, { quantity, sources }] of byStock) {
      const stock = await client.query(`SELECT quantity FROM stock WHERE id = $1 FOR UPDATE`, [stockId]);
      const before = stock.rows[0]?.quantity ?? 0;
      const after = Math.max(before - quantity, 0);
      if (after === before) {
        console.warn(`>>> Vente ${squareOrder.id} : ligne de stock ${stockId} déjà à 0, rien à retirer (vendu ${quantity}).`);
        continue;
      }
      const missing = quantity - (before - after);
      const note = [label, [...sources].join(", "), missing > 0 ? `manquait ${missing}` : null]
        .filter(Boolean)
        .join(" · ");
      await client.query(`UPDATE stock SET quantity = $1, updated_at = now() WHERE id = $2`, [after, stockId]);
      await client.query(
        `INSERT INTO stock_movements (stock_id, change, quantity_after, reason, note)
         VALUES ($1, $2, $3, 'vente', $4)`,
        [stockId, after - before, after, note]
      );
      deducted += 1;
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
  return { deducted };
}
