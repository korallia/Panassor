import {
  getSquareOrder,
  verifySquareWebhookSignature,
} from "../services/square.service.js";
import {
  updateLocalOrderFromSquarePayment,
  updateLocalOrderSquareOrderSnapshot,
} from "../services/orders.service.js";
import { extractSquareShipmentRecipient } from "../services/shipping.service.js";
import { ensureShipmentForOrderId } from "../services/shipments.service.js";
import { deductKitComponentInventory } from "../services/square.inventoryDeduction.service.js";

export async function handleSquareWebhook(req, res) {
  try {
    const rawBody = req.body?.toString("utf8") || "";

    if (!verifySquareWebhookSignature(req, rawBody)) {
      return res.status(401).json({
        message: "Invalid Square webhook signature",
      });
    }

    const event = JSON.parse(rawBody);

    if (event.type !== "payment.updated") {
      return res.json({
        received: true,
        ignored: true,
        eventType: event.type,
      });
    }

    const payment = event?.data?.object?.payment;

    if (!payment?.id || !payment?.order_id) {
      console.warn("Square webhook payment missing id or order_id:", event);

      return res.json({
        received: true,
        ignored: true,
        reason: "Missing payment id or order_id",
      });
    }

    const updatedOrder = await updateLocalOrderFromSquarePayment(payment);

    let snapshotOrder = null;
    let shipment = null;

    try {
      const squareOrder = await getSquareOrder(payment.order_id);
       if (payment.status === "COMPLETED") {
        try {
          await deductKitComponentInventory(squareOrder);
        } catch (inventoryError) {
          // Déjà décompté lors d'un envoi précédent du même paiement : normal.
          if (inventoryError?.errors?.[0]?.code === "IDEMPOTENCY_KEY_REUSED") {
            console.log(`Inventaire déjà décompté pour la commande Square ${squareOrder?.id}.`);
          } else {
            console.warn("Failed to deduct kit component inventory:", inventoryError);
          }
        }
      }

      snapshotOrder = await updateLocalOrderSquareOrderSnapshot(squareOrder);

      const shippingRecipient = extractSquareShipmentRecipient(squareOrder);
      const shipmentOrderId = updatedOrder?.id || snapshotOrder?.id;

      if (shipmentOrderId) {
        shipment = await ensureShipmentForOrderId(
          shipmentOrderId,
          shippingRecipient
        );
      }
    } catch (shippingError) {
      console.warn("Failed to process Square order shipping data:", shippingError);
    }

    res.json({
      received: true,
      paymentId: payment.id,
      squareOrderId: payment.order_id,
      localOrderId: updatedOrder?.id || snapshotOrder?.id || null,
      status: updatedOrder?.status || snapshotOrder?.status || null,
      shipmentId: shipment?.id || null,
    });
  } catch (error) {
    console.error("Square webhook failed:", error);

    res.status(500).json({
      message: "Square webhook failed",
    });
  }
}