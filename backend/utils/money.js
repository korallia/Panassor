export function calculateSubtotalCents(items) {
  return items.reduce((total, item) => total + item.totalPriceCents, 0);
}

export function calculateTaxCents(subtotalCents) {
  const gstCents = Math.round(subtotalCents * 0.05);
  const qstCents = Math.round(subtotalCents * 0.09975);

  return gstCents + qstCents;
}

export function calculateTotalCents(subtotalCents, taxCents) {
  return subtotalCents + taxCents;
}