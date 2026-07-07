import {
  getSquareOrder,
  verifySquareWebhookSignature,
} from "../services/square.service.js";
import { updateLocalOrderFromSquarePayment } from "../services/orders.service.js";
import { updateLocalOrderShippingFromSquareOrder } from "../services/shipping.service.js";

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

    let shippingOrder = null;

    try {
      const squareOrder = await getSquareOrder(payment.order_id);

      shippingOrder = await updateLocalOrderShippingFromSquareOrder(
        squareOrder,
        payment
      );
    } catch (shippingError) {
      console.warn("Failed to update shipping from Square webhook:", shippingError);
    }

    res.json({
      received: true,
      paymentId: payment.id,
      squareOrderId: payment.order_id,
      localOrderId: updatedOrder?.id || shippingOrder?.id || null,
      status: updatedOrder?.status || null,
      shippingUpdated: Boolean(shippingOrder),
    });
  } catch (error) {
    console.error("Square webhook failed:", error);

    res.status(500).json({
      message: "Square webhook failed",
    });
  }
}