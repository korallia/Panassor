import {
  getShipmentDetailsById,
  getShipmentDetailsByOrderId,
  updateShipmentItemStatus,
  updateShipmentStatus,
  updateShipmentTracking,
} from "../services/shipments.service.js";

export async function getShipmentById(req, res) {
  try {
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