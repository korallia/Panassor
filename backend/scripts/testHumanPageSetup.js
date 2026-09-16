// Creates a real (obviously-fake) test order + shipment, exactly like
// testShipmentDiscordCycle.js's step 1, then STOPS and prints the real
// /expedition URL -- so YOU can open the actual page and submit the
// tracking form for real, testing the real HTTP/page path a human takes
// instead of calling submitShipmentTracking() directly in code.
//
//   node backend/scripts/testHumanPageSetup.js <email> [carrierLabel] [serviceLabel] [cents]
//
//   [carrierLabel] defaults to "Postes Canada"
//   [serviceLabel] defaults to "Colis standard"
//   [cents]        defaults to 2314 ($23.14) -- lets you see the "Service
//                    paye par le client" callout on the /expedition page
//                    and the "Service" field on the Discord message,
//                    since both now read orders.shipping_*_label /
//                    shipping_cents (Korallia added these 2026-09-16).
//
// Does NOT clean up -- run testHumanPageCleanup.js <shipmentId> <orderId>
// afterwards (the setup script prints the exact command to run).
import "dotenv/config";
import { randomUUID } from "crypto";
import pool from "../db/pool.js";
import { createPendingLocalOrder } from "../services/orders.service.js";
import { ensureShipmentForOrderId } from "../services/shipments.service.js";
import { env } from "../config/env.js";

const [, , email, carrierLabelArg, serviceLabelArg, centsArg] = process.argv;
const carrierLabel = carrierLabelArg || "Postes Canada";
const serviceLabel = serviceLabelArg || "Colis standard";
const shippingCents = centsArg ? Number(centsArg) : 2314;

if (!email) {
  console.error(
    "Usage: node backend/scripts/testHumanPageSetup.js <email> [carrierLabel] [serviceLabel] [cents]"
  );
  process.exit(1);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    totalCents: 29500 + shippingCents,
    orderNote: "TEST SCRIPT -- testHumanPageSetup.js -- safe to delete",
    carrier: "postes_canada",
    shippingCarrierLabel: carrierLabel,
    shippingServiceCode: "test_service",
    shippingServiceLabel: serviceLabel,
    shippingCents,
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

  // ensureShipmentForOrderId fires the Discord "Nouvelle commande" webhook
  // (and saves its discord_message_id) without awaiting it -- fine in the
  // real server (the DB pool never closes), but this short-lived script's
  // pool.end() would otherwise race it and throw "Cannot use a pool after
  // calling end on the pool". Give it a moment to finish first.
  await wait(3000);

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
