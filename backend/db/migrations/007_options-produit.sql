-- =========================================
-- Options de produit (ex. aiguilles : 1 ou 2, droite ou courbe)
-- À exécuter UNE fois sur chaque base (locale, sandbox, live RDS),
-- AVANT de déployer le code qui l'utilise.
--
-- Une option = un choix sur la page du produit, avec son propre prix.
-- Sur Square, chaque option devient une variation de l'article (c'est
-- Square qui applique le prix au paiement). Après la migration, relancer
-- la synchro Square pour ces produits :
--   node backend/scripts/syncProducts.js
-- =========================================

CREATE TABLE IF NOT EXISTS product_options (
  id serial PRIMARY KEY,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label_fr text NOT NULL,
  label_en text NOT NULL,
  price_cents integer NOT NULL CHECK (price_cents > 0),
  sort_order integer NOT NULL DEFAULT 0,
  square_variation_id text,
  square_variation_version bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (product_id, label_fr)
);

-- Sur la page : un menu « 1 ou 2 » (quantity), puis des pastilles pour
-- les options de cette quantité (icon = le dessin de la pastille).
ALTER TABLE product_options
  ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS icon text;

-- Première version (déjà lancée sur Neon) : remplacée par 2 droites /
-- 2 courbes / 1 droite + 1 courbe.
DELETE FROM product_options WHERE label_fr IN ('2 pareilles', '2 différentes');

INSERT INTO product_options (product_id, label_fr, label_en, price_cents, sort_order, quantity, icon)
SELECT p.id, x.label_fr, x.label_en, x.price_cents, x.sort_order, x.quantity, x.icon
FROM (VALUES
  ('aiguilles-suture',  '1 droite',             '1 straight',             1200, 0, 1, 'droite'),
  ('aiguilles-suture',  '1 courbe',             '1 curved',               1200, 1, 1, 'courbe'),
  ('aiguilles-suture',  '2 droites',            '2 straight',             2000, 2, 2, 'droite-droite'),
  ('aiguilles-suture',  '2 courbes',            '2 curved',               2000, 3, 2, 'courbe-courbe'),
  ('aiguilles-suture',  '1 droite + 1 courbe',  '1 straight + 1 curved',  2000, 4, 2, 'droite-courbe'),
  ('aiguilles-douleur', '1 aiguille',           '1 needle',               1800, 0, 1, NULL),
  ('aiguilles-douleur', '2 aiguilles',          '2 needles',              3000, 1, 2, NULL)
) AS x(slug, label_fr, label_en, price_cents, sort_order, quantity, icon)
JOIN products p ON p.slug_fr = x.slug
ON CONFLICT (product_id, label_fr) DO UPDATE SET
  label_en = EXCLUDED.label_en,
  price_cents = EXCLUDED.price_cents,
  sort_order = EXCLUDED.sort_order,
  quantity = EXCLUDED.quantity,
  icon = EXCLUDED.icon;

-- Vérification
SELECT p.name_fr, o.quantity, o.label_fr, o.icon, (o.price_cents / 100.0)::numeric(10,2) AS prix
FROM product_options o
JOIN products p ON p.id = o.product_id
ORDER BY p.name_fr, o.quantity, o.sort_order;
