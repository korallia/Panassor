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
  p.customizable,
  p.is_kit,
  p.featured,
  pi.url AS image_url
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