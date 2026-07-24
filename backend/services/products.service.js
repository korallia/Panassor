import pool from "../db/pool.js";

const COLLECTION_COLUMNS = `
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
`;

const PRODUCT_COLUMNS_WITH_IMAGE = `
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
  COALESCE(pcv.price_delta_cents, 0) AS price_delta_cents,
  p.price_cents + COALESCE(pcv.price_delta_cents, 0) AS final_price_cents,
  p.customizable,
  p.is_kit,
  p.featured,
  pi.url AS image_url,
  pi.color_id,
  col.name_en AS color_name_en,
  col.name_fr AS color_name_fr,
  col.hex_code AS color_hex_code,
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'id', c_var.id,
          'name_fr', c_var.name_fr,
          'name_en', c_var.name_en,
          'hex_code', c_var.hex_code,
          'price_delta_cents', COALESCE(sub_pcv.price_delta_cents, 0)
        )
      )
      FROM product_color_variants sub_pcv
      JOIN colors c_var ON c_var.id = sub_pcv.color_id
      WHERE sub_pcv.product_id = p.id
    ),
    '[]'
  ) AS colors
`;

export async function fetchPublishedCollections() {
  const result = await pool.query(`
    SELECT
      ${COLLECTION_COLUMNS}
    FROM collections
    WHERE status = 'published'
    ORDER BY featured DESC, name_fr ASC;
  `);

  return result.rows;
}

export async function fetchComingSoonCollections() {
  const result = await pool.query(`
    SELECT
      ${COLLECTION_COLUMNS}
    FROM collections
    WHERE status = 'coming_soon'
    ORDER BY featured DESC, name_fr ASC;
  `);

  return result.rows;
}

export async function fetchCollectionBySlug(slug) {
  const result = await pool.query(
    `
    SELECT
      ${COLLECTION_COLUMNS}
    FROM collections
    WHERE (slug_fr = $1 OR slug_en = $1)
      AND status = 'published';
    `,
    [slug]
  );

  return result.rows[0] || null;
}

export async function fetchMainKitProductByCollectionId(collectionId) {
  const result = await pool.query(
    `
    SELECT
      ${PRODUCT_COLUMNS_WITH_IMAGE}
    FROM products p
    LEFT JOIN product_images pi
      ON pi.product_id = p.id
      AND pi.is_main = TRUE
    LEFT JOIN colors col
      ON col.id = pi.color_id
    LEFT JOIN product_color_variants pcv
      ON pcv.product_id = p.id
      AND pcv.color_id = pi.color_id
    WHERE p.collection_id = $1
      AND p.is_kit = TRUE
    ORDER BY p.featured DESC, p.name_fr ASC
    LIMIT 1;
    `,
    [collectionId]
  );

  return result.rows[0] || null;
}

export async function fetchKitItemsByKitProductId(kitProductId) {
  const result = await pool.query(
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
      COALESCE(pcv.price_delta_cents, 0) AS price_delta_cents,
      included.price_cents + COALESCE(pcv.price_delta_cents, 0) AS final_price_cents,
      included.customizable,
      included.is_kit,
      included.featured,
      ki.sort_order,
      pi.url AS image_url,
      pi.color_id,
      col.name_en AS color_name_en,
      col.name_fr AS color_name_fr,
      col.hex_code AS color_hex_code,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', c_var.id,
              'name_fr', c_var.name_fr,
              'name_en', c_var.name_en,
              'hex_code', c_var.hex_code,
              'price_delta_cents', COALESCE(sub_pcv.price_delta_cents, 0)
            )
          )
          FROM product_color_variants sub_pcv
          JOIN colors c_var ON c_var.id = sub_pcv.color_id
          WHERE sub_pcv.product_id = included.id
        ),
        '[]'
      ) AS colors
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
    [kitProductId]
  );

  return result.rows;
}

