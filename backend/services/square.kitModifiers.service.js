import { squareFetch, assertSquareConfig, upsertCatalogObject } from "./square.service.js";
import { fetchCustomizableProducts } from "./products.service.js";
import db from "../db/pool.js";

// kitProductIds (optionnel) : limite la synchro aux kits donnes (utilise
// par `syncProducts.js --collection` pour ne pas toucher aux autres kits).
export async function syncKitComponentModifierLists({ kitProductIds } = {}) {
  assertSquareConfig();

  const filterByKits = Array.isArray(kitProductIds);
  if (filterByKits && kitProductIds.length === 0) {
    return [];
  }

  const componentsResult = await db.query(
    `SELECT kc.id, kc.kit_product_id, kc.included_product_id, kc.square_modifier_id, kc.square_modifier_list_version,
            p.name_fr AS included_name
     FROM kit_components kc
     JOIN products p ON p.id = kc.included_product_id
     WHERE p.customizable = true
       ${filterByKits ? "AND kc.kit_product_id = ANY($1::int[])" : ""}`,
    filterByKits ? [kitProductIds] : []
  );
  const components = componentsResult.rows;

  const tools = await fetchCustomizableProducts();

  const results = [];
  for (const component of components) {
    results.push(await syncModifierListForComponent(component, tools));
  }
  return results;
}

async function syncModifierListForComponent(component, tools) {
  const existingModifiersResult = await db.query(
    `SELECT tool_product_id, square_modifier_id FROM kit_component_modifiers WHERE kit_component_id = $1`,
    [component.id]
  );
  const existingModifierIds = new Map(
    existingModifiersResult.rows.map((r) => [r.tool_product_id, r.square_modifier_id])
  );

  const modifiers = tools.map((tool) => ({
    type: "MODIFIER",
    id: existingModifierIds.get(tool.id) || `#modifier_${component.id}_${tool.id}`,
    modifier_data: {
      name: tool.name_fr,
      price_money: { amount: 0, currency: "CAD" },
    },
  }));

  const modifierListObject = {
    type: "MODIFIER_LIST",
    id: component.square_modifier_id || `#modifierlist_component_${component.id}`,
    ...(component.square_modifier_list_version && {
      version: Number(component.square_modifier_list_version),
    }),
    modifier_list_data: {
      name: `Remplacer ${component.included_name}`,
      selection_type: "SINGLE",
      modifiers,
    },
  };

  const data = await upsertCatalogObject(modifierListObject);

  const saved = data.catalog_object;
  const idMappings = data.id_mappings || [];

  await db.query(
    `UPDATE kit_components SET square_modifier_id = $1, square_modifier_list_version = $2 WHERE id = $3`,
    [saved.id, saved.version, component.id]
  );

  for (const mapping of idMappings) {
    const match = mapping.client_object_id?.match(/^#modifier_(\d+)_(\d+)$/);
    if (!match) continue;
    const [, mappedComponentId, toolProductId] = match;
    await db.query(
      `INSERT INTO kit_component_modifiers (kit_component_id, tool_product_id, square_modifier_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (kit_component_id, tool_product_id) DO UPDATE SET square_modifier_id = $3`,
      [Number(mappedComponentId), Number(toolProductId), mapping.object_id]
    );
  }

  // Same idea as syncProductToSquare's variant fixup: an existing
  // modifier whose OLD square_modifier_id turned out not to exist on
  // Square goes through upsertCatalogObject's "recreate fresh" fallback
  // instead of the #modifier_<n>_<n> path above, so it never matches
  // that regex. Resolve those via the old-id -> real-id map the
  // fallback hands back, or the row keeps referencing a dead id.
  const staleIdToRealId = data.staleIdToRealId || {};

  for (const [toolProductId, oldModifierId] of existingModifierIds.entries()) {
    if (oldModifierId && staleIdToRealId[oldModifierId]) {
      await db.query(
        `INSERT INTO kit_component_modifiers (kit_component_id, tool_product_id, square_modifier_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (kit_component_id, tool_product_id) DO UPDATE SET square_modifier_id = $3`,
        [component.id, toolProductId, staleIdToRealId[oldModifierId]]
      );
    }
  }

  return { componentId: component.id, modifierListId: saved.id };
}

export async function getModifierListIdsForKit(kitProductId) {
  const result = await db.query(
    `SELECT square_modifier_id FROM kit_components 
     WHERE kit_product_id = $1 AND square_modifier_id IS NOT NULL`,
    [kitProductId]
  );
  return result.rows.map((r) => r.square_modifier_id);
}