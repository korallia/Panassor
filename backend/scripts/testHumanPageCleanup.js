// Reads back the shipment row (to prove the /expedition page's real HTTP
// submission actually saved carrier/tracking_number/status/discord edit),
// prints it, then deletes the test order/shipment rows.
//
//   node backend/scripts/testHumanPageCleanup.js <shipmentId> <orderId>
import "dotenv/config";
import pool from "../db/pool.js";

const [, , shipmentIdArg, orderIdArg] = process.argv;
const shipmentId = Number(shipmentIdArg);
const orderId = Number(orderIdArg);

if (!shipmentId || !orderId) {
  console.error("Usage: node backend/scripts/testHumanPageCleanup.js <shipmentId> <orderId>");
  process.exit(1);
}

async function main() {
  const { rows } = await pool.query(
    `SELECT id, order_id, status, carrier, tracking_number, tracking_url, discord_message_id, updated_at
     FROM shipments WHERE id = $1;`,
    [shipmentId]
  );

  console.log("Ligne shipment apres soumission de la page :");
  console.log(rows[0] || "(pas trouvee)");

  await pool.query(`DELETE FROM shipment_events WHERE shipment_id = $1;`, [shipmentId]);
  await pool.query(`DELETE FROM shipment_items WHERE shipment_id = $1;`, [shipmentId]);
  await pool.query(`DELETE FROM shipments WHERE id = $1;`, [shipmentId]);
  await pool.query(`DELETE FROM orders WHERE id = $1;`, [orderId]);

  console.log(`\nCommande de test #${orderId} / shipment #${shipmentId} nettoyes.`);
}

main()
  .catch((error) => {
    console.error("Cleanup failed:", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
