import { getLocalizedValue, normalizeLanguage } from "../utils/language.js";

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
      throw new Error("Un produit du panier n’a pas de nom.");
    }

    if (!Number.isFinite(item.quantity) || item.quantity < 1) {
      throw new Error(`Quantité invalide pour ${item.name}.`);
    }

    if (!Number.isFinite(item.unitPriceCents) || item.unitPriceCents < 1) {
      throw new Error(`Prix invalide pour ${item.name}.`);
    }
  }
}

export function buildSquareModifiers(item) {
  if (!Array.isArray(item.selectedItems) || item.selectedItems.length === 0) {
    return [];
  }

  return item.selectedItems.map((selectedItem) => ({
    name: selectedItem.name,
    quantity: "1",
    base_price_money: {
      amount: 0,
      currency: "CAD",
    },
  }));
}

export function buildSquareLineItems(items) {
  return items.map((item) => {
    const lineItem = {
      name: item.name,
      quantity: String(item.quantity),
      base_price_money: {
        amount: item.unitPriceCents,
        currency: "CAD",
      },
    };

    if (item.colorName) {
      lineItem.variation_name = item.colorName;
    }

    const modifiers = buildSquareModifiers(item);

    if (modifiers.length > 0) {
      lineItem.modifiers = modifiers;
    }

    if (item.note) {
      lineItem.note = item.note;
    }

    return lineItem;
  });
}