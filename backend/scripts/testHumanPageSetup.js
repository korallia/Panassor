// Creates a real (obviously-fake) test order + shipment, exactly like
// testShipmentDiscordCycle.js's step 1, then STOPS and prints the real
// /expedition URL -- so YOU can open the actual page and submit the
// tracking form for real, testing the real HTTP/page path a human takes
// instead of calling submitShipmentTracking() directly in code.
//
//   node backend/scripts/testHumanPageSetup.js <email>
//
// Does NOT clean up -- run testHumanPageCleanup.js <shipmentId> <orderId>
// afterwards (the setup script prints the exact command to run).
import "dotenv/config";
import { randomUUID } from "crypto";
import pool from "../db/pool.js";
import { createPendingLocalOrder } from "../services/orders.service.js";
import { ensureShipmentForOrderId } from "../services/shipments.service.js";
import { env } from "../config/env.js";

const [, , email] = process.argv;

if (!email) {
  console.error("Usage: node backend/scripts/testHumanPageSetup.js <email>");
  process.exit(1);
}

async function main() {
  console.log("Creating test order...");

  const { id: orderId } = await createPendingLocalOrder({
    thankYouToken: randomUUID(),
    normalizedItems: [
      { productId: 1, name: "Kit du chirurgien (TEST)", quantity: 1, unitPriceCents: 29500 },
    ],
    subtotalCents: 29500,
    taxCents: 0,
    totalCents: 29500,
    orderNote: "TEST SCRIPT -- testHumanPageSetup.js -- safe to delete",
    carrier: "postes_canada",
  });

  await pool.query(`UPDATE orders SET status = 'paid' WHERE id = $1;`, [orderId]);

  console.log(`Test order #${orderId} created and marked paid. Creating shipment (posts to Discord)...`);

  const shipment = await ensureShipmentForOrderId(orderId, {
    recipientDisplayName: "Client Test",
    recipientEmail: email,
    recipientPhone: null,
    address: {
      line1: "123 Rue de Test",
      line2: "",
      locality: "Gatineau",
      province: "QC",
      postalCode: "J9A 3A1",
      country: "CA",
    },
  });

  if (!shipment) {
    throw new Error("ensureShipmentForOrderId returned null -- check the logs above.");
  }

  const url = `${env.siteUrl}/expedition?shipmentId=${shipment.id}&key=${shipment.admin_access_token}`;

  console.log(`\nOrder #${orderId} / Shipment #${shipment.id} ready.`);
  console.log(`URL: ${url}`);
  console.log(`\nOuvre ce lien, remplis le formulaire (transporteur + numero de tracking), soumets -- puis roule:`);
  console.log(`  node backend/scripts/testHumanPageCleanup.js ${shipment.id} ${orderId}`);
}

main()
  .catch((error) => {
    console.error("Setup failed:", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
