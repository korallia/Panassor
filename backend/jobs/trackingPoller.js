import { getCanadaPostTrackingStatus } from "../services/canadaPost.service.js";
import { getPurolatorTrackingStatus } from "../services/purolator.service.js";
import {
  getShipmentsAwaitingDelivery,
  touchShipmentTrackingCheckedAt,
  markShipmentDelivered,
  getOrderForShipment,
  getShipmentItems,
} from "../services/shipments.service.js";
import { editShipmentDiscordStatus } from "../services/discord.service.js";

// =========================================
// CARRIER TRACKING POLLER
//
// Periodically checks every "shipped" shipment against its carrier's
// tracking API. The moment a carrier reports a delivery, the shipment
// flips to "delivered" and the Discord order message is edited to match
// (see discord.service.js's editShipmentDiscordStatus).
//
// Intentionally simple: no webhooks from the carriers, no queue, just a
// poll loop -- matches the rest of this shipping integration (manual
// label creation, manual tracking entry, one message per order).
// =========================================

// Parcels take days to deliver, not minutes -- no need to hammer the
// carrier APIs. Easy to tune later if it turns out too slow/fast.
const POLL_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours

async function checkOneShipment(shipment) {
  let trackingStatus;

  try {
    if (shipment.carrier === "postes_canada") {
      trackingStatus = await getCanadaPostTrackingStatus(
        shipment.tracking_number
      );
    } else if (shipment.carrier === "purolator") {
      trackingStatus = await getPurolatorTrackingStatus(
        shipment.tracking_number
      );
    } else {
      console.warn(
        `Tracking poller: unknown carrier "${shipment.carrier}" for shipment #${shipment.id}, skipping.`
      );
      return;
    }
  } catch (error) {
    // A single carrier hiccup (rate limit, bad PIN, API down) must never
    // stop the rest of the batch from being checked.
    console.error(
      `Tracking poller: checking shipment #${shipment.id} (${shipment.carrier}) failed:`,
      error
    );
    return;
  }

  if (!trackingStatus.delivered) {
    await touchShipmentTrackingCheckedAt(shipment.id);
    return;
  }

  const updatedShipment = await markShipmentDelivered({
    shipmentId: shipment.id,
    deliveredAt: trackingStatus.deliveredAt,
  });

  if (!updatedShipment) {
    return;
  }

  const [order, shipmentItems] = await Promise.all([
    getOrderForShipment(updatedShipment.order_id),
    getShipmentItems(updatedShipment.id),
  ]);

  // Never throws (see discord.service.js) -- a Discord hiccup here must
  // never undo the delivered status we just saved.
  await editShipmentDiscordStatus({
    order,
    shipment: updatedShipment,
    shipmentItems,
    stage: "delivered",
    trackingUrl: shipment.tracking_url,
  });

  console.log(
    `Tracking poller: shipment #${shipment.id} marked delivered (${shipment.carrier}).`
  );
}

async function pollAllShipments() {
  let shipments;

  try {
    shipments = await getShipmentsAwaitingDelivery();
  } catch (error) {
    console.error(
      "Tracking poller: failed to load shipments awaiting delivery:",
      error
    );
    return;
  }

  // Sequential on purpose -- this runs unattended every few hours, no
  // rush, and it keeps us well under any per-second rate limit on the
  // carrier APIs instead of firing a burst of parallel requests.
  for (const shipment of shipments) {
    await checkOneShipment(shipment);
  }
}

let pollerHandle = null;

export function startTrackingPoller() {
  if (pollerHandle) {
    return;
  }

  const runOnce = () => {
    pollAllShipments().catch((error) => {
      console.error("Tracking poller run failed:", error);
    });
  };

  runOnce();
  pollerHandle = setInterval(runOnce, POLL_INTERVAL_MS);
}

export function stopTrackingPoller() {
  if (pollerHandle) {
    clearInterval(pollerHandle);
    pollerHandle = null;
  }
}
