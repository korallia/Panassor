import { Router } from "express";
import {
  getProductBySlug,
  getAllProducts,
  getCustomizableProducts
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);
router.get("/customizable", getCustomizableProducts);

export default router;