import { getLocalizedValue, normalizeLanguage } from "../utils/language.js";
import db from "../db/pool.js";

export function getCartItemName(item, language = "fr") {
  return (
    getLocalizedValue(item?.displaySnapshot, "name", language) ||
    getLocalizedValue(item, "name", language) ||
    getLocalizedValue(item, "title", language) ||
    item?.displaySnapshot?.name ||
    item?.name ||
    item?.title ||
    "Produit Panassor"
  );
}

export function getCartItemPriceCents(item) {
  return Number(
    item?.displaySnapshot?.priceCents ??
      item?.displaySnapshot?.price_cents ??
      item?.priceCents ??
      item?.price_cents ??
      0
  );
}

export function getCartItemQuantity(item) {
  const quantity = Number(item?.quantity || 1);

  if (!Number.isFinite(quantity) || quantity < 1) {
    return 1;
  }

  return Math.floor(quantity);
}

export function getCartItemColorName(item, language = "fr") {
  const normalizedLanguage = normalizeLanguage(language);

  return (
    item?.[`colorName_${normalizedLanguage}`] ||
    item?.colorName ||
    item?.color_name ||
    item?.colorKey ||
    ""
  );
}

export function getSelectedItemName(selectedItem, language = "fr") {
  return (
    getLocalizedValue(selectedItem?.displaySnapshot, "name", language) ||
    getLocalizedValue(selectedItem, "name", language) ||
    getLocalizedValue(selectedItem, "title", language) ||
    selectedItem?.displaySnapshot?.name ||
    selectedItem?.name ||
    selectedItem?.title ||
    selectedItem?.productName ||
    ""
  );
}

export function normalizeSelectedItems(selectedItems = [], language = "fr") {
  const normalizedLanguage = normalizeLanguage(language);

  if (!Array.isArray(selectedItems)) {
    return [];
  }

  return selectedItems
    .map((selectedItem) => {
      const name = getSelectedItemName(selectedItem, normalizedLanguage);

      if (!name) {
        return null;
      }

      return {
        productId: selectedItem?.productId || null,
        kitComponentId: selectedItem?.kitComponentId || null,
        productSlug:
          selectedItem?.productSlug ||
          selectedItem?.[`productSlug_${normalizedLanguage}`] ||
          selectedItem?.productSlug_fr ||
          selectedItem?.productSlug_en ||
          null,
        name,
      };
    })
    .filter(Boolean);
}

export function buildCartItemNote(item, language = "fr") {
  const normalizedLanguage = normalizeLanguage(language);
  const notes = [];

  if (item?.type) {
    notes.push(
      normalizedLanguage === "en" ? `Type: ${item.type}` : `Type : ${item.type}`
    );
  }

  const colorName = getCartItemColorName(item, normalizedLanguage);

  if (colorName) {
    notes.push(
      normalizedLanguage === "en"
        ? `Color: ${colorName}`
        : `Couleur : ${colorName}`
    );
  }

  const optionName =
    item?.[`optionName_${normalizedLanguage}`] || item?.optionName_fr || null;

  if (optionName) {
    notes.push(
      normalizedLanguage === "en" ? `Option: ${optionName}` : `Option : ${optionName}`
    );
  }

  const selectedItems = normalizeSelectedItems(
    item?.selectedItems,
    normalizedLanguage
  );

  if (selectedItems.length > 0) {
    const selectedNames = selectedItems.map((selectedItem) => selectedItem.name);

    notes.push(
      normalizedLanguage === "en"
        ? `Selected tools: ${selectedNames.join(", ")}`
        : `Outils choisis : ${selectedNames.join(", ")}`
    );
  }

  return notes.join(" | ");
}

export function normalizeCartItem(item, language = "fr") {
  const normalizedLanguage = normalizeLanguage(language);
  const name = getCartItemName(item, normalizedLanguage);
  const quantity = getCartItemQuantity(item);
  const unitPriceCents = getCartItemPriceCents(item);
  const colorName = getCartItemColorName(item, normalizedLanguage);
  const selectedItems = normalizeSelectedItems(
    item?.selectedItems,
    normalizedLanguage
  );

  return {
    productId: item?.productId || null,
    productSlug: item?.productSlug || null,
    cartKey: item?.cartKey || null,
    type: item?.type || "product",

    name,
    quantity,
    unitPriceCents,
    totalPriceCents: unitPriceCents * quantity,

    colorKey: item?.colorKey || null,
    colorName,

    optionId: item?.optionId ?? null,
    optionQuantity: item?.optionQuantity ?? null,
    optionName:
      item?.[`optionName_${normalizedLanguage}`] || item?.optionName_fr || null,

    selectedItems,
    note: buildCartItemNote(item, normalizedLanguage),
  };
}

