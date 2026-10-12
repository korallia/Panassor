-- =========================================
-- Étuis de cuir et ensembles
-- À exécuter UNE fois sur chaque base (locale, sandbox, live RDS),
-- AVANT de déployer le code qui l'utilise.
--
-- 1. L'étui d'un kit = sa variante de couleur (product_color_variants) :
--    « Kit du chirurgien – noir » = l'étui noir du chirurgien. On y ajoute
--    le stock d'étuis et le minimum. Aucune ligne existante n'est
--    modifiée : photos, pastilles, prix et ID Square restent tels quels.
-- 2. Les duos du voleur deviennent des ensembles (composés de pièces
--    existantes). Ce ne sont pas des kits : pas d'étui, pas d'outil au choix.
-- =========================================

ALTER TABLE product_color_variants
  ADD COLUMN IF NOT EXISTS case_stock integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS case_minimum integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN product_color_variants.case_stock IS
  'Kits seulement : étuis de cuir prêts dans cette couleur.';
COMMENT ON COLUMN product_color_variants.case_minimum IS
  'Kits seulement : seuil d''alerte du stock d''étuis.';

-- Composants des duos (par slug : les ID diffèrent d'une base à l'autre).
INSERT INTO kit_components (kit_product_id, included_product_id, quantity, sort_order)
SELECT duo.id, piece.id, 1, x.sort_order
FROM (VALUES
  ('crochet-et-tourne-serrure-voleur', 'crochet-voleur',        0),
  ('crochet-et-tourne-serrure-voleur', 'tourne-serrure-voleur', 1),
  ('cle-vierge-et-lime-voleur',        'cle-vierge-voleur',     0),
  ('cle-vierge-et-lime-voleur',        'lime-voleur',           1)
) AS x(duo_slug, piece_slug, sort_order)
JOIN products duo   ON duo.slug_fr = x.duo_slug
JOIN products piece ON piece.slug_fr = x.piece_slug
ON CONFLICT (kit_product_id, included_product_id) DO NOTHING;

-- Vérification : étuis par kit et composition des ensembles
SELECT 'étui' AS quoi, p.name_fr AS produit, c.name_fr AS detail,
       pcv.case_stock AS stock, pcv.case_minimum AS minimum
FROM product_color_variants pcv
JOIN products p ON p.id = pcv.product_id AND p.is_kit
JOIN colors c ON c.id = pcv.color_id
UNION ALL
SELECT 'ensemble', duo.name_fr, piece.name_fr, kc.quantity, NULL
FROM kit_components kc
JOIN products duo ON duo.id = kc.kit_product_id AND NOT duo.is_kit
JOIN products piece ON piece.id = kc.included_product_id
ORDER BY 1, 2, 3;
