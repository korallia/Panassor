import { Router } from "express";
import { getAtelierVideos } from "../controllers/atelier.controller.js";

const router = Router();

router.get("/videos", getAtelierVideos);

export default router;