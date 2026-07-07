import {
  findLocalOrderById,
  getOrderSummaryById,
  syncLocalOrderFromSquareOrder,
} from "../services/orders.service.js";

export async function getOrderSummary(req, res) {
  try {
    const { id } = req.params;

    const orderSummary = await getOrderSummaryById(id);

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

    const localOrder = await findLocalOrderById(id);

    if (!localOrder) {
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
      shippingOrder: syncResult.shippingOrder,
    });
  } catch (error) {
    console.error("Manual Square order sync failed:", error);

    res.status(error.status || 500).json({
      message: error.message || "Manual Square order sync failed",
      errors: error.errors || [],
    });
  }
}