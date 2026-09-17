// Tests the FULL Discord order-message cycle end to end, against REAL
// Discord/DB infrastructure -- no real customer/order involved.
//
//   node backend/scripts/testShipmentDiscordCycle.js <email> [carrier] [trackingNumber]
//
//   <email>          where the (real) tracking email will be sent -- use
//                     your own address, never a real customer's.
//   [carrier]        "postes_canada" (default) or "purolator"
//   [trackingNumber] defaults to a fake number -- this script does NOT
//                     call the real carrier tracking API, it fakes the
//                     "delivered" detection directly (see step 3 below)
//                     so you don't need a real live tracking number just
//                     to test the Discord/DB plumbing.
//
// What it does, in order -- watch the SAME message in Discord edit 3
// times:
//   1. Creates a real (obviously-fake) test order + shipment, exactly
//      like a real paid order would -- this fires the normal "Nouvelle
//      commande payée" Discord notification.
//   2. Calls the real submitShipmentTracking() (same code path as the
//      /expedition page) -- edits the message to "En chemin" AND sends
//      a real tracking email to <email>.
//   3. Calls markShipmentDelivered() + the Discord "delivered" edit
//      directly -- simulating what the poller does once a carrier
//      reports delivery, without needing a real tracking number.
//
// Cleans up the test order/shipment rows at the end either way.
import "dotenv/config";
import { randomUUID } from "crypto";
import pool from "../db/pool.js";
import { createPendingLocalOrder } from "../services/orders.service.js";
import {
  ensureShipmentForOrderId,
  submitShipmentTracking,
  markShipmentDelivered,
  getOrderForShipment,
  getShipmentItems,
} from "../services/shipments.service.js";
import { editShipmentDiscordStatus } from "../services/discord.service.js";

const [, , email, carrierArg, trackingNumberArg] = process.argv;
const carrier = carrierArg || "postes_canada";
const trackingNumber = trackingNumberArg || `TEST-${Date.now()}`;

if (!email) {
  console.error(
    "Usage: node backend/scripts/testShipmentDiscordCycle.js <email> [postes_canada|purolator] [trackingNumber]"
  );
  process.exit(1);
}

if (!["postes_canada", "purolator"].includes(carrier)) {
  console.error(`Invalid carrier "${carrier}" -- must be postes_canada or purolator.`);
  process.exit(1);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log(`Creating test order (carrier: ${carrier})...`);

  const { id: orderId } = await createPendingLocalOrder({
    thankYouToken: randomUUID(),
    normalizedItems: [
      { productId: 1, name: "Kit du chirurgien (TEST)", quantity: 1, unitPriceCents: 29500 },
    ],
    subtotalCents: 29500,
    taxCents: 0,
    totalCents: 29500,
    orderNote: "TEST SCRIPT -- testShipmentDiscordCycle.js -- safe to delete",
    carrier,
  });

  // createPendingLocalOrder always inserts as 'pending' -- ensureShipmentForOrderId
  // requires 'paid', so we flip it here to simulate a completed checkout.
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

  console.log(`Shipment #${shipment.id} created. Check Discord now -- "Nouvelle commande payée" should be posted.`);
  await wait(3000);

  console.log(`Entering tracking (${carrier} / ${trackingNumber})... this edits the Discord message to "En chemin" and sends a real tracking email to ${email}.`);

  await submitShipmentTracking({
    shipmentId: shipment.id,
    key: shipment.admin_access_token,
    carrier,
    trackingNumber,
    trackingUrl: null,
  });

  console.log('Check Discord now -- the message should say "🚚 En chemin".');
  await wait(3000);

  console.log('Simulating carrier delivery confirmation (no real carrier API call -- this fakes what the poller does once a real one reports "delivered")...');

  const deliveredShipment = await markShipmentDelivered({
    shipmentId: shipment.id,
    deliveredAt: new Date().toISOString(),
  });

  const [order, shipmentItems] = await Promise.all([
    getOrderForShipment(deliveredShipment.order_id),
    getShipmentItems(deliveredShipment.id),
  ]);

  await editShipmentDiscordStatus({
    order,
    shipment: deliveredShipment,
    shipmentItems,
    stage: "delivered",
    trackingUrl: null,
  });

  console.log('Check Discord now -- the message should say "✅ Livré".');
  console.log("Full cycle done.");

  return { orderId, shipmentId: shipment.id };
}

main()
  .catch((error) => {
    console.error("Test cycle failed:", error);
    process.exitCode = 1;
  })
  .then(async (result) => {
    if (!result) return;

    const { orderId, shipmentId } = result;

    try {
      await pool.query(`DELETE FROM shipment_events WHERE shipment_id = $1;`, [shipmentId]);
      await pool.query(`DELETE FROM shipment_items WHERE shipment_id = $1;`, [shipmentId]);
      await pool.query(`DELETE FROM shipments WHERE id = $1;`, [shipmentId]);
      await pool.query(`DELETE FROM orders WHERE id = $1;`, [orderId]);
      console.log(`Cleaned up test order #${orderId} / shipment #${shipmentId}.`);
    } catch (cleanupError) {
      console.warn(
        `Could not fully clean up test data (order #${orderId} / shipment #${shipmentId}) -- delete manually if needed:`,
        cleanupError
      );
    }
  })
  .finally(() => pool.end());
