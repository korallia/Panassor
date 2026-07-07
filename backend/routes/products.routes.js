import { Router } from "express";
import {
  getProductBySlug,
  getAllProducts,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

export default router;