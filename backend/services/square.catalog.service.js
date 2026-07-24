// services/square.catalog.service.js
import { randomUUID } from "crypto";
import { squareFetch } from "./square.service.js";
import { db } from "../config/db.js"; // adapte selon ton import de db

export async function syncProductToSquare(productId) {
     assertSquareConfig();
  // 1. Charger le produit et ses variations de couleur
  const productResult = await db.query(
    `SELECT p.*, 
            array_agg(
              json_build_object(
                'id', pcv.id,
                'color_id', pcv.color_id,
                'price_delta_cents', pcv.price_delta_cents,
                'square_variation_id', pcv.square_variation_id,
                'square_variation_version', pcv.square_variation_version
              )
            ) FILTER (WHERE pcv.id IS NOT NULL) as variants
     FROM products p
     LEFT JOIN product_color_variants pcv ON pcv.product_id = p.id
     WHERE p.id = $1
     GROUP BY p.id`,
    [productId]
  );

  const product = productResult.rows[0];
  if (!product) throw new Error(`Product ${productId} not found`);

  // 2. Construire les variations Square (une par couleur)
  const variations = (product.variants || []).map((variant) => ({
    type: "ITEM_VARIATION",
    // Si déjà dans Square, on passe le vrai ID — sinon un ID temporaire
    id: variant.square_variation_id || `#variation_${variant.id}`,
    ...(variant.square_variation_version && {
      version: variant.square_variation_version,
    }),
    item_variation_data: {
      name: `Couleur ${variant.color_id}`, // tu voudras peut-être joindre la table colors pour le vrai nom
      pricing_type: "FIXED_PRICING",
      price_money: {
        amount: product.price_cents + variant.price_delta_cents,
        currency: "CAD",
      },
      track_inventory: true,
    },
  }));

  // Fallback si aucune variante de couleur — variation par défaut
  if (variations.length === 0) {
    variations.push({
      type: "ITEM_VARIATION",
      id: `#variation_default_${product.id}`,
      item_variation_data: {
        name: "Par défaut",
        pricing_type: "FIXED_PRICING",
        price_money: {
          amount: product.price_cents,
          currency: "CAD",
        },
        track_inventory: true,
      },
    });
  }

  // 3. Construire l'objet Square
  const squareObject = {
    type: "ITEM",
    id: product.square_item_id || `#item_${product.id}`,
    ...(product.square_item_version && {
      version: product.square_item_version,
    }),
    item_data: {
      name: product.name_fr,
      description: product.description_fr || undefined,
      variations,
    },
  };

  // 4. Appel Square
  const data = await squareFetch("/v2/catalog/object", {
    method: "POST",
    body: JSON.stringify({
      idempotency_key: randomUUID(),
      object: squareObject,
    }),
  });

  const saved = data.catalog_object;
  const idMappings = data.id_mappings || []; // Square retourne les vrais IDs pour les #temp_ids

  // 5. Sauvegarder l'ID de l'item Square sur le produit
  await db.query(
    `UPDATE products 
     SET square_item_id = $1, square_item_version = $2 
     WHERE id = $3`,
    [saved.id, saved.version, product.id]
  );

  // 6. Sauvegarder les IDs de variations
  // Square retourne id_mappings: [{ client_object_id: "#variation_5", object_id: "REAL_ID" }]
  for (const mapping of idMappings) {
    // Extraire l'ID local du temp ID (#variation_5 → 5)
    const match = mapping.client_object_id?.match(/^#variation_(\d+)$/);
    if (!match) continue;

    const localVariantId = parseInt(match[1]);

    // Trouver le vrai ID de variation dans l'objet retourné
    const savedVariation = saved.item_data?.variations?.find(
      (v) => v.id === mapping.object_id
    );

    await db.query(
      `UPDATE product_color_variants 
       SET square_variation_id = $1, square_variation_version = $2 
       WHERE id = $3`,
      [mapping.object_id, savedVariation?.version || null, localVariantId]
    );
  }

  return saved;
}

export async function syncAllProductsToSquare() {
  const result = await db.query(`SELECT id FROM products ORDER BY id`);
  const results = [];

  for (const row of result.rows) {
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