import { squareFetch, assertSquareConfig, upsertCatalogObject } from "./square.service.js";
import { fetchCustomizableProducts } from "./catalog.service.js";
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
     -- Outil au choix : seulement dans les kits, pas les ensembles (duos).
     JOIN products kit ON kit.id = kc.kit_product_id AND kit.is_kit = true
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
  results.push(...(await syncOptionModifierLists({ kitProductIds: filterByKits ? kitProductIds : null })));
  return results;
}

// Produits à options DANS un kit (aiguilles de suture) : une liste de choix
// Square par produit, partagée par tous les kits qui le contiennent.
// Les choix viennent de product_options : les options de la même quantité
// que l'option par défaut (la première : « 1 droite + 1 courbe » → les options
// de 2 aiguilles). Moins de 2 choix (aiguilles de douleur) : pas de liste.
async function syncOptionModifierLists({ kitProductIds } = {}) {
  const productsResult = await db.query(
    `SELECT DISTINCT p.id, p.name_fr, p.square_modifier_list_id, p.square_modifier_list_version
     FROM kit_components kc
     JOIN products p ON p.id = kc.included_product_id AND NOT p.customizable
     JOIN products kit ON kit.id = kc.kit_product_id AND kit.is_kit
     WHERE EXISTS (SELECT 1 FROM product_options o WHERE o.product_id = p.id)
       ${kitProductIds ? "AND kc.kit_product_id = ANY($1::int[])" : ""}`,
    kitProductIds ? [kitProductIds] : []
  );

  const results = [];
  for (const product of productsResult.rows) {
    const optionsResult = await db.query(
      `SELECT id, label_fr, quantity, square_modifier_id
       FROM product_options WHERE product_id = $1 ORDER BY sort_order, id`,
      [product.id]
    );
    const [defaultOption] = optionsResult.rows;
    const choices = optionsResult.rows.filter((option) => option.quantity === defaultOption.quantity);
    if (choices.length < 2) continue;

    const data = await upsertCatalogObject({
      type: "MODIFIER_LIST",
      id: product.square_modifier_list_id || `#modifierlist_options_${product.id}`,
      ...(product.square_modifier_list_version && { version: Number(product.square_modifier_list_version) }),
      modifier_list_data: {
        name: product.name_fr,
        selection_type: "SINGLE",
        modifiers: choices.map((option, index) => ({
          type: "MODIFIER",
          id: option.square_modifier_id || `#option_modifier_${option.id}`,
          modifier_data: {
            name: option.label_fr,
            price_money: { amount: 0, currency: "CAD" },
            ordinal: index + 1,
            // L'option par défaut est déjà cochée à la caisse.
            on_by_default: index === 0,
          },
        })),
      },
    });

    const saved = data.catalog_object;
    await db.query(
      `UPDATE products SET square_modifier_list_id = $1, square_modifier_list_version = $2 WHERE id = $3`,
      [saved.id, saved.version, product.id]
    );

    // Les ids que Square a donnés aux choix → product_options.square_modifier_id.
    for (const mapping of data.id_mappings || []) {
      const match = mapping.client_object_id?.match(/^#option_modifier_(\d+)$/);
      if (!match) continue;
      await db.query(`UPDATE product_options SET square_modifier_id = $1 WHERE id = $2`, [mapping.object_id, Number(match[1])]);
    }
    // Un ancien id qui n'existait plus sur Square (changement d'environnement).
    const staleIdToRealId = data.staleIdToRealId || {};
    for (const option of choices) {
      const realId = option.square_modifier_id && staleIdToRealId[option.square_modifier_id];
      if (realId) await db.query(`UPDATE product_options SET square_modifier_id = $1 WHERE id = $2`, [realId, option.id]);
    }

    results.push({ productId: product.id, modifierListId: saved.id });
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

// Les listes de choix d'un kit : outils au choix (kit_components) et
// options des pièces du kit (aiguilles : products.square_modifier_list_id).
// required = false pour les aiguilles : sans choix, c'est l'option par défaut.
export async function getModifierListsForKit(kitProductId) {
  const result = await db.query(
    `SELECT square_modifier_id AS id, true AS required FROM kit_components
     WHERE kit_product_id = $1 AND square_modifier_id IS NOT NULL
     UNION
     SELECT p.square_modifier_list_id, false FROM kit_components kc
     JOIN products p ON p.id = kc.included_product_id
     WHERE kc.kit_product_id = $1 AND p.square_modifier_list_id IS NOT NULL AND NOT p.customizable`,
    [kitProductId]
  );
  return result.rows;
}