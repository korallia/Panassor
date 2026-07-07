import { Router } from "express";
import {
  fakeSquarePaidShipping,
  getOrderSummary,
  syncSquareOrder,
} from "../controllers/orders.controller.js";

const router = Router();

router.get("/:id/summary", getOrderSummary);
router.post("/:id/sync-square", syncSquareOrder);
router.post("/:id/fake-square-paid-shipping", fakeSquarePaidShipping);

export default router;