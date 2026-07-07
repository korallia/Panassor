import {
  fetchPublishedCollections,
  fetchComingSoonCollections,
  fetchCollectionWithProductsBySlug,
} from "../services/collections.service.js";

export async function getPublishedCollections(req, res) {
  try {
    const collections = await fetchPublishedCollections();

    res.json(collections);
  } catch (error) {
    console.error("Failed to fetch collections:", error);

    res.status(500).json({
      message: "Failed to fetch collections",
    });
  }
}

export async function getComingSoonCollections(req, res) {
  try {
    const collections = await fetchComingSoonCollections();

    res.json(collections);
  } catch (error) {
    console.error("Failed to fetch coming soon collections:", error);

    res.status(500).json({
      message: "Failed to fetch coming soon collections",
    });
  }
}

export async function getCollectionBySlug(req, res) {
  try {
    const { slug } = req.params;

    const collection = await fetchCollectionWithProductsBySlug(slug);

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    res.json(collection);
  } catch (error) {
    console.error("Failed to fetch collection:", error);

    res.status(500).json({
      message: "Failed to fetch collection",
    });
  }
}