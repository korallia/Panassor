// =========================================
// ENVOIS -- SUIVI (ce qui se passe après, hors du site)
//
//  - la page d'expédition : saisie du transporteur et du numéro de suivi,
//    courriel au client, message Discord « En chemin » ;
//  - la livraison détectée par le vérificateur automatique
//    (jobs/trackingPoller.js) : statut « livré » + message Discord.
// =========================================

import { buildTrackingUrl, sendTrackingEmail } from "../trackingEmail.service.js";
import { updateOrderMessage } from "../discord/discordManager.js";
import {
  findShipmentById,
  getOrderForShipment,
  getShipmentItems,
  markShipmentDelivered,
  markTrackingEmailSent,
  updateShipmentStatus,
  updateShipmentTracking,
} from "./shipments.repository.js";

const TRACKING_ENTRY_CARRIERS = new Set(["postes_canada", "purolator"]);

function trackingEntryError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Powers the tracking-entry page (see shipments.controller.js's
// getShipmentTrackingEntry/postShipmentTrackingEntry) -- the key is
// shipments.admin_access_token, a per-shipment secret link (same idea as
// orders.thank_you_token), not a real login.
export async function getShipmentForTrackingEntry({ shipmentId, key }) {
  const shipment = await findShipmentById(shipmentId);

  if (!shipment || !key || shipment.admin_access_token !== key) {
    return null;
  }

  const shipmentItems = await getShipmentItems(shipment.id);

  // The shipping option the shopper actually picked and paid for at
  // checkout -- shown on the tracking-entry page so Korallia knows which
  // service to buy at the counter, since shipment.carrier (the dropdown
  // she fills in below) is entered manually and defaults to "postes_canada"
  // regardless of what was paid for.
  const order = await getOrderForShipment(shipment.order_id);

  return { shipment, shipmentItems, order };
}

// Saves the carrier/tracking number Korallia enters on that page, marks
// the shipment "shipped", and sends the customer their tracking email --
// all in one step since there's no separate "confirm" action in the UI.
// Re-submitting (e.g. to fix a typo) just re-sends the email with the
// corrected info rather than tracking a stricter "already sent" guard --
// simplest option, and a rare enough case that a duplicate corrected
// email is a fine trade-off.
export async function submitShipmentTracking({
  shipmentId,
  key,
  carrier,
  trackingNumber,
  trackingUrl,
}) {
  const shipment = await findShipmentById(shipmentId);

  if (!shipment || !key || shipment.admin_access_token !== key) {
    throw trackingEntryError(404, "SHIPMENT_NOT_FOUND");
  }

  const normalizedCarrier = String(carrier || "").trim();
  const normalizedTrackingNumber = String(trackingNumber || "").trim();

  if (!TRACKING_ENTRY_CARRIERS.has(normalizedCarrier)) {
    throw trackingEntryError(400, "INVALID_CARRIER");
  }

  if (!normalizedTrackingNumber) {
    throw trackingEntryError(400, "MISSING_TRACKING_NUMBER");
  }

  const resolvedTrackingUrl =
    String(trackingUrl || "").trim() ||
    buildTrackingUrl(normalizedCarrier, normalizedTrackingNumber);

  const updatedShipment = await updateShipmentTracking({
    shipmentId,
    carrier: normalizedCarrier,
    trackingNumber: normalizedTrackingNumber,
    trackingUrl: resolvedTrackingUrl,
    source: "admin-tracking-form",
  });

  await updateShipmentStatus({
    shipmentId,
    status: "shipped",
    source: "admin-tracking-form",
    message: `Tracking entered via the admin form (${normalizedCarrier} ${normalizedTrackingNumber}).`,
  });

  const order = await getOrderForShipment(updatedShipment.order_id);
  const shipmentItems = await getShipmentItems(shipmentId);

  try {
    await sendTrackingEmail({
      recipientEmail: updatedShipment.recipient_email,
      recipientName: updatedShipment.recipient_display_name,
      orderId: order?.order_number ?? order?.id ?? updatedShipment.order_id,
      shipmentItems,
      carrier: normalizedCarrier,
      trackingNumber: normalizedTrackingNumber,
      trackingUrl: resolvedTrackingUrl,
    });

    await markTrackingEmailSent(shipmentId);
  } catch (error) {
    // The tracking is saved either way -- don't lose that just because
    // the email send hiccuped. Surface it so the admin page can tell
    // Korallia to retry the send instead of assuming it went out.
    console.error(
      `Tracking email failed to send for shipment #${shipmentId}:`,
      error
    );
    throw trackingEntryError(502, "TRACKING_SAVED_EMAIL_FAILED");
  }

  // Move the Discord order message from "reçue" to "en chemin" now that
  // a real tracking number exists. Never throws (see discord/discordManager.js)
  // -- a Discord hiccup here must never undo the tracking/email work
  // above, which already succeeded.
  await updateOrderMessage({
    order,
    shipment: updatedShipment,
    shipmentItems,
    stage: "in_transit",
    trackingUrl: resolvedTrackingUrl,
  });

  return {
    ...updatedShipment,
    status: "shipped",
    tracking_email_sent_at: new Date().toISOString(),
  };
}

// Livraison détectée par le transporteur : statut « livré », puis le
// message Discord de la commande passe à « Livré ». Un souci Discord ne
// défait jamais le statut enregistré.
export async function recordShipmentDelivered({ shipment, deliveredAt }) {
  const updatedShipment = await markShipmentDelivered({
    shipmentId: shipment.id,
    deliveredAt,
  });

  if (!updatedShipment) {
    return null;
  }

  const [order, shipmentItems] = await Promise.all([
    getOrderForShipment(updatedShipment.order_id),
    getShipmentItems(updatedShipment.id),
  ]);

  await updateOrderMessage({
    order,
    shipment: updatedShipment,
    shipmentItems,
    stage: "delivered",
    trackingUrl: shipment.tracking_url,
  });

  return updatedShipment;
}
