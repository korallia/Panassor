import { fetchPublishedAtelierVideos } from "../services/atelier.service.js";

export async function getAtelierVideos(req, res) {
  try {
    const videos = await fetchPublishedAtelierVideos();

    res.json(videos);
  } catch (error) {
    console.error("Failed to fetch atelier videos:", error);

    res.status(500).json({
      message: "Failed to fetch atelier videos",
    });
  }
}