-- =========================================
-- Choix des aiguilles dans un kit (Square)
-- À exécuter UNE fois sur chaque base (Neon d'abord, live RDS ensuite),
-- avec l'utilisateur principal, AVANT de déployer le code qui l'utilise.
--
-- Les choix restent dans product_options (une seule place). Une option peut
-- maintenant exister deux fois dans Square :
--   square_variation_id → l'option vendue seule (« Aiguilles de suture — 2 courbes »)
--   square_modifier_id  → l'option choisie DANS un kit (même nom que pour les
--                         outils au choix : kit_component_modifiers)
-- Vide pour une option qui n'est pas offerte dans un kit (1 droite, 1 courbe…).
--
-- Le produit garde l'id de SA liste de choix dans Square (une liste par
-- produit, partagée par tous les kits qui le contiennent).
--
-- Après la migration et le déploiement :
--   node backend/scripts/syncProducts.js --modifiers-only
--   node backend/scripts/syncProducts.js --product <slug du kit>
-- (la 2e commande accroche la liste au kit)
-- =========================================

ALTER TABLE product_options
  ADD COLUMN IF NOT EXISTS square_modifier_id text;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS square_modifier_list_id text,
  ADD COLUMN IF NOT EXISTS square_modifier_list_version bigint;

-- Vérification
SELECT table_name, column_name
FROM information_schema.columns
WHERE (table_name = 'product_options' AND column_name = 'square_modifier_id')
   OR (table_name = 'products' AND column_name IN ('square_modifier_list_id', 'square_modifier_list_version'))
ORDER BY table_name, column_name;
