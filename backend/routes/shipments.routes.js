import { Router } from "express";
import {
  getShipmentById,
  getShipmentByOrderId,
  getShipmentTrackingEntry,
  patchShipmentItemStatus,
  patchShipmentStatus,
  patchShipmentTracking,
  postShipmentTrackingEntry,
} from "../controllers/shipments.controller.js";

const router = Router();

// Key-gated (admin_access_token in ?key=), safe in production -- see
// shipments.controller.js. Registered before the un-authed /:id routes
// below only for readability; Express matches these on their more
// specific /tracking-entry suffix regardless of order.
router.get("/:id/tracking-entry", getShipmentTrackingEntry);
router.post("/:id/tracking-entry", postShipmentTrackingEntry);

router.get("/order/:orderId", getShipmentByOrderId);
router.get("/:id", getShipmentById);

router.patch("/items/:itemId/status", patchShipmentItemStatus);
router.patch("/:id/status", patchShipmentStatus);
router.patch("/:id/tracking", patchShipmentTracking);

export default router;