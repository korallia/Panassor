import pool from "../db/pool.js";

export async function fetchCustomizableProducts() {
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
      COALESCE(pcp.price_delta_cents, 0) AS price_delta_cents,
      p.price_cents + COALESCE(pcp.price_delta_cents, 0) AS final_price_cents,
      p.customizable,
      p.is_kit,
      p.featured,
      c.slug_fr AS collection_slug_fr,
      c.slug_en AS collection_slug_en,
      c.name_fr AS collection_name_fr,
      c.name_en AS collection_name_en,
      pi.url AS image_url,
      pi.color_key
    FROM products p
    JOIN collections c
      ON c.id = p.collection_id
    LEFT JOIN product_images pi
      ON pi.product_id = p.id
      AND pi.is_main = TRUE
    LEFT JOIN product_color_prices pcp
      ON pcp.product_id = p.id
      AND pcp.color_key = pi.color_key
    WHERE p.customizable = TRUE
      AND c.status = 'published'
    ORDER BY c.name_fr ASC, p.name_fr ASC;
  `);

  return result.rows;
}

export async function fetchAllProducts() {
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
      COALESCE(pcp.price_delta_cents, 0) AS price_delta_cents,
      p.price_cents + COALESCE(pcp.price_delta_cents, 0) AS final_price_cents,
      p.customizable,
      p.is_kit,
      p.featured,
      c.slug_fr AS collection_slug_fr,
      c.slug_en AS collection_slug_en,
      c.name_fr AS collection_name_fr,
      c.name_en AS collection_name_en,
      ki.sort_order AS kit_sort_order,
      pi.url AS image_url,
      pi.color_key
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
    LEFT JOIN product_color_prices pcp
      ON pcp.product_id = p.id
      AND pcp.color_key = pi.color_key
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

  return result.rows;
}

export async function fetchProductBySlug(slug) {
  const result = await pool.query(
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

  return result.rows[0] || null;
}

export async function fetchProductImages(productId) {
  const result = await pool.query(
    `
    SELECT
      pi.id,
      pi.url,
      pi.alt_fr,
      pi.alt_en,
      pi.sort_order,
      pi.color_key,
      pi.is_main,
      COALESCE(pcp.price_delta_cents, 0) AS price_delta_cents
    FROM product_images pi
    LEFT JOIN product_color_prices pcp
      ON pcp.product_id = pi.product_id
      AND pcp.color_key = pi.color_key
    WHERE pi.product_id = $1
    ORDER BY pi.sort_order ASC, pi.id ASC;
    `,
    [productId]
  );

  return result.rows;
}

export async function fetchKitItemsForProduct(productId) {
  const result = await pool.query(
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
      COALESCE(pcp.price_delta_cents, 0) AS price_delta_cents,
      included.price_cents + COALESCE(pcp.price_delta_cents, 0) AS final_price_cents,
      included.customizable,
      ki.quantity,
      ki.sort_order,
      pi.url AS image_url,
      pi.color_key
    FROM kit_items ki
    JOIN products included
      ON included.id = ki.included_product_id
    LEFT JOIN product_images pi
      ON pi.product_id = included.id
      AND pi.is_main = TRUE
    LEFT JOIN product_color_prices pcp
      ON pcp.product_id = included.id
      AND pcp.color_key = pi.color_key
    WHERE ki.kit_product_id = $1
    ORDER BY ki.sort_order ASC, included.name_fr ASC;
    `,
    [productId]
  );

  return result.rows;
}

export async function fetchProductWithDetailsBySlug(slug) {
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return null;
  }

  const images = await fetchProductImages(product.id);

  let kitItems = [];

  if (product.is_kit) {
    kitItems = await fetchKitItemsForProduct(product.id);
  }

  return {
    ...product,
    images,
    kit_items: kitItems,
  };
}