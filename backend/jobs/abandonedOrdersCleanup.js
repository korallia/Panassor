import pool from "../db/pool.js";
import { squareFetch } from "../services/square.service.js";

// =========================================
// NETTOYAGE DES COMMANDES ABANDONNEES
//
// Chaque clic sur « Passer à la caisse » crée une commande « pending » et
// un lien de paiement Square -- tests compris. Si personne ne paie dans
// les 24 h, on désactive le lien Square (il ne peut plus être payé plus
// tard) puis on efface la commande locale. Les commandes payées, ou qui
// ont un envoi, ne sont jamais touchées.
// =========================================

const MAX_AGE_HOURS = 24;
const INTERVAL_MS = 6 * 60 * 60 * 1000; // toutes les 6 h

export async function cleanupAbandonedOrders() {
  const { rows } = await pool.query(
    `
    SELECT id, square_payment_link_id
    FROM orders o
    WHERE o.status IN ('pending', 'failed')
      AND o.order_number IS NULL
      AND o.created_at < now() - ($1 || ' hours')::interval
      AND NOT EXISTS (SELECT 1 FROM shipments s WHERE s.order_id = o.id)
    ORDER BY o.id;
    `,
    [String(MAX_AGE_HOURS)]
  );

  let removed = 0;

  for (const order of rows) {
    try {
      if (order.square_payment_link_id) {
        await squareFetch(
          `/v2/online-checkout/payment-links/${order.square_payment_link_id}`,
          { method: "DELETE" }
        ).catch((error) => {
          // Déjà supprimé ou expiré côté Square : rien à faire.
          if (error.status !== 404) throw error;
        });
      }

      await pool.query(
        `DELETE FROM orders WHERE id = $1 AND status IN ('pending', 'failed') AND order_number IS NULL`,
        [order.id]
      );
      removed += 1;
    } catch (error) {
      console.error(`Nettoyage : commande #${order.id} gardée (${error.message})`);
    }
  }

  if (removed > 0) {
    console.log(`Nettoyage : ${removed} commande(s) abandonnée(s) effacée(s).`);
  }

  return removed;
}

export function startAbandonedOrdersCleanup() {
  const run = () =>
    cleanupAbandonedOrders().catch((error) =>
      console.error("Nettoyage des commandes abandonnées impossible :", error.message)
    );

  run();
  setInterval(run, INTERVAL_MS);
}
