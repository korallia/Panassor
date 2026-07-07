import { Router } from "express";
import {
  getPublishedCollections,
  getComingSoonCollections,
  getCollectionBySlug,
} from "../controllers/collections.controller.js";

const router = Router();

router.get("/", getPublishedCollections);
router.get("/coming-soon", getComingSoonCollections);
router.get("/:slug", getCollectionBySlug);

export default router;