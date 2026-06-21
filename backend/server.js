import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/pool.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");

    res.json({
      status: "ok",
      database: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

// Get all collections
app.get("/api/collections", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        slug,
        name_fr,
        name_en,
        title_fr,
        title_en,
        eyebrow_fr,
        eyebrow_en,
        url,
        description_fr,
        description_en,
        long_description_fr,
        long_description_en,
        hero_image_url,
        thumbnail_image_url,
        video_url,
        video_poster_url,
        featured
      FROM collections
      ORDER BY featured DESC, name_fr ASC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch collections:", error);

    res.status(500).json({
      message: "Failed to fetch collections",
    });
  }
});

// Get one collection by slug, with products
app.get("/api/collections/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const collectionResult = await pool.query(
      `
      SELECT
        id,
        slug,
        name_fr,
        name_en,
        title_fr,
        title_en,
        eyebrow_fr,
        eyebrow_en,
        url,
        description_fr,
        description_en,
        long_description_fr,
        long_description_en,
        hero_image_url,
        thumbnail_image_url,
        video_url,
        video_poster_url,
        featured
      FROM collections
      WHERE slug = $1;
      `,
      [slug]
    );

    const collection = collectionResult.rows[0];

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    const productsResult = await pool.query(
      `
      SELECT
        p.id,
        p.collection_id,
        p.slug,
        p.name_fr,
        p.name_en,
        p.title_fr,
        p.title_en,
        p.description_fr,
        p.description_en,
        p.long_description_fr,
        p.long_description_en,
        p.price_cents,
        p.customizable,
        p.is_kit,
        p.featured,
        pi.url AS image_url
      FROM products p
      LEFT JOIN product_images pi
        ON pi.product_id = p.id
        AND pi.is_main = TRUE
      WHERE p.collection_id = $1
      ORDER BY p.is_kit DESC, p.featured DESC, p.name_fr ASC;
      `,
      [collection.id]
    );

    res.json({
      ...collection,
      products: productsResult.rows,
    });
  } catch (error) {
    console.error("Failed to fetch collection:", error);

    res.status(500).json({
      message: "Failed to fetch collection",
    });
  }
});

app.get("/api/products/customizable", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.collection_id,
        p.slug,
        p.name_fr,
        p.name_en,
        p.title_fr,
        p.title_en,
        p.description_fr,
        p.description_en,
        p.long_description_fr,
        p.long_description_en,
        p.price_cents,
        p.customizable,
        p.is_kit,
        p.featured,
        c.slug AS collection_slug,
        c.name_fr AS collection_name_fr,
        pi.url AS image_url
      FROM products p
      JOIN collections c
        ON c.id = p.collection_id
      LEFT JOIN product_images pi
        ON pi.product_id = p.id
        AND pi.is_main = TRUE
      WHERE p.customizable = TRUE
      ORDER BY c.name_fr ASC, p.name_fr ASC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch customizable products:", error);

    res.status(500).json({
      message: "Failed to fetch customizable products",
    });
  }
});

// Get one product by slug
app.get("/api/products/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const productResult = await pool.query(
      `
      SELECT
        p.id,
        p.collection_id,
        p.slug,
        p.name_fr,
        p.name_en,
        p.title_fr,
        p.title_en,
        p.description_fr,
        p.description_en,
        p.long_description_fr,
        p.long_description_en,
        p.price_cents,
        p.customizable,
        p.is_kit,
        p.featured,
        c.slug AS collection_slug,
        c.name_fr AS collection_name_fr
      FROM products p
      JOIN collections c ON c.id = p.collection_id
      WHERE p.slug = $1;
      `,
      [slug]
    );

    const product = productResult.rows[0];

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const imagesResult = await pool.query(
      `
      SELECT
        id,
        url,
        alt_fr,
        alt_en,
        sort_order,
        is_main
      FROM product_images
      WHERE product_id = $1
      ORDER BY sort_order ASC, id ASC;
      `,
      [product.id]
    );

    let kitItems = [];

    if (product.is_kit) {
      const kitItemsResult = await pool.query(
        `
        SELECT
          included.id,
          included.slug,
          included.name_fr,
          included.name_en,
          included.title_fr,
          included.title_en,
          included.description_fr,
          included.price_cents,
          included.customizable,
          ki.quantity,
          ki.sort_order,
          pi.url AS image_url
        FROM kit_items ki
        JOIN products included
          ON included.id = ki.included_product_id
        LEFT JOIN product_images pi
          ON pi.product_id = included.id
          AND pi.is_main = TRUE
        WHERE ki.kit_product_id = $1
        ORDER BY ki.sort_order ASC;
        `,
        [product.id]
      );

      kitItems = kitItemsResult.rows;
    }

    res.json({
      ...product,
      images: imagesResult.rows,
      kit_items: kitItems,
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);

    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Panassor backend running on ${import.meta.env.VITE_API_BASE_URL}:${PORT}`);
});