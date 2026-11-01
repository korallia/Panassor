// Ventes → stock de l'atelier (produits réguliers seulement).
//
// Quand Square confirme un paiement, chaque outil / pièce vendu seul retire
// sa quantité du stock de l'atelier (table stock) et laisse une ligne dans
// l'historique (stock_movements, raison « vente », personne vide = Square).
//
// « Produit régulier » = un produit vendu sous sa variation Square par défaut :
// ni kit, ni ensemble, ni produit à options/couleurs (ceux-là viendront après).
//
// Square renvoie souvent le même paiement plusieurs fois : la note contient
// l'id de la commande Square, et on ne retire jamais deux fois pour la même
// commande et la même ligne de stock.
import pool from "../db/pool.js";

export async function deductAtelierStockForSquareOrder(squareOrder, orderNumber = null) {
  if (!squareOrder?.id) return { deducted: 0 };

  // Quantité vendue par produit régulier (plusieurs lignes du même produit s'additionnent).
  const sold = new Map();
  for (const lineItem of squareOrder.line_items || []) {
    const variationId = lineItem.catalog_object_id;
    if (!variationId) continue;
    const result = await pool.query(
      `SELECT s.id AS stock_id, p.name_fr
       FROM products p
       JOIN stock s ON s.product_id = p.id AND s.variant_id IS NULL
       WHERE p.square_default_variation_id = $1
         AND NOT p.is_kit
         AND NOT EXISTS (SELECT 1 FROM kit_components kc WHERE kc.kit_product_id = p.id)`,
      [variationId]
    );
    const row = result.rows[0];
    if (!row) continue;
    const quantity = Number(lineItem.quantity || 1);
    const current = sold.get(row.stock_id) || { name: row.name_fr, quantity: 0 };
    current.quantity += quantity;
    sold.set(row.stock_id, current);
  }
  if (sold.size === 0) return { deducted: 0 };

  const ref = `(Square ${squareOrder.id})`;
  const label = orderNumber ? `Commande #${orderNumber} ${ref}` : `Vente ${ref}`;

  const client = await pool.connect();
  let deducted = 0;
  try {
    await client.query("BEGIN");
    // Un seul traitement à la fois par commande (si Square envoie 2 fois en même temps).
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [squareOrder.id]);

    for (const [stockId, { name, quantity }] of sold) {
      const already = await client.query(
        `SELECT 1 FROM stock_movements
         WHERE stock_id = $1 AND reason = 'vente' AND note LIKE '%' || $2 || '%'`,
        [stockId, ref]
      );
      if (already.rows.length) continue;

      const stock = await client.query(`SELECT quantity FROM stock WHERE id = $1 FOR UPDATE`, [stockId]);
      const before = stock.rows[0]?.quantity ?? 0;
      const after = Math.max(before - quantity, 0);
      if (after === before) {
        console.warn(`>>> Vente ${squareOrder.id} : ${name} déjà à 0, rien à retirer (vendu ${quantity}).`);
        continue;
      }
      const missing = quantity - (before - after);
      await client.query(`UPDATE stock SET quantity = $1, updated_at = now() WHERE id = $2`, [after, stockId]);
      await client.query(
        `INSERT INTO stock_movements (stock_id, change, quantity_after, reason, note)
         VALUES ($1, $2, $3, 'vente', $4)`,
        [stockId, after - before, after, missing > 0 ? `${label} — manquait ${missing}` : label]
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
