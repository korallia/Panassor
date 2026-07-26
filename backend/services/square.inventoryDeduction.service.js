import { squareFetch, assertSquareConfig } from "./square.service.js";
import { env } from "../config/env.js";
import db from "../db/pool.js";

async function getVariationIdForProduct(productId) {
  const variantResult = await db.query(
    `SELECT square_variation_id FROM product_color_variants WHERE product_id = $1 AND square_variation_id IS NOT NULL LIMIT 1`,
    [productId]
  );
  if (variantResult.rows[0]?.square_variation_id) {
    return variantResult.rows[0].square_variation_id;
  }

  const productResult = await db.query(
    `SELECT square_default_variation_id FROM products WHERE id = $1`,
    [productId]
  );
  return productResult.rows[0]?.square_default_variation_id || null;
}

async function findKitProductIdByVariationId(variationId) {
  const result = await db.query(
    `SELECT id FROM products WHERE square_default_variation_id = $1
     UNION
     SELECT p.id FROM products p
     JOIN product_color_variants pcv ON pcv.product_id = p.id
     WHERE pcv.square_variation_id = $1`,
    [variationId]
  );
  return result.rows[0]?.id || null;
}

export async function deductKitComponentInventory(squareOrder) {
  assertSquareConfig();
  const deductions = new Map();

  for (const lineItem of squareOrder.line_items || []) {
    const variationId = lineItem.catalog_object_id;
    if (!variationId) continue;

    const kitProductId = await findKitProductIdByVariationId(variationId);
    if (!kitProductId) continue;

    const lineQuantity = Number(lineItem.quantity || 1);

    const componentsResult = await db.query(
      `SELECT kc.included_product_id, kc.quantity, p.customizable
       FROM kit_components kc
       JOIN products p ON p.id = kc.included_product_id
       WHERE kc.kit_product_id = $1`,
      [kitProductId]
    );
    if (componentsResult.rows.length === 0) continue;

    for (const component of componentsResult.rows) {
      if (!component.customizable) {
        const qty = component.quantity * lineQuantity;
        deductions.set(
          component.included_product_id,
          (deductions.get(component.included_product_id) || 0) + qty
        );
      }
    }

    for (const modifier of lineItem.modifiers || []) {
      if (!modifier.catalog_object_id) continue;
      const modifierMatch = await db.query(
        `SELECT tool_product_id FROM kit_component_modifiers WHERE square_modifier_id = $1`,
        [modifier.catalog_object_id]
      );
      const toolProductId = modifierMatch.rows[0]?.tool_product_id;
      if (!toolProductId) continue;
      deductions.set(toolProductId, (deductions.get(toolProductId) || 0) + lineQuantity);
    }
  }

  if (deductions.size === 0) return { adjusted: 0 };

  const changes = [];
  for (const [productId, quantity] of deductions.entries()) {
    const variationId = await getVariationIdForProduct(productId);
    if (!variationId) {
      console.warn(`>>> Pas de variation Square trouvée pour produit ${productId}, déduction ignorée`);
      continue;
    }
    changes.push({
      type: "ADJUSTMENT",
      adjustment: {
        catalog_object_id: variationId,
        location_id: env.square.locationId,
        from_state: "IN_STOCK",
        to_state: "SOLD",
        quantity: String(quantity),
        occurred_at: new Date().toISOString(),
      },
    });
  }

  if (changes.length === 0) return { adjusted: 0 };

    await squareFetch("/v2/inventory/changes/batch-create", {
    method: "POST",
    body: JSON.stringify({
      idempotency_key: `kit-inventory-${squareOrder.id}`,
      changes,
    }),
  });

  return { adjusted: changes.length };
}