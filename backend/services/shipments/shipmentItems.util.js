// Petits outils partagés sur le contenu d'un envoi (panier, quantités,
// résumé des articles). Utilisés par la création d'envoi, Discord et le
// courriel de suivi.

export function normalizeCartSnapshot(cartSnapshot) {
  if (Array.isArray(cartSnapshot)) {
    return cartSnapshot;
  }

  if (typeof cartSnapshot === "string") {
    try {
      const parsedCartSnapshot = JSON.parse(cartSnapshot);
      return Array.isArray(parsedCartSnapshot) ? parsedCartSnapshot : [];
    } catch {
      return [];
    }
  }

  return [];
}

export function normalizeQuantity(quantity) {
  const parsedQuantity = Number(quantity);

  if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
    return 1;
  }

  return Math.floor(parsedQuantity);
}

// Groups flat shipment_items rows (parents + selected-item children)
// back into one entry per top-level item, the way orders.service.js /
// shipments.service.js store them.
export function buildItemSummaries(shipmentItems = []) {
  const topLevelItems = shipmentItems.filter(
    (item) => !item.parent_shipment_item_id
  );

  return topLevelItems.map((item) => ({
    quantity: item.quantity,
    name: item.name,
    colorName: item.color_name,
    selectedItemNames: shipmentItems
      .filter((child) => child.parent_shipment_item_id === item.id)
      .map((child) => child.name),
  }));
}
