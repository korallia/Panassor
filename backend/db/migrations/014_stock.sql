-- =========================================
-- Stock dans la base : ajouter et retirer depuis l'atelier
-- À exécuter UNE fois sur chaque base (Neon d'abord, live RDS à la bascule),
-- avec l'utilisateur principal (celui du site), AVANT de déployer le code
-- de l'atelier qui l'utilise.
--
-- stock : une ligne par chose qu'on compte.
--   outil / pièce   → le produit (variant_id vide)
--   étui d'un kit   → la variante de couleur du kit
-- Les ensembles (duos) n'ont pas de stock : ils sont faits de pièces.
--
-- Les étuis reprennent case_stock. Cette colonne reste en place jusqu'à la
-- bascule, puis sera retirée.
-- =========================================

CREATE TABLE IF NOT EXISTS stock (
  id serial PRIMARY KEY,
  collection_id integer REFERENCES collections(id) ON DELETE SET NULL,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id integer REFERENCES product_color_variants(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
-- Une seule ligne par produit (sans variante) et par variante.
CREATE UNIQUE INDEX IF NOT EXISTS stock_un_par_produit ON stock (product_id) WHERE variant_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS stock_un_par_variante ON stock (variant_id) WHERE variant_id IS NOT NULL;

-- Produits avec variantes de couleur (les kits) : une ligne par étui.
INSERT INTO stock (collection_id, product_id, variant_id, quantity)
SELECT p.collection_id, p.id, v.id, v.case_stock
FROM products p
JOIN product_color_variants v ON v.product_id = p.id
WHERE NOT EXISTS (SELECT 1 FROM kit_components kc WHERE kc.kit_product_id = p.id AND NOT p.is_kit)
ON CONFLICT DO NOTHING;

-- Produits sans variante : une ligne pour le produit (sauf les ensembles).
INSERT INTO stock (collection_id, product_id, quantity)
SELECT p.collection_id, p.id, 0
FROM products p
WHERE NOT EXISTS (SELECT 1 FROM product_color_variants v WHERE v.product_id = p.id)
  AND NOT EXISTS (SELECT 1 FROM kit_components kc WHERE kc.kit_product_id = p.id AND NOT p.is_kit)
ON CONFLICT DO NOTHING;

-- Droits de l'atelier : lire le stock et changer la quantité, rien d'autre.
GRANT SELECT ON stock TO atelier_app;
GRANT UPDATE (quantity, updated_at) ON stock TO atelier_app;

-- Vérification : ce qu'on compte.
SELECT p.name_fr AS produit, coalesce(c.name_fr, '—') AS etui, s.quantity AS stock
FROM stock s
JOIN products p ON p.id = s.product_id
LEFT JOIN product_color_variants v ON v.id = s.variant_id
LEFT JOIN colors c ON c.id = v.color_id
ORDER BY p.name_fr, c.name_fr;
