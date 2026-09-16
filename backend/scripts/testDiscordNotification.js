// scripts/testDiscordNotification.js
//
// Lighter test than testShipmentDiscordCycle.js: sends ONLY the initial
// "Nouvelle commande payee" Discord message via the REAL code path
// (createPendingLocalOrder -> ensureShipmentForOrderId ->
// notifyNewOrderShipment), using real DB rows -- unlike the previous
// version of this file, which just POSTed a hand-typed fake embed and
// never exercised the actual code (so it could never have shown, say,
// the new "Service" field or a real /expedition link).
//
// Does NOT touch tracking or delivery, and does NOT clean up afterward
// -- the whole point is to leave you a real order + shipment + Discord
// message + /expedition link so YOU can click through the flow by hand
// (fill the tracking form, watch the message edit, etc.) instead of the
// script doing every step for you like testShipmentDiscordCycle.js does.
//
//   node backend/scripts/testDiscordNotification.js [carrierLabel] [serviceLabel] [cents]
//
//   [carrierLabel] defaults to "Postes Canada"
//   [serviceLabel] defaults to "Colis standard"
//   [cents]        defaults to 2314 ($23.14) -- shipping price shown on
//                    the thank-you page, the Discord message, and the
//                    /expedition page's "Service paye" callout
//
// Cleanup: this script prints a ready-to-paste SQL block at the end --
// run it in Neon's SQL Editor once you're done testing.
import "dotenv/config";
import { randomUUID } from "crypto";
import pool from "../db/pool.js";
import { createPendingLocalOrder } from "../services/orders.service.js";
import { ensureShipmentForOrderId } from "../services/shipments.service.js";
import { env } from "../config/env.js";

const [, , carrierLabelArg, serviceLabelArg, centsArg] = process.argv;
const carrierLabel = carrierLabelArg || "Postes Canada";
const serviceLabel = serviceLabelArg || "Colis standard";
const shippingCents = centsArg ? Number(centsArg) : 2314;

async function main() {
  console.log(
    `Creating test order (${carrierLabel} — ${serviceLabel}, ${(shippingCents / 100).toFixed(2)} $)...`
  );

  const { id: orderId } = await createPendingLocalOrder({
    thankYouToken: randomUUID(),
    normalizedItems: [
      { productId: 1, name: "Kit du chirurgien (TEST)", quantity: 1, unitPriceCents: 29500 },
    ],
    subtotalCents: 29500,
    taxCents: 4418,
    totalCents: 29500 + 4418 + shippingCents,
    orderNote: "TEST SCRIPT -- testDiscordNotification.js -- safe to delete",
    carrier: "postes_canada",
    shippingCarrierLabel: carrierLabel,
    shippingServiceCode: "test_service",
    shippingServiceLabel: serviceLabel,
    shippingCents,
  });

  // createPendingLocalOrder always inserts as 'pending' -- ensureShipmentForOrderId
  // requires 'paid', so flip it here to simulate a completed checkout.
  await pool.query(`UPDATE orders SET status = 'paid' WHERE id = $1;`, [orderId]);

  console.log(`Test order #${orderId} created and marked paid. Creating shipment (posts to Discord)...`);

  const shipment = await ensureShipmentForOrderId(orderId, {
    recipientDisplayName: "Client Test",
    recipientEmail: "test@example.com",
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

  const trackingEntryUrl = `${env.siteUrl}/expedition?shipmentId=${shipment.id}&key=${shipment.admin_access_token}`;

  console.log(`\nShipment #${shipment.id} created. Check Discord -- "Nouvelle commande payee" should be posted.`);
  console.log(`\nOuvre cette page pour tester le formulaire de tracking et voir le callout "Service paye" :`);
  console.log(trackingEntryUrl);

  console.log(
    `\nQuand t'as fini de tester, roule ceci dans Neon (SQL Editor) pour nettoyer :\n` +
      `DELETE FROM shipment_events WHERE shipment_id = ${shipment.id};\n` +
      `DELETE FROM shipment_items WHERE shipment_id = ${shipment.id};\n` +
      `DELETE FROM shipments WHERE id = ${shipment.id};\n` +
      `DELETE FROM orders WHERE id = ${orderId};`
  );
}

main()
  .catch((error) => {
    console.error("Test failed:", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
