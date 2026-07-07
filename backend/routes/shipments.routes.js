import { Router } from "express";
import {
  getShipmentById,
  getShipmentByOrderId,
  patchShipmentItemStatus,
  patchShipmentStatus,
  patchShipmentTracking,
} from "../controllers/shipments.controller.js";

const router = Router();

router.get("/order/:orderId", getShipmentByOrderId);
router.get("/:id", getShipmentById);

router.patch("/items/:itemId/status", patchShipmentItemStatus);
router.patch("/:id/status", patchShipmentStatus);
router.patch("/:id/tracking", patchShipmentTracking);

export default router;