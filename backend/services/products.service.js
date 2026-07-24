export async function fetchProductBySlug(slug) {
  // 1. On récupère le produit seul
  const result = await pool.query(
    `
    SELECT p.*, c.name_fr AS collection_name_fr, c.name_en AS collection_name_en
    FROM products p
    JOIN collections c ON c.id = p.collection_id
    WHERE (p.slug_fr = $1 OR p.slug_en = $1);
    `,
    [slug]
  );

  const product = result.rows[0];
  if (!product) return null;

  // 2. On va chercher les couleurs explicitement avec un SELECT séparé pour voir si ça pop
  const colorResult = await pool.query(
    `
    SELECT col.id, col.name_fr, col.name_en, col.hex_code, pcv.price_delta_cents
    FROM product_color_variants pcv
    JOIN colors col ON col.id = pcv.color_id
    WHERE pcv.product_id = $1;
    `,
    [product.id]
  );

  console.log("Couleurs trouvées par la requête séparée :", colorResult.rows);

  return {
    ...product,
    colors: colorResult.rows,
  };
}