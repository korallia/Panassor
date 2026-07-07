import { Router } from "express";
import {
  getOrderSummary,
  syncSquareOrder,
} from "../controllers/orders.controller.js";

const router = Router();

router.get("/:id/summary", getOrderSummary);
router.post("/:id/sync-square", syncSquareOrder);

export default router;