export async function fetchProductsByCollectionId(collectionId) {
  const result = await pool.query(
    `
    SELECT
      ${PRODUCT_COLUMNS_WITH_IMAGE}
    FROM products p
    LEFT JOIN product_images pi
      ON pi.product_id = p.id
      AND pi.is_main = TRUE
    LEFT JOIN colors col
      ON col.id = pi.color_id
    LEFT JOIN product_color_variants pcv
      ON pcv.product_id = p.id
      AND pcv.color_id = pi.color_id
    WHERE p.collection_id = $1
    ORDER BY p.featured DESC, p.name_fr ASC;
    `,
    [collectionId]
  );

  return result.rows;
}

export async function fetchCollectionWithProductsBySlug(slug) {
  const collection = await fetchCollectionBySlug(slug);

  if (!collection) {
    return null;
  }

  const kitProduct = await fetchMainKitProductByCollectionId(collection.id);

  if (!kitProduct) {
    const products = await fetchProductsByCollectionId(collection.id);

    return {
      ...collection,
      products,
    };
  }

  const kitItems = await fetchKitItemsByKitProductId(kitProduct.id);

  return {
    ...collection,
    products: [kitProduct, ...kitItems],
  };
}

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
      COALESCE(pcv.price_delta_cents, 0) AS price_delta_cents,
      p.price_cents + COALESCE(pcv.price_delta_cents, 0) AS final_price_cents,
      p.customizable,
      p.is_kit,
      p.featured,
      c.slug_fr AS collection_slug_fr,
      c.slug_en AS collection_slug_en,
      c.name_fr AS collection_name_fr,
      c.name_en AS collection_name_en,
      pi.url AS image_url,
      pi.color_id,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', c_var.id,
              'name_fr', c_var.name_fr,
              'name_en', c_var.name_en,
              'hex_code', c_var.hex_code,
              'price_delta_cents', COALESCE(sub_pcv.price_delta_cents, 0)
            )
          )
          FROM product_color_variants sub_pcv
          JOIN colors c_var ON c_var.id = sub_pcv.color_id
          WHERE sub_pcv.product_id = p.id
        ),
        '[]'
      ) AS colors
    FROM products p
    JOIN collections c
      ON c.id = p.collection_id
    LEFT JOIN product_images pi
      ON pi.product_id = p.id
      AND pi.is_main = TRUE
    LEFT JOIN product_color_variants pcv
      ON pcv.product_id = p.id
      AND pcv.color_id = pi.color_id
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
      COALESCE(pcv.price_delta_cents, 0) AS price_delta_cents,
      p.price_cents + COALESCE(pcv.price_delta_cents, 0) AS final_price_cents,
      p.customizable,
      p.is_kit,
      p.featured,
      c.slug_fr AS collection_slug_fr,
      c.slug_en AS collection_slug_en,
      c.name_fr AS collection_name_fr,
      c.name_en AS collection_name_en,
      ki.sort_order AS kit_sort_order,
      pi.url AS image_url,
      pi.color_id,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', c_var.id,
              'name_fr', c_var.name_fr,
              'name_en', c_var.name_en,
              'hex_code', c_var.hex_code,
              'price_delta_cents', COALESCE(sub_pcv.price_delta_cents, 0)
            )
          )
          FROM product_color_variants sub_pcv
          JOIN colors c_var ON c_var.id = sub_pcv.color_id
          WHERE sub_pcv.product_id = p.id
        ),
        '[]'
      ) AS colors
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
    LEFT JOIN product_color_variants pcv
      ON pcv.product_id = p.id
      AND pcv.color_id = pi.color_id
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
      c.name_en AS collection_name_en,
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
      pi.is_main,
      COALESCE(pcv.price_delta_cents, 0) AS price_delta_cents
    FROM product_images pi
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
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', c_var.id,
              'name_fr', c_var.name_fr,
              'name_en', c_var.name_en,
              'hex_code', c_var.hex_code,
              'price_delta_cents', COALESCE(sub_pcv.price_delta_cents, 0)
            )
          )
          FROM product_color_variants sub_pcv
          JOIN colors c_var ON c_var.id = sub_pcv.color_id
          WHERE sub_pcv.product_id = included.id
        ),
        '[]'
      ) AS colors
    FROM kit_items ki
    JOIN products included
      ON included.id = ki.included_product_id
    LEFT JOIN product_images pi
      ON pi.product_id = included.id
      AND pi.is_main = TRUE
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