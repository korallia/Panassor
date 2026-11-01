-- =========================================
-- product_color_variants devient product_variants
-- À exécuter UNE fois sur chaque base (Neon d'abord, live RDS à la bascule),
-- avec l'utilisateur principal, APRÈS la 015 et AVANT de déployer le code qui
-- utilise le nouveau nom.
--
-- 1. Retirer case_stock / case_minimum : l'ancien stock des étuis (migration
--    006). Le stock vit dans la table stock depuis la 014 ; plus rien ne les lit.
-- 2. Renommer la table : elle contient des variantes de couleur (étuis des kits)
--    ET des variantes sans couleur (sortes d'aiguilles). Une variante a une
--    couleur OU un nom (label_fr).
-- 3. Pont temporaire : une vue product_color_variants qui pointe vers la
--    nouvelle table, pour que l'ancien code continue de marcher pendant le
--    déploiement. À retirer dans une prochaine migration, une fois le site et
--    l'atelier déployés partout (Render, Vercel, EC2).
--
-- Les droits (atelier_app : lecture) suivent la table renommée.
-- =========================================

-- 1. Anciennes colonnes de stock des étuis ------------------------------
DO $$
BEGIN
  IF to_regclass('public.product_color_variants') IS NOT NULL
     AND (SELECT relkind FROM pg_class WHERE oid = 'public.product_color_variants'::regclass) = 'r' THEN
    ALTER TABLE product_color_variants DROP COLUMN IF EXISTS case_stock, DROP COLUMN IF EXISTS case_minimum;
  END IF;
END
$$;

-- 2. Nouveau nom (et sa séquence, qui portait encore un très vieux nom) ---
DO $$
BEGIN
  IF to_regclass('public.product_variants') IS NULL THEN
    ALTER TABLE product_color_variants RENAME TO product_variants;
  END IF;
  IF to_regclass('public.product_color_prices_id_seq') IS NOT NULL THEN
    ALTER SEQUENCE product_color_prices_id_seq RENAME TO product_variants_id_seq;
  END IF;
END
$$;

-- 3. Pont temporaire pour l'ancien code -----------------------------------
CREATE OR REPLACE VIEW product_color_variants AS SELECT * FROM product_variants;
GRANT SELECT ON product_color_variants TO atelier_app;

-- Vérification : les colonnes de la table, et ses variantes.
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'product_variants'
ORDER BY ordinal_position;
