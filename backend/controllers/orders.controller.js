import { env } from "../config/env.js";
import {
  fakeSquarePaidShippingForLocalOrder,
  findLocalOrderById,
  getOrderSummaryById,
  syncLocalOrderFromSquareOrder,
} from "../services/orders.service.js";

function isProduction() {
  return env.nodeEnv === "production";
}

function hasValidThankYouKey(localOrder, key) {
  return Boolean(
    key &&
      localOrder?.thank_you_token &&
      String(localOrder.thank_you_token) === String(key)
  );
}

export async function getOrderSummary(req, res) {
  try {
    const { id } = req.params;
    const { key } = req.query;

    if (isProduction() && !key) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const orderSummary = await getOrderSummaryById(id, key);

    if (!orderSummary) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(orderSummary);
  } catch (error) {
    console.error("Failed to fetch order summary:", error);

    res.status(error.status || 500).json({
      message: error.message || "Failed to fetch order summary",
      errors: error.errors || [],
    });
  }
}

export async function syncSquareOrder(req, res) {
  try {
    const { id } = req.params;
    const { key } = req.query;

    const localOrder = await findLocalOrderById(id);

    if (!localOrder) {
      return res.status(404).json({
        message: "Local order not found",
      });
    }

    if (isProduction() && !hasValidThankYouKey(localOrder, key)) {
      return res.status(404).json({
        message: "Local order not found",
      });
    }

    if (!localOrder.square_order_id) {
      return res.status(400).json({
        message: "Local order has no Square order ID",
      });
    }

    const syncResult = await syncLocalOrderFromSquareOrder(
      localOrder.square_order_id
    );

    res.json({
      localOrderId: localOrder.id,
      squareOrderId: localOrder.square_order_id,
      synced: syncResult.synced,
      reason: syncResult.reason,
      paymentStatus: syncResult.payment?.status || null,
      paymentId: syncResult.payment?.id || null,
      updatedOrder: syncResult.localOrder,
      shipment: syncResult.shipment,
    });
  } catch (error) {
    console.error("Manual Square order sync failed:", error);

    res.status(error.status || 500).json({
      message: error.message || "Manual Square order sync failed",
      errors: error.errors || [],
    });
  }
}

export async function fakeSquarePaidShipping(req, res) {
  try {
    if (isProduction()) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    const { id } = req.params;

    const result = await fakeSquarePaidShippingForLocalOrder(id);

    if (!result) {
      return res.status(404).json({
        message: "Local order not found",
      });
    }

    res.json({
      ok: true,
      localOrderId: result.localOrderId,
      squareOrderId: result.squareOrderId,
      paymentStatus: result.fakePayment.status,
      shippingRecipient: result.shippingRecipient,
      shipment: result.shipment,
    });
  } catch (error) {
    console.error("Fake Square paid shipping test failed:", error);

    res.status(error.status || 500).json({
      message: error.message || "Fake Square paid shipping test failed",
      errors: error.errors || [],
    });
  }
}