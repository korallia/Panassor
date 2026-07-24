import pool from "../db/pool.js";

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
      c.name_en AS collection_name_en,
      
      -- Intégration directe des couleurs et des deltas de prix dans le payload du produit
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', col.id,
              'name_fr', col.name_fr,
              'name_en', col.name_en,
              'hex_code', col.hex_code,
              'price_delta_cents', COALESCE(pcv.price_delta_cents, 0)
            )
          )
          FROM product_color_variants pcv
          JOIN colors col ON col.id = pcv.color_id
          WHERE pcv.product_id = p.id
        ),
        '[]'
      ) AS colors

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
      pi.color_id,
      col.name_en AS color_name_en,
      col.name_fr AS color_name_fr,
      col.hex_code AS color_hex_code,
      pi.is_main,
      COALESCE(pcv.price_delta_cents, 0) AS price_delta_cents
    FROM product_images pi
    LEFT JOIN colors col
      ON col.id = pi.color_id
    LEFT JOIN product_color_variants pcv
      ON pcv.product_id = pi.product_id
      AND pcv.color_id = pi.color_id
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
      COALESCE(pcv.price_delta_cents, 0) AS price_delta_cents,
      included.price_cents + COALESCE(pcv.price_delta_cents, 0) AS final_price_cents,
      included.customizable,
      ki.quantity,
      ki.sort_order,
      pi.url AS image_url,
      pi.color_id,
      col.name_en AS color_name_en,
      col.name_fr AS color_name_fr,
      col.hex_code AS color_hex_code
    FROM kit_items ki
    JOIN products included
      ON included.id = ki.included_product_id
    LEFT JOIN product_images pi
      ON pi.product_id = included.id
      AND pi.is_main = TRUE
    LEFT JOIN colors col
      ON col.id = pi.color_id
    LEFT JOIN product_color_variants pcv
      ON pcv.product_id = included.id
      AND pcv.color_id = pi.color_id
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
    colors: typeof product.colors === "string" ? JSON.parse(product.colors) : (product.colors || []),
    images,
    kit_items: kitItems,
  };
}