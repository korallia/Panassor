import { Router } from "express";
import { postShippingQuote } from "../controllers/shippingQuote.controller.js";

const router = Router();

router.post("/quote", postShippingQuote);

export default router;
