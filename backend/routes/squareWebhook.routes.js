import { Router } from "express";
import { handleSquareWebhook } from "../controllers/squareWebhook.controller.js";

const router = Router();

router.post("/", handleSquareWebhook);

export default router;