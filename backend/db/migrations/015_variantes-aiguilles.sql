-- =========================================
-- Aiguilles de suture : stock par sorte, et ce que retire chaque option
-- À exécuter UNE fois sur chaque base (Neon d'abord, live RDS à la bascule),
-- avec l'utilisateur principal (celui du site), APRÈS la 014 et AVANT de
-- déployer le code qui l'utilise.
--
-- 1. Variantes sans couleur : elles servent SEULEMENT au stock.
--      aiguilles de suture → Droite, Courbe
--    Les aiguilles de douleur n'ont qu'une sorte : pas de variante, leur stock
--    reste sur le produit.
--    Le site ne les affiche pas (il ne lit que les variantes AVEC couleur)
--    et la synchro Square les ignore.
-- 2. product_options.variant_ids : ce que retire chaque option. Une variante
--    est répétée autant de fois qu'il y en a :
--      2 courbes = [Courbe, Courbe] ; 1 droite + 1 courbe = [Droite, Courbe].
--    Liste vide (aiguilles de douleur) : l'option retire « quantity » pièces
--    du stock du produit (1 aiguille = 1, 2 aiguilles = 2).
--    Règle : si un produit a des options, on vend ses options, jamais ses variantes.
-- 3. Stock : les aiguilles de suture se comptent maintenant par sorte.
--    Droites et courbes partent à 0. Il faut les RECOMPTER une fois (on ne peut
--    pas deviner comment le chiffre actuel se partage).
-- =========================================

-- 1. Variantes sans couleur -------------------------------------------
ALTER TABLE product_color_variants
  ADD COLUMN IF NOT EXISTS label_fr text,
  ADD COLUMN IF NOT EXISTS label_en text;

-- Une variante a une couleur OU un nom. NOT VALID : les anciennes lignes ne sont pas revérifiées.
ALTER TABLE product_color_variants DROP CONSTRAINT IF EXISTS product_color_variants_couleur_ou_nom;
ALTER TABLE product_color_variants
  ADD CONSTRAINT product_color_variants_couleur_ou_nom
  CHECK (color_id IS NOT NULL OR label_fr IS NOT NULL) NOT VALID;

CREATE UNIQUE INDEX IF NOT EXISTS product_color_variants_produit_nom
  ON product_color_variants (product_id, label_fr) WHERE label_fr IS NOT NULL;

-- ORDER BY : les id suivent cet ordre, c'est l'ordre d'affichage (Droite avant Courbe).
INSERT INTO product_color_variants (product_id, label_fr, label_en)
SELECT p.id, x.label_fr, x.label_en
FROM (VALUES
  (1, 'aiguilles-suture',  'Droite',   'Straight'),
  (2, 'aiguilles-suture',  'Courbe',   'Curved')
) AS x(ord, slug, label_fr, label_en)
JOIN products p ON p.slug_fr = x.slug
ORDER BY x.ord
ON CONFLICT (product_id, label_fr) WHERE label_fr IS NOT NULL DO NOTHING;

-- 2. Ce que retire chaque option --------------------------------------
ALTER TABLE product_options
  ADD COLUMN IF NOT EXISTS variant_ids integer[] NOT NULL DEFAULT '{}';

UPDATE product_options o
SET variant_ids = (
  SELECT array_agg(v.id ORDER BY t.ord)
  FROM unnest(x.labels) WITH ORDINALITY AS t(label, ord)
  JOIN product_color_variants v ON v.product_id = o.product_id AND v.label_fr = t.label
)
FROM (VALUES
  ('1 droite',            ARRAY['Droite']),
  ('1 courbe',            ARRAY['Courbe']),
  ('2 droites',           ARRAY['Droite', 'Droite']),
  ('2 courbes',           ARRAY['Courbe', 'Courbe']),
  ('1 droite + 1 courbe', ARRAY['Droite', 'Courbe'])
) AS x(option_label, labels)
WHERE o.label_fr = x.option_label;

-- 3. Stock par sorte --------------------------------------------------
-- Suture : la ligne du produit est remplacée par une ligne par sorte, à 0 (à recompter).
DELETE FROM stock s
USING products p
WHERE p.slug_fr = 'aiguilles-suture' AND s.product_id = p.id AND s.variant_id IS NULL;

INSERT INTO stock (collection_id, product_id, variant_id, quantity)
SELECT p.collection_id, p.id, v.id, 0
FROM product_color_variants v
JOIN products p ON p.id = v.product_id
WHERE v.label_fr IS NOT NULL
ORDER BY v.id
ON CONFLICT DO NOTHING;

-- Vérification : le stock des aiguilles, et ce que retire chaque option.
SELECT 'stock' AS quoi, p.name_fr AS produit, v.label_fr AS detail, s.quantity::text AS valeur
FROM stock s
JOIN products p ON p.id = s.product_id
LEFT JOIN product_color_variants v ON v.id = s.variant_id
WHERE p.slug_fr IN ('aiguilles-suture', 'aiguilles-douleur')
UNION ALL
SELECT 'option', p.name_fr, o.label_fr,
       (SELECT string_agg(v.label_fr, ' + ' ORDER BY t.ord)
        FROM unnest(o.variant_ids) WITH ORDINALITY AS t(id, ord)
        JOIN product_color_variants v ON v.id = t.id)
FROM product_options o
JOIN products p ON p.id = o.product_id
ORDER BY 1 DESC, 2, 3;
