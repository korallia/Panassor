import { env } from "../config/env.js";
import {
  getShipmentDetailsById,
  getShipmentDetailsByOrderId,
  getShipmentForTrackingEntry,
  submitShipmentTracking,
  updateShipmentItemStatus,
  updateShipmentStatus,
  updateShipmentTracking,
} from "../services/shipments.service.js";
import { buildItemSummaries } from "../services/discord.service.js";

function blockShipmentRoutesInProduction(res) {
  if (env.nodeEnv !== "production") {
    return false;
  }

  res.status(404).json({
    message: "Not found",
  });

  return true;
}

export async function getShipmentById(req, res) {
  try {
    if (blockShipmentRoutesInProduction(res)) {
      return;
    }

    const { id } = req.params;

    const shipment = await getShipmentDetailsById(id);

    if (!shipment) {
      return res.status(404).json({
        message: "Shipment not found",
      });
    }

    res.json(shipment);
  } catch (error) {
    console.error("Failed to fetch shipment:", error);

    res.status(error.status || 500).json({
      message: error.message || "Failed to fetch shipment",
      errors: error.errors || [],
    });
  }
}

export async function getShipmentByOrderId(req, res) {
  try {
    if (blockShipmentRoutesInProduction(res)) {
      return;
    }

    const { orderId } = req.params;

    const shipment = await getShipmentDetailsByOrderId(orderId);

    if (!shipment) {
      return res.status(404).json({
        message: "Shipment not found for order",
      });
    }

    res.json(shipment);
  } catch (error) {
    console.error("Failed to fetch shipment by order:", error);

    res.status(error.status || 500).json({
      message: error.message || "Failed to fetch shipment by order",
      errors: error.errors || [],
    });
  }
}

export async function patchShipmentStatus(req, res) {
  try {
    if (blockShipmentRoutesInProduction(res)) {
      return;
    }

    const { id } = req.params;
    const { status, source, actorName, actorExternalId, message } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Missing shipment status",
      });
    }

    const updatedShipment = await updateShipmentStatus({
      shipmentId: id,
      status,
      source,
      actorName,
      actorExternalId,
      message,
    });

    if (!updatedShipment) {
      return res.status(404).json({
        message: "Shipment not found",
      });
    }

    res.json(updatedShipment);
  } catch (error) {
    console.error("Failed to update shipment status:", error);

    res.status(error.status || 500).json({
      message: error.message || "Failed to update shipment status",
      errors: error.errors || [],
    });
  }
}

export async function patchShipmentItemStatus(req, res) {
  try {
    if (blockShipmentRoutesInProduction(res)) {
      return;
    }

    const { itemId } = req.params;
    const { status, source, actorName, actorExternalId, message } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Missing shipment item status",
      });
    }

    const updatedItem = await updateShipmentItemStatus({
      shipmentItemId: itemId,
      status,
      source,
      actorName,
      actorExternalId,
      message,
    });

    if (!updatedItem) {
      return res.status(404).json({
        message: "Shipment item not found",
      });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error("Failed to update shipment item status:", error);

    res.status(error.status || 500).json({
      message: error.message || "Failed to update shipment item status",
      errors: error.errors || [],
    });
  }
}

export async function patchShipmentTracking(req, res) {
  try {
    if (blockShipmentRoutesInProduction(res)) {
      return;
    }

    const { id } = req.params;
    const {
      carrier,
      trackingNumber,
      trackingUrl,
      source,
      actorName,
      actorExternalId,
    } = req.body;

    const updatedShipment = await updateShipmentTracking({
      shipmentId: id,
      carrier,
      trackingNumber,
      trackingUrl,
      source,
      actorName,
      actorExternalId,
    });

    if (!updatedShipment) {
      return res.status(404).json({
        message: "Shipment not found",
      });
    }

    res.json(updatedShipment);
  } catch (error) {
    console.error("Failed to update shipment tracking:", error);

    res.status(error.status || 500).json({
      message: error.message || "Failed to update shipment tracking",
      errors: error.errors || [],
    });
  }
}
function isProduction() {
  return env.nodeEnv === "production";
}

// Both routes below are intentionally NOT behind
// blockShipmentRoutesInProduction -- they're gated by the per-shipment
// admin_access_token instead (same pattern as orders' thank_you_token),
// so they're safe to expose in production, unlike the raw /:id admin
// endpoints above which have no auth at all yet.
export async function getShipmentTrackingEntry(req, res) {
  try {
    const { id } = req.params;
    const { key } = req.query;

    if (isProduction() && !key) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const result = await getShipmentForTrackingEntry({ shipmentId: id, key });

    if (!result) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const { shipment, shipmentItems, order } = result;

    res.json({
      orderId: shipment.order_id,
      recipientDisplayName: shipment.recipient_display_name,
      status: shipment.status,
      carrier: shipment.carrier,
      trackingNumber: shipment.tracking_number,
      trackingUrl: shipment.tracking_url,
      trackingEmailSentAt: shipment.tracking_email_sent_at,
      items: buildItemSummaries(shipmentItems),

      // What the shopper actually paid for -- shows up as a callout on
      // the page so Korallia knows which service to buy, independent of
      // whatever the carrier dropdown below currently says.
      paidShipping: {
        carrierLabel: order?.shipping_carrier_label || null,
        serviceLabel: order?.shipping_service_label || null,
        cents:
          typeof order?.shipping_cents === "number"
            ? order.shipping_cents
            : null,
      },
    });
  } catch (error) {
    console.error("Failed to fetch shipment tracking-entry info:", error);

    res.status(error.status || 500).json({
      message: error.message || "Failed to fetch shipment",
    });
  }
}

export async function postShipmentTrackingEntry(req, res) {
  try {
    const { id } = req.params;
    const { key } = req.query;
    const { carrier, trackingNumber, trackingUrl } = req.body;

    if (isProduction() && !key) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const updatedShipment = await submitShipmentTracking({
      shipmentId: id,
      key,
      carrier,
      trackingNumber,
      trackingUrl,
    });

    res.json({
      status: updatedShipment.status,
      carrier: updatedShipment.carrier,
      trackingNumber: updatedShipment.tracking_number,
      trackingUrl: updatedShipment.tracking_url,
      trackingEmailSentAt: updatedShipment.tracking_email_sent_at,
    });
  } catch (error) {
    console.error("Failed to save shipment tracking:", error);

    res.status(error.status || 500).json({
      message: error.message || "Failed to save shipment tracking",
    });
  }
}
