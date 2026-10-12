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

// is_letter = une enveloppe (Poste-lettres) : jamais utilisée pour un colis.
async function getBoxTypesBySortOrder({ letter = false } = {}) {
  const result = await pool.query(
    `SELECT slug, weight_grams, length_cm, width_cm, height_cm, max_weight_grams
     FROM box_types
     WHERE is_letter = $1
     ORDER BY sort_order ASC`,
    [letter]
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

function normalizeItems(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => ({
      productId: Number(item?.productId),
      quantity: Number(item?.quantity) > 0 ? Math.floor(Number(item.quantity)) : 1,
    }))
    .filter((item) => Number.isFinite(item.productId) && item.productId > 0);
}

// Un ensemble (ex. clé vierge + lime) n'a pas de mesures à lui : on le
// compte comme ses pièces. Les kits gardent leurs propres mesures (étui).
async function expandEnsembles(items) {
  const result = await pool.query(
    `SELECT kc.kit_product_id, kc.included_product_id, kc.quantity
     FROM kit_components kc
     JOIN products ensemble ON ensemble.id = kc.kit_product_id AND ensemble.is_kit = false
     WHERE kc.kit_product_id = ANY($1::int[])`,
    [[...new Set(items.map((item) => item.productId))]]
  );

  if (!result.rows.length) return items;

  return items.flatMap((item) => {
    const pieces = result.rows.filter((row) => row.kit_product_id === item.productId);
    return pieces.length
      ? pieces.map((piece) => ({
          productId: piece.included_product_id,
          quantity: piece.quantity * item.quantity,
        }))
      : [item];
  });
}

/**
 * @param {Array<{productId: number|string, quantity?: number}>} items
 * @returns {Promise<{weightKg: number, dimensionsCm: {length:number,width:number,height:number}, boxSlug: string} | null>}
 *   null means "we don't have enough real data yet -- use the flat placeholder instead".
 */
export async function computeParcelForCartItems(items = []) {
  const normalizedItems = await expandEnsembles(normalizeItems(items));

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

// Poste-lettres : même calcul que pour une boîte (poids et volume), avec
// une seule règle de plus : chaque pièce doit être assez mince pour
// l'enveloppe (sinon une spatule y entrerait « en volume »).
export async function isEnvelopeCart(items = []) {
  const list = await expandEnsembles(normalizeItems(items));

  if (!list.length) return false;

  const [productsById, envelopes] = await Promise.all([
    getProductsPackingInfoById([...new Set(list.map((item) => item.productId))]),
    getBoxTypesBySortOrder({ letter: true }),
  ]);
  const envelope = envelopes[0];

  if (!envelope) return false;

  let totalGrams = Number(envelope.weight_grams);
  let totalVolumeCm3 = 0;

  for (const item of list) {
    const product = productsById.get(item.productId);

    if (!hasCompletePackingInfo(product)) return false;

    const thickness = Math.min(
      Number(product.length_cm),
      Number(product.width_cm),
      Number(product.height_cm)
    );
    if (thickness > Number(envelope.height_cm)) return false;

    totalGrams += Number(product.weight_grams) * item.quantity;
    totalVolumeCm3 += computeVolumeCm3(product) * VOLUME_SAFETY_MARGIN * item.quantity;
  }

  return (
    totalVolumeCm3 <= computeVolumeCm3(envelope) &&
    (!envelope.max_weight_grams || totalGrams <= Number(envelope.max_weight_grams))
  );
}
