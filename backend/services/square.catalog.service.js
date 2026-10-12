import { squareFetch, assertSquareConfig, getSquareBaseUrl, upsertCatalogObject } from "./square.service.js";
import { env } from "../config/env.js";
import { randomUUID } from "crypto";
import db from "../db/pool.js";
import { syncKitComponentModifierLists, getModifierListIdsForKit } from "./square.kitModifiers.service.js";

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function syncProductToSquare(productId) {
  const productResult = await db.query(
    `SELECT p.*,
            array_agg(
              json_build_object(
                'id', pcv.id,
                'color_id', pcv.color_id,
                'color_name', c.name_fr,
                'price_delta_cents', pcv.price_delta_cents,
                'square_variation_id', pcv.square_variation_id,
                'square_variation_version', pcv.square_variation_version,
                'square_image_id', pcv.square_image_id
              )
            ) FILTER (WHERE pcv.id IS NOT NULL) as variants
     FROM products p
     LEFT JOIN product_color_variants pcv ON pcv.product_id = p.id
     LEFT JOIN colors c ON c.id = pcv.color_id
     WHERE p.id = $1
     GROUP BY p.id`,
    [productId]
  );

  const product = productResult.rows[0];
  if (!product) throw new Error(`Product ${productId} not found`);

  // Garde-fou : sans prix, Square creerait l'article a 0,00 $ (achetable).
  if (product.price_cents === null || product.price_cents === undefined) {
    throw new Error(`Produit ${productId} (${product.slug_fr}) sans prix -- pas envoye a Square`);
  }

  const imagesResult = await db.query(
    `SELECT url, color_id, is_main FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC`,
    [productId]
  );
  const images = imagesResult.rows;
  const mainImage = images.find((i) => i.is_main) || images.find((i) => i.color_id === null) || null;

  const modifierListIds = await getModifierListIdsForKit(product.id);

  // Options du produit (ex. aiguilles « 1 droite », « 2 pareilles ») :
  // chacune devient une variation Square avec son propre prix.
  const optionsResult = await db.query(
    `SELECT id, label_fr, price_cents, square_variation_id, square_variation_version
     FROM product_options WHERE product_id = $1 ORDER BY sort_order, id`,
    [productId]
  );
  const options = optionsResult.rows;

  const variations = (product.variants || []).map((variant) => ({
    type: "ITEM_VARIATION",
    id: variant.square_variation_id || `#variation_${variant.id}`,
    ...(variant.square_variation_version && { version: Number(variant.square_variation_version) }),
    item_variation_data: {
      name: variant.color_name || `Couleur ${variant.color_id}`,
      pricing_type: "FIXED_PRICING",
      price_money: {
        amount: Number(product.price_cents) + Number(variant.price_delta_cents || 0),
        currency: "CAD",
      },
      track_inventory: true,
      ...(variant.square_image_id && { image_ids: [variant.square_image_id] }),
    },
  }));

  for (const option of options) {
    variations.push({
      type: "ITEM_VARIATION",
      id: option.square_variation_id || `#option_${option.id}`,
      ...(option.square_variation_version && { version: Number(option.square_variation_version) }),
      item_variation_data: {
        name: option.label_fr,
        pricing_type: "FIXED_PRICING",
        price_money: { amount: Number(option.price_cents), currency: "CAD" },
        track_inventory: true,
      },
    });
  }

  if (variations.length === 0) {
    variations.push({
      type: "ITEM_VARIATION",
      // Réutilise la variation existante : en créer une nouvelle à chaque
      // synchro faisait supprimer l'ancienne par Square, avec son stock.
      id: product.square_default_variation_id || `#variation_default_${product.id}`,
      item_variation_data: {
        pricing_type: "FIXED_PRICING",
        price_money: { amount: Number(product.price_cents), currency: "CAD" },
        track_inventory: true,
      },
    });
  }

  const squareObject = {
    type: "ITEM",
    id: product.square_item_id || `#item_${product.id}`,
    ...(product.square_item_version && { version: Number(product.square_item_version) }),
    item_data: {
      name: product.name_fr,
      description_html: product.description_fr ? `<p>${escapeHtml(product.description_fr)}</p>` : undefined,
      variations,
      ...(product.square_image_id && { image_ids: [product.square_image_id] }),
      ...(modifierListIds.length > 0 && {
        modifier_list_info: modifierListIds.map((id) => ({
          modifier_list_id: id,
          min_selected_modifiers: 1,
          max_selected_modifiers: 1,
          enabled: true,
        })),
      }),
    },
  };

  const data = await upsertCatalogObject(squareObject);

  const saved = data.catalog_object;
  const idMappings = data.id_mappings || [];

  await db.query(
    `UPDATE products SET square_item_id = $1, square_item_version = $2 WHERE id = $3`,
    [saved.id, saved.version, product.id]
  );

  // Produit à options : pas de variation « par défaut ». Un article du
  // panier sans option choisie est donc refusé au paiement, au lieu de
  // partir au prix de la première option.
  if (options.length > 0) {
    await db.query(`UPDATE products SET square_default_variation_id = NULL WHERE id = $1`, [
      product.id,
    ]);
  }

  for (const option of options) {
    const realId =
      idMappings.find((m) => m.client_object_id === `#option_${option.id}`)?.object_id ||
      data.staleIdToRealId?.[option.square_variation_id] ||
      option.square_variation_id;
    const savedVariation = saved.item_data?.variations?.find((v) => v.id === realId);
    if (realId) {
      await db.query(
        `UPDATE product_options SET square_variation_id = $1, square_variation_version = $2 WHERE id = $3`,
        [realId, savedVariation?.version || null, option.id]
      );
    }
  }

  // Produits sans variante de couleur : sauvegarder l'id de la variation "Par défaut"
  if (options.length === 0 && (product.variants || []).length === 0 && saved.item_data?.variations?.[0]?.id) {
    await db.query(`UPDATE products SET square_default_variation_id = $1 WHERE id = $2`, [
      saved.item_data.variations[0].id,
      product.id,
    ]);
  }

  const variantRealIds = new Map();

  for (const mapping of idMappings) {
    const match = mapping.client_object_id?.match(/^#variation_(\d+)$/);
    if (!match) continue;
    const localVariantId = parseInt(match[1]);
    const savedVariation = saved.item_data?.variations?.find((v) => v.id === mapping.object_id);
    variantRealIds.set(localVariantId, mapping.object_id);
    await db.query(
      `UPDATE product_color_variants SET square_variation_id = $1, square_variation_version = $2 WHERE id = $3`,
      [mapping.object_id, savedVariation?.version || null, localVariantId]
    );
  }

  // A variant whose OLD square_variation_id didn't exist on Square at
  // all (e.g. created under a different Square environment) goes
  // through upsertCatalogObject's "recreate fresh" fallback instead of
  // the normal #variation_<id> path above, so it never matches the
  // regex loop -- resolve those here via the old-id -> real-id map that
  // fallback hands back, or the stale row would silently keep
  // referencing an id that no longer resolves anywhere (see the
  // checkout 404 Korallia hit on 2026-09-16).
  const staleIdToRealId = data.staleIdToRealId || {};

  for (const variant of product.variants || []) {
    if (
      variant.square_variation_id &&
      staleIdToRealId[variant.square_variation_id] &&
      !variantRealIds.has(variant.id)
    ) {
      const realVariationId = staleIdToRealId[variant.square_variation_id];
      const savedVariation = saved.item_data?.variations?.find(
        (v) => v.id === realVariationId
      );

      variantRealIds.set(variant.id, realVariationId);

      await db.query(
        `UPDATE product_color_variants SET square_variation_id = $1, square_variation_version = $2 WHERE id = $3`,
        [realVariationId, savedVariation?.version || null, variant.id]
      );
    }
  }

  for (const variant of product.variants || []) {
    if (variant.square_variation_id && !variantRealIds.has(variant.id)) {
      variantRealIds.set(variant.id, variant.square_variation_id);
    }
  }

  if (mainImage && !product.square_image_id) {
    console.log(`>>> Upload image principale: produit ${product.id}, url=${mainImage.url}`);
    try {
      const imageId = await uploadImageToSquare(saved.id, mainImage.url, product.name_fr);
      console.log(`>>> OK image principale produit ${product.id}: ${imageId}`);
      await db.query(`UPDATE products SET square_image_id = $1 WHERE id = $2`, [imageId, product.id]);
    } catch (err) {
      console.error(`>>> ÉCHEC image principale produit ${product.id}:`, err.message);
    }
  } else {
    console.log(
      `>>> SKIP image principale produit ${product.id} (mainImage=${!!mainImage}, square_image_id=${product.square_image_id})`
    );
  }

  for (const variant of product.variants || []) {
    if (variant.square_image_id) {
      console.log(`>>> SKIP image variante ${variant.id} (déjà square_image_id=${variant.square_image_id})`);
      continue;
    }
    const variantImage = images.find((i) => i.color_id === variant.color_id);
    if (!variantImage) {
      console.log(`>>> SKIP image variante ${variant.id} (aucune image pour color_id=${variant.color_id})`);
      continue;
    }
    const realSquareVariationId = variantRealIds.get(variant.id);
    if (!realSquareVariationId) {
      console.log(`>>> SKIP image variante ${variant.id} (pas de square_variation_id résolu)`);
      continue;
    }
    console.log(`>>> Upload image variante ${variant.id}, url=${variantImage.url}`);
    try {
      const imageId = await uploadImageToSquare(
        realSquareVariationId,
        variantImage.url,
        variant.color_name || `${product.name_fr} - couleur ${variant.color_id}`
      );
      console.log(`>>> OK image variante ${variant.id}: ${imageId}`);
      await db.query(`UPDATE product_color_variants SET square_image_id = $1 WHERE id = $2`, [
        imageId,
        variant.id,
      ]);
    } catch (err) {
      console.error(`>>> ÉCHEC image variante ${variant.id}:`, err.message);
    }
  }

  return saved;
}

function resolveImageUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  const base = (env.assetsBaseUrl || "").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function uploadImageToSquare(objectId, imageUrl, name) {
  const fullUrl = resolveImageUrl(imageUrl);
  const imageResponse = await fetch(fullUrl);
  if (!imageResponse.ok) {
    throw new Error(`Téléchargement image échoué (${fullUrl}): ${imageResponse.status}`);
  }
  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
  const contentType = imageResponse.headers.get("content-type") || "image/jpeg";

  const form = new FormData();
  form.append(
    "request",
    JSON.stringify({
      idempotency_key: randomUUID(),
      object_id: objectId,
      image: { type: "IMAGE", id: "#image", image_data: { name } },
    })
  );
  form.append("image_file", new Blob([imageBuffer], { type: contentType }), "image.jpg");

  const response = await fetch(`${getSquareBaseUrl()}/v2/catalog/images`, {
    method: "POST",
    headers: {
      "Square-Version": "2026-06-18",
      Authorization: `Bearer ${env.square.accessToken}`,
    },
    body: form,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.errors?.[0]?.detail || `Upload image Square échoué: ${response.status}`);
  }

  return data.image.id;
}

async function findCollectionBySlug(slug) {
  const result = await db.query(
    `SELECT id, slug_fr, name_fr FROM collections WHERE slug_fr = $1 OR slug_en = $1`,
    [slug]
  );

  if (!result.rows[0]) {
    const all = await db.query(`SELECT slug_fr FROM collections ORDER BY id`);
    throw new Error(
      `Collection "${slug}" introuvable. Collections existantes : ${all.rows
        .map((row) => row.slug_fr)
        .join(", ")}`
    );
  }

  return result.rows[0];
}

// Options :
//  - collectionSlug : ne synchronise QUE les produits de cette collection
//    (slug FR ou EN). Les autres produits ne sont pas envoyes a Square du
//    tout -> leurs infos et leur inventaire ne peuvent pas etre touches.
//  - dryRun : n'appelle pas Square, affiche seulement ce qui serait fait.
export async function syncAllProductsToSquare({ collectionSlug, productSlugs = [], dryRun = false } = {}) {
  let collection = null;
  if (collectionSlug) {
    collection = await findCollectionBySlug(collectionSlug);
  }

  // --product <slug> (répétable) : seulement ces produits.
  const result = productSlugs.length
    ? await db.query(
        `SELECT id, slug_fr, name_fr, is_kit, square_item_id FROM products
         WHERE slug_fr = ANY($1::text[]) ORDER BY id`,
        [productSlugs]
      )
    : await db.query(
        `SELECT id, slug_fr, name_fr, is_kit, square_item_id FROM products
         ${collection ? "WHERE collection_id = $1" : ""}
         ORDER BY id`,
        collection ? [collection.id] : []
      );

  if (productSlugs.length && result.rows.length !== productSlugs.length) {
    const found = new Set(result.rows.map((row) => row.slug_fr));
    throw new Error(`Produit(s) introuvable(s) : ${productSlugs.filter((s) => !found.has(s)).join(", ")}`);
  }

  const scopeLabel = productSlugs.length
    ? `produit(s) ${productSlugs.join(", ")}`
    : collection
      ? `collection "${collection.slug_fr}" (${collection.name_fr})`
      : "TOUS les produits";

  console.log(`\n${dryRun ? "[DRY-RUN] " : ""}Synchro Square : ${scopeLabel} -- ${result.rows.length} produit(s)`);

  if (dryRun) {
    for (const row of result.rows) {
      console.log(
        `  - #${row.id} ${row.slug_fr} "${row.name_fr}"${row.is_kit ? " [kit]" : ""} -> ${
          row.square_item_id ? "MISE A JOUR (deja dans Square)" : "CREATION (nouveau dans Square)"
        }`
      );
    }
    console.log("\n[DRY-RUN] Rien n'a ete envoye a Square.");
    return result.rows.map((row) => ({ productId: row.id, dryRun: true }));
  }

  assertSquareConfig();
  await syncKitComponentModifierLists(
    collection || productSlugs.length
      ? { kitProductIds: result.rows.filter((row) => row.is_kit).map((row) => row.id) }
      : {}
  );
  const results = [];

  for (const row of result.rows) {
    console.log(`\n=== Sync produit ${row.id} ===`);
    try {
      const saved = await syncProductToSquare(row.id);
      results.push({ productId: row.id, squareItemId: saved.id, ok: true });
    } catch (error) {
      console.error(`Failed to sync product ${row.id}:`, error.message);
      results.push({ productId: row.id, ok: false, error: error.message });
    }
  }

  return results;
}