import { Router } from "express";
import { syncSquareOrder } from "../controllers/orders.controller.js";

const router = Router();

router.post("/:id/sync-square", syncSquareOrder);

export default router;