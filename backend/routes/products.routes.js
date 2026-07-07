import { Router } from "express";
import {
  getProductBySlug,
  getAllProducts,
  getCustomizableProducts
} from "../controllers/products.controller.js";

const router = Router();

router.get("/customizable", getCustomizableProducts);
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);


export default router;