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

INSERT INTO product_options (product_id, label_fr, label_en, price_cents, sort_order)
SELECT p.id, x.label_fr, x.label_en, x.price_cents, x.sort_order
FROM (VALUES
  ('aiguilles-suture',  '1 droite',              '1 straight',             1200, 0),
  ('aiguilles-suture',  '1 courbe',              '1 curved',               1200, 1),
  ('aiguilles-suture',  '2 pareilles',           '2 matching',             2000, 2),
  ('aiguilles-suture',  '2 différentes',         '2 different',            2000, 3),
  ('aiguilles-douleur', '1 aiguille',            '1 needle',               1800, 0),
  ('aiguilles-douleur', '2 aiguilles',           '2 needles',              3000, 1)
) AS x(slug, label_fr, label_en, price_cents, sort_order)
JOIN products p ON p.slug_fr = x.slug
ON CONFLICT (product_id, label_fr) DO NOTHING;

-- Vérification
SELECT p.name_fr, o.label_fr, o.label_en, (o.price_cents / 100.0)::numeric(10,2) AS prix
FROM product_options o
JOIN products p ON p.id = o.product_id
ORDER BY p.name_fr, o.sort_order;
