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

// Get published collections only
app.get("/api/collections", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        slug_fr,
        slug_en,
        name_fr,
        name_en,
        title_fr,
        title_en,
        eyebrow_fr,
        eyebrow_en,
        url_fr,
        url_en,
        description_fr,
        description_en,
        long_description_fr,
        long_description_en,
        hero_image_url,
        thumbnail_image_url,
        intro_image_url,
        video_url,
        video_poster_url,
        featured,
        status
      FROM collections
      WHERE status = 'published'
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

// Get coming soon collections for sneak peek / atelier
app.get("/api/collections/coming-soon", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        slug_fr,
        slug_en,
        name_fr,
        name_en,
        title_fr,
        title_en,
        eyebrow_fr,
        eyebrow_en,
        url_fr,
        url_en,
        description_fr,
        description_en,
        long_description_fr,
        long_description_en,
        hero_image_url,
        thumbnail_image_url,
        intro_image_url,
        video_url,
        video_poster_url,
        featured,
        status
      FROM collections
      WHERE status = 'coming_soon'
      ORDER BY featured DESC, name_fr ASC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch coming soon collections:", error);

    res.status(500).json({
      message: "Failed to fetch coming soon collections",
    });
  }
});

// Get one published collection by slug_fr or slug_en, with products
app.get("/api/collections/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const collectionResult = await pool.query(
      `
      SELECT
        id,
        slug_fr,
        slug_en,
        name_fr,
        name_en,
        title_fr,
        title_en,
        eyebrow_fr,
        eyebrow_en,
        url_fr,
        url_en,
        description_fr,
        description_en,
        long_description_fr,
        long_description_en,
        hero_image_url,
        thumbnail_image_url,
        intro_image_url,
        video_url,
        video_poster_url,
        featured,
        status
      FROM collections
      WHERE (slug_fr = $1 OR slug_en = $1)
        AND status = 'published';
      `,
      [slug]
    );

    const collection = collectionResult.rows[0];

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    const kitProductResult = await pool.query(
      `
      SELECT
        p.id,
        p.collection_id,
        p.slug_fr,
        p.slug_en,
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
        AND p.is_kit = TRUE
      ORDER BY p.featured DESC, p.name_fr ASC
      LIMIT 1;
      `,
      [collection.id]
    );

    const kitProduct = kitProductResult.rows[0];

    let products = [];

    if (kitProduct) {
      const kitItemsResult = await pool.query(
        `
        SELECT
          included.id,
          included.collection_id,
          included.slug_fr,
          included.slug_en,
          included.name_fr,
          included.name_en,
          included.title_fr,
          included.title_en,
          included.description_fr,
          included.description_en,
          included.long_description_fr,
          included.long_description_en,
          included.price_cents,
          included.customizable,
          included.is_kit,
          included.featured,
          ki.sort_order,
          pi.url AS image_url
        FROM kit_items ki
        JOIN products included
          ON included.id = ki.included_product_id
        LEFT JOIN product_images pi
          ON pi.product_id = included.id
          AND pi.is_main = TRUE
        WHERE ki.kit_product_id = $1
        ORDER BY ki.sort_order ASC, included.name_fr ASC;
        `,
        [kitProduct.id]
      );

      products = [kitProduct, ...kitItemsResult.rows];
    } else {
      const productsResult = await pool.query(
        `
        SELECT
          p.id,
          p.collection_id,
          p.slug_fr,
          p.slug_en,
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
        ORDER BY p.featured DESC, p.name_fr ASC;
        `,
        [collection.id]
      );

      products = productsResult.rows;
    }

    res.json({
      ...collection,
      products,
    });
  } catch (error) {
    console.error("Failed to fetch collection:", error);

    res.status(500).json({
      message: "Failed to fetch collection",
    });
  }
});

// Get customizable products from published collections only
app.get("/api/products/customizable", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.collection_id,
        p.slug_fr,
        p.slug_en,
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
        c.slug_fr AS collection_slug_fr,
        c.slug_en AS collection_slug_en,
        c.name_fr AS collection_name_fr,
        c.name_en AS collection_name_en,
        pi.url AS image_url
      FROM products p
      JOIN collections c
        ON c.id = p.collection_id
      LEFT JOIN product_images pi
        ON pi.product_id = p.id
        AND pi.is_main = TRUE
      WHERE p.customizable = TRUE
        AND c.status = 'published'
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

// Get all products from published collections only
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.collection_id,
        p.slug_fr,
        p.slug_en,
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
        c.slug_fr AS collection_slug_fr,
        c.slug_en AS collection_slug_en,
        c.name_fr AS collection_name_fr,
        c.name_en AS collection_name_en,
        ki.sort_order AS kit_sort_order,
        pi.url AS image_url
      FROM products p
      JOIN collections c
        ON c.id = p.collection_id
      LEFT JOIN kit_items ki
        ON ki.included_product_id = p.id
      LEFT JOIN products kit
        ON kit.id = ki.kit_product_id
        AND kit.collection_id = p.collection_id
      LEFT JOIN product_images pi
        ON pi.product_id = p.id
        AND pi.is_main = TRUE
      WHERE c.status = 'published'
      ORDER BY
        c.name_fr ASC,
        p.is_kit DESC,
        CASE
          WHEN p.is_kit = TRUE THEN 0
          WHEN ki.sort_order IS NOT NULL THEN ki.sort_order
          ELSE 9999
        END ASC,
        p.featured DESC,
        p.name_fr ASC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch products:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});

// Get one product by slug_fr or slug_en, only if its collection is published
app.get("/api/products/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const productResult = await pool.query(
      `
      SELECT
        p.id,
        p.collection_id,
        p.slug_fr,
        p.slug_en,
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
        c.slug_fr AS collection_slug_fr,
        c.slug_en AS collection_slug_en,
        c.name_fr AS collection_name_fr,
        c.name_en AS collection_name_en
      FROM products p
      JOIN collections c
        ON c.id = p.collection_id
      WHERE (p.slug_fr = $1 OR p.slug_en = $1)
        AND c.status = 'published';
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
        color_key,
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
          included.slug_fr,
          included.slug_en,
          included.name_fr,
          included.name_en,
          included.title_fr,
          included.title_en,
          included.description_fr,
          included.description_en,
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
        ORDER BY ki.sort_order ASC, included.name_fr ASC;
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

// Get published atelier videos
app.get("/api/atelier/videos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        slug_fr,
        slug_en,
        title_fr,
        title_en,
        eyebrow_fr,
        eyebrow_en,
        description_fr,
        description_en,
        video_url,
        poster_url,
        sort_order,
        featured,
        status
      FROM atelier_videos
      WHERE status = 'published'
        AND NULLIF(TRIM(video_url), '') IS NOT NULL
      ORDER BY featured DESC, sort_order ASC, created_at DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch atelier videos:", error);

    res.status(500).json({
      message: "Failed to fetch atelier videos",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Panassor backend running on http://localhost:${PORT}`);
});