-- =========================================
-- Historique du stock et minimums
-- À exécuter UNE fois sur chaque base (Neon d'abord, live RDS à la bascule),
-- avec l'utilisateur principal, APRÈS la 016 et AVANT de déployer le code
-- de l'atelier qui l'utilise.
--
-- 1. stock_reason : les raisons possibles d'un mouvement (liste fermée).
--      fabrication : pièces faites à l'atelier (+)
--      perte       : cassée, perdue, défectueuse (−)
--      correction  : on corrige le chiffre après un recompte (+ ou −)
--      vente       : retirée par une vente Square (−) — servira à l'étape 4
-- 2. stock_movements : l'historique. Une ligne par changement de stock :
--    quelle pièce, combien, le stock après, la raison, qui, la note, quand.
--    L'atelier peut AJOUTER des lignes, jamais les modifier ni les effacer.
-- 3. minimums : les seuils d'alerte, une ligne par chose qui en a un :
--      outil / pièce / paquet → minimum libre (le produit)
--      kit                   → minimum de kits prêts (le produit kit)
--      étui                  → minimum par couleur (le kit + sa variante)
--      ensemble              → nombre d'ensembles à pouvoir faire
--    Pas de ligne = minimum 0.
-- =========================================

-- 1. Raisons ----------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stock_reason') THEN
    CREATE TYPE stock_reason AS ENUM ('fabrication', 'perte', 'correction', 'vente');
  END IF;
END
$$;

-- 2. Historique -------------------------------------------------------
CREATE TABLE IF NOT EXISTS stock_movements (
  id bigserial PRIMARY KEY,
  stock_id integer NOT NULL REFERENCES stock(id) ON DELETE CASCADE,
  change integer NOT NULL CHECK (change <> 0),   -- +3, -1…
  quantity_after integer NOT NULL,               -- le stock juste après
  reason stock_reason NOT NULL,
  atelier_user_id integer REFERENCES atelier_users(id) ON DELETE SET NULL,  -- vide = Square / système
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS stock_movements_par_piece ON stock_movements (stock_id, created_at DESC);
CREATE INDEX IF NOT EXISTS stock_movements_par_date ON stock_movements (created_at DESC);

-- 3. Minimums ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS minimums (
  id serial PRIMARY KEY,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id integer REFERENCES product_variants(id) ON DELETE CASCADE,
  minimum integer NOT NULL DEFAULT 0 CHECK (minimum >= 0),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
-- Une seule ligne par produit (sans variante) et par variante.
CREATE UNIQUE INDEX IF NOT EXISTS minimums_un_par_produit ON minimums (product_id) WHERE variant_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS minimums_un_par_variante ON minimums (variant_id) WHERE variant_id IS NOT NULL;

-- 4. Droits de l'atelier ----------------------------------------------
GRANT SELECT, INSERT ON stock_movements TO atelier_app;
GRANT USAGE ON SEQUENCE stock_movements_id_seq TO atelier_app;
GRANT SELECT, INSERT ON minimums TO atelier_app;
GRANT UPDATE (minimum, updated_at) ON minimums TO atelier_app;
GRANT USAGE ON SEQUENCE minimums_id_seq TO atelier_app;

-- Vérification : les deux nouvelles tables et les droits de l'atelier.
SELECT table_name, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS droits_atelier
FROM information_schema.role_table_grants
WHERE grantee = 'atelier_app' AND table_name IN ('stock', 'stock_movements', 'minimums')
GROUP BY table_name
ORDER BY table_name;
