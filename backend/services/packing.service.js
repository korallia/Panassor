import pool from "../db/pool.js";

// Computes the real parcel (weight + box) needed to ship a cart, instead
// of the flat PLACEHOLDER_PARCEL every quote used before. Uses each
// product's real weight/dimensions (once measured -- see the "Fiche
// complete d'inventaire" to-do) and picks the smallest available box
// type that's big enough, per Korallia's design:
//   1. sum every item's (padded) volume -> total volume needed
//   2. among box_types whose volume >= that total, take the lightest
//      (not necessarily the smallest -- weight is what the carriers
//      actually charge for)
//   3. total shipping weight = sum of product weights + that box's own
//      (empty) weight
// While ANY product in the cart is missing real weight/dimensions, this
// returns null and the caller falls back to the old flat placeholder --
// safer than silently shipping a wrong weight for an unmeasured product.

// Real items never pack with 0% wasted space (irregular shapes, tool
// handles, etc.), so this pads each product's raw L*W*H volume before
// summing rather than assuming a perfect tessellation. Placeholder
// value -- revisit once there's enough real packed-order data to
// calibrate it properly.
const VOLUME_SAFETY_MARGIN = 1.2;

function computeVolumeCm3({ length_cm, width_cm, height_cm }) {
  return Number(length_cm || 0) * Number(width_cm || 0) * Number(height_cm || 0);
}

async function getProductsPackingInfoById(productIds) {
  if (!productIds.length) {
    return new Map();
  }

  const result = await pool.query(
    `SELECT id, weight_grams, length_cm, width_cm, height_cm
     FROM products
     WHERE id = ANY($1::int[])`,
    [productIds]
  );

  return new Map(result.rows.map((row) => [row.id, row]));
}

async function getBoxTypesBySortOrder() {
  const result = await pool.query(
    `SELECT slug, weight_grams, length_cm, width_cm, height_cm
     FROM box_types
     ORDER BY sort_order ASC`
  );

  return result.rows;
}

function hasCompletePackingInfo(product) {
  return Boolean(
    product &&
      product.weight_grams &&
      product.length_cm &&
      product.width_cm &&
      product.height_cm
  );
}

/**
 * @param {Array<{productId: number|string, quantity?: number}>} items
 * @returns {Promise<{weightKg: number, dimensionsCm: {length:number,width:number,height:number}, boxSlug: string} | null>}
 *   null means "we don't have enough real data yet -- use the flat placeholder instead".
 */
export async function computeParcelForCartItems(items = []) {
  const normalizedItems = (Array.isArray(items) ? items : [])
    .map((item) => ({
      productId: Number(item?.productId),
      quantity: Number(item?.quantity) > 0 ? Math.floor(Number(item.quantity)) : 1,
    }))
    .filter((item) => Number.isFinite(item.productId) && item.productId > 0);

  if (!normalizedItems.length) {
    return null;
  }

  const productIds = [...new Set(normalizedItems.map((item) => item.productId))];

  const [productsById, boxTypes] = await Promise.all([
    getProductsPackingInfoById(productIds),
    getBoxTypesBySortOrder(),
  ]);

  if (!boxTypes.length) {
    console.error("computeParcelForCartItems: no box_types configured -- falling back to placeholder parcel.");
    return null;
  }

  let totalWeightGrams = 0;
  let totalVolumeCm3 = 0;

  for (const item of normalizedItems) {
    const product = productsById.get(item.productId);

    if (!hasCompletePackingInfo(product)) {
      // Missing real measurements for at least one cart item -- don't
      // guess a partial total, just bail out to the flat placeholder for
      // the whole quote.
      return null;
    }

    totalWeightGrams += Number(product.weight_grams) * item.quantity;
    totalVolumeCm3 += computeVolumeCm3(product) * VOLUME_SAFETY_MARGIN * item.quantity;
  }

  const fittingBoxes = boxTypes
    .filter((box) => computeVolumeCm3(box) >= totalVolumeCm3)
    .sort((a, b) => Number(a.weight_grams) - Number(b.weight_grams));

  let chosenBox = fittingBoxes[0];

  if (!chosenBox) {
    // Order is bigger than even our largest box -- flag it loudly (this
    // needs a human to split into multiple shipments) and fall back to
    // the largest box as a rough estimate rather than crashing the quote.
    chosenBox = boxTypes.reduce((largest, box) =>
      computeVolumeCm3(box) > computeVolumeCm3(largest) ? box : largest
    );
    console.error(
      `computeParcelForCartItems: order needs ~${Math.round(totalVolumeCm3)}cm³, bigger than the largest box type "${chosenBox.slug}" (${Math.round(computeVolumeCm3(chosenBox))}cm³). Using it anyway as a rough estimate -- this order likely needs multiple boxes in reality.`
    );
  }

  return {
    weightKg: (totalWeightGrams + Number(chosenBox.weight_grams)) / 1000,
    dimensionsCm: {
      length: Number(chosenBox.length_cm),
      width: Number(chosenBox.width_cm),
      height: Number(chosenBox.height_cm),
    },
    boxSlug: chosenBox.slug,
  };
}
