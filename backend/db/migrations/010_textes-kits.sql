-- =========================================
-- Textes des trois kits : dire qu'ils contiennent tous les outils de leur
-- collection, en gardant le ton d'origine (même formule pour les trois).
-- À exécuter UNE fois sur chaque base. Seulement du texte.
-- La description longue est vidée : la page du kit affiche la courte.
-- =========================================

UPDATE products p
SET description_fr = x.description_fr,
    description_en = x.description_en,
    long_description_fr = NULL,
    long_description_en = NULL
FROM (VALUES
  ('kit-chirurgien',
   'Une trousse complète faite main, garnie de tous les outils de la collection, pour enrichir vos scènes de soin, d’urgence et d’intervention médicale.',
   'A complete handmade pouch, filled with every tool in the collection, designed to enrich your healing, emergency, and medical intervention scenes.'),
  ('kit-tortionnaire',
   'Une trousse complète faite main, garnie de tous les outils de la collection, pour enrichir vos scènes d’interrogatoire musclé.',
   'A complete handmade pouch, filled with every tool in the collection, designed to enrich your intense interrogation scenes.'),
  ('kit-du-voleur',
   'Une trousse complète faite main, garnie de tous les outils de la collection, pour enrichir vos scènes de vol, de cambriolage et d’infiltration.',
   'A complete handmade pouch, filled with every tool in the collection, designed to enrich your theft, burglary, and infiltration scenes.')
) AS x(slug, description_fr, description_en)
WHERE p.slug_fr = x.slug;

-- Vérification
SELECT slug_fr, description_fr FROM products WHERE is_kit ORDER BY id;
