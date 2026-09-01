-- =========================================
-- PACKING / LIVRAISON RÉELLE : poids et dimensions des produits + box_types
-- =========================================
-- Contexte : jusqu'ici le calcul de livraison utilisait un PLACEHOLDER_PARCEL
-- fixe. Ce script ajoute les colonnes de poids/dimensions réelles sur
-- "products" et une nouvelle table "box_types" (extensible, pas hardcodée
-- dans le code) pour que packing.service.js puisse choisir automatiquement
-- la boîte a utiliser.
--
-- Algo choisi (voir packing.service.js) : on additionne le volume "paddé"
-- (L x W x H x marge de sécurité 1.2) de chaque item du panier, puis parmi
-- les box_types dont le volume est >= ce total, on prend celle avec le
-- POIDS le plus bas.
--
-- IMPORTANT : les valeurs plus bas sont des valeurs FAKES / placeholder pour
-- pouvoir tester le calcul avant que les vraies mesures soient prises.
-- Elles sont posées avec COALESCE + WHERE ... IS NULL, donc ce script ne
-- viendra jamais écraser une vraie mesure entrée plus tard -- il ne fait
-- que remplir ce qui est encore vide. Il peut être relancé sans danger
-- (IF NOT EXISTS partout).

-- 1) Nouvelles colonnes sur products -----------------------------------
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_grams INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS length_cm NUMERIC(6,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS width_cm NUMERIC(6,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS height_cm NUMERIC(6,2);

COMMENT ON COLUMN products.weight_grams IS 'Poids réel du produit seul (sans boîte), en grammes.';
COMMENT ON COLUMN products.length_cm IS 'Longueur réelle du produit, en cm.';
COMMENT ON COLUMN products.width_cm IS 'Largeur réelle du produit, en cm.';
COMMENT ON COLUMN products.height_cm IS 'Hauteur réelle du produit, en cm.';

-- 2) Table box_types -----------------------------------------------------
CREATE TABLE IF NOT EXISTS box_types (
  id SERIAL PRIMARY KEY,

  slug VARCHAR(40) NOT NULL UNIQUE,
  name_fr VARCHAR(80) NOT NULL,
  name_en VARCHAR(80),

  weight_grams INTEGER NOT NULL,
  length_cm NUMERIC(6,2) NOT NULL,
  width_cm NUMERIC(6,2) NOT NULL,
  height_cm NUMERIC(6,2) NOT NULL,

  sort_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE box_types IS 'Formats de boîtes d''expédition disponibles. packing.service.js choisit, parmi celles dont le volume suffit, celle avec le poids le plus bas.';

-- 3) Seed des 2 boîtes actuelles (FAKE -- a remplacer par les vraies mesures) --
INSERT INTO box_types (slug, name_fr, name_en, weight_grams, length_cm, width_cm, height_cm, sort_order)
VALUES
  ('petite', 'Petite boîte (outils)', 'Small box (tools)', 150, 30, 20, 15, 1),
  ('grosse', 'Grosse boîte (kits)', 'Large box (kits)', 400, 40, 40, 30, 2)
ON CONFLICT (slug) DO NOTHING;

-- 4) Valeurs FAKE temporaires pour les produits qui n'ont pas encore de
--    vraies mesures -- juste assez pour pouvoir tester le calcul de bout
--    en bout. A REMPLACER par les vraies mesures dès que "Fiche complete
--    d'inventaire" est faite. Ne touche jamais une valeur déjà remplie.
UPDATE products
SET
  weight_grams = COALESCE(weight_grams, CASE WHEN is_kit THEN 800 ELSE 150 END),
  length_cm    = COALESCE(length_cm,    CASE WHEN is_kit THEN 25  ELSE 15  END),
  width_cm     = COALESCE(width_cm,     CASE WHEN is_kit THEN 15  ELSE 8   END),
  height_cm    = COALESCE(height_cm,    CASE WHEN is_kit THEN 10  ELSE 5   END)
WHERE weight_grams IS NULL
   OR length_cm IS NULL
   OR width_cm IS NULL
   OR height_cm IS NULL;
