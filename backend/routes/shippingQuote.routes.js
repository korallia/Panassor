import { Router } from "express";
import { postShippingQuote } from "../controllers/shippingQuote.controller.js";
import { rateLimit } from "../middlewares/rateLimit.middleware.js";

const router = Router();

// Route publique (les clients calculent la livraison sans compte), mais
// chaque appel interroge un transporteur. Le panier fait 1 appel par
// transporteur (2 par calcul) : 40 appels par 10 min = 20 calculs par
// visiteur, largement assez pour un vrai client.
router.post(
  "/quote",
  rateLimit({ max: 40, windowMs: 10 * 60 * 1000, name: "shipping-quote" }),
  postShippingQuote
);

export default router;