export function validateCheckoutItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Le panier est vide.");
  }

  for (const item of items) {
    if (!item.name) {
      throw new Error("Un produit du panier n'a pas de nom.");
    }

    if (!Number.isFinite(item.quantity) || item.quantity < 1) {
      throw new Error(`Quantité invalide pour ${item.name}.`);
    }

    if (!Number.isFinite(item.unitPriceCents) || item.unitPriceCents < 1) {
      throw new Error(`Prix invalide pour ${item.name}.`);
    }
  }
}

async function resolveVariationCatalogId(item) {
  if (!item.productId) return null;

  // Produit à options : la variation Square de l'option choisie (son prix).
  if (item.optionId != null) {
    const result = await db.query(
      `SELECT square_variation_id FROM product_options WHERE id = $1 AND product_id = $2`,
      [Number(item.optionId), item.productId]
    );
    return result.rows[0]?.square_variation_id || null;
  }

  const colorId = item.colorKey != null ? Number(item.colorKey) : null;

  if (colorId != null && Number.isFinite(colorId)) {
    const result = await db.query(
      `SELECT square_variation_id FROM product_color_variants WHERE product_id = $1 AND color_id = $2`,
      [item.productId, colorId]
    );
    if (result.rows[0]?.square_variation_id) {
      return result.rows[0].square_variation_id;
    }
  }

  const productResult = await db.query(
    `SELECT square_default_variation_id FROM products WHERE id = $1`,
    [item.productId]
  );
  return productResult.rows[0]?.square_default_variation_id || null;
}

async function resolveModifierCatalogId(selectedItem) {
  if (!selectedItem.kitComponentId || !selectedItem.productId) return null;

  const result = await db.query(
    `SELECT square_modifier_id FROM kit_component_modifiers WHERE kit_component_id = $1 AND tool_product_id = $2`,
    [selectedItem.kitComponentId, selectedItem.productId]
  );
  return result.rows[0]?.square_modifier_id || null;
}

export async function buildSquareModifiers(item) {
  if (!Array.isArray(item.selectedItems) || item.selectedItems.length === 0) {
    return [];
  }

  const modifiers = [];

  for (const selectedItem of item.selectedItems) {
    const catalogId = await resolveModifierCatalogId(selectedItem);

    if (catalogId) {
      modifiers.push({ catalog_object_id: catalogId, quantity: "1" });
    } else {
      console.warn(
        `>>> Pas de mapping trouvé pour selectedItem (kitComponentId=${selectedItem.kitComponentId}, productId=${selectedItem.productId}), fallback ad hoc`
      );
      modifiers.push({
        name: selectedItem.name,
        quantity: "1",
        base_price_money: { amount: 0, currency: "CAD" },
      });
    }
  }

  return modifiers;
}

export async function buildSquareLineItems(items) {
  const lineItems = [];

  for (const item of items) {
    const catalogObjectId = await resolveVariationCatalogId(item);
    const modifiers = await buildSquareModifiers(item);

    if (catalogObjectId) {
      const lineItem = {
        quantity: String(item.quantity),
        catalog_object_id: catalogObjectId,
      };

      if (modifiers.length > 0) {
        lineItem.modifiers = modifiers;
      }

      if (item.note) {
        lineItem.note = item.note;
      }

      lineItems.push(lineItem);
    } else {
      // Securite (rapport d'architecture 2026-09-26, point 1) : on ne cree
      // JAMAIS de ligne "libre" au prix envoye par le navigateur -- n'importe
      // qui pourrait fabriquer une requete a 0,01 $. Chaque article doit
      // correspondre a une variante du catalogue Square, dont Square
      // applique lui-meme le prix.
      console.warn(
        `>>> Checkout refuse : aucune variante Square pour productId=${item.productId} (${item.name})`
      );

      const error = new Error(
        `« ${item.name} » n'est plus disponible. Retire-le du panier et réessaie.`
      );
      error.status = 409;
      error.code = "PRODUCT_UNAVAILABLE";
      throw error;
    }
  }

  return lineItems;
}