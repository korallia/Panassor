-- =========================================
-- Mesures des produits du voleur + texte des aiguilles de suture
-- À exécuter UNE fois sur chaque base (locale, sandbox, live RDS).
-- Seulement des données : rien à déployer avec.
--
-- Sans mesures, le calcul de livraison prenait le colis de remplacement
-- (taille et poids d'un kit, 1,1 kg) pour n'importe quel article du voleur.
-- Mesures données par Korallia le 2026-10-12 :
--   - outils : pareils à ceux du chirurgien (23 g, 18 x 1,75 x 1,75 cm)
--   - aiguilles de douleur : 18 cm (et non 20)
--   - crochet : même taille que les aiguilles de douleur
--   - clé vierge : 8 x 3 x 0,5 cm (poids estimé : 10 g, à confirmer)
--   - duos : comptés comme leurs deux pièces (pas de mesures à eux)
-- Le kit du voleur reste sans mesures (à prendre).
-- =========================================

-- Outils (comme la spatule du chirurgien)
UPDATE products SET weight_grams = 23, length_cm = 18, width_cm = 1.75, height_cm = 1.75
WHERE slug_fr IN ('tourne-serrure-voleur', 'lime-voleur', 'passe-droite-voleur',
                  'passe-interieur-voleur', 'passe-exterieur-voleur');

-- Aiguilles de douleur : 18 cm en vrai (la base disait 20).
UPDATE products SET height_cm = 18 WHERE slug_fr = 'aiguilles-douleur';

-- Crochet : comme les aiguilles de douleur
UPDATE products p
SET weight_grams = d.weight_grams, length_cm = d.length_cm, width_cm = d.width_cm, height_cm = d.height_cm
FROM products d
WHERE p.slug_fr = 'crochet-voleur' AND d.slug_fr = 'aiguilles-douleur';

-- Clé vierge
UPDATE products SET weight_grams = 10, length_cm = 8, width_cm = 3, height_cm = 0.5
WHERE slug_fr = 'cle-vierge-voleur';

-- Duos : pas de mesures à eux. Le calcul de livraison compte leurs deux
-- pièces (voir packing.service.js). On efface celles d'un essai précédent.
UPDATE products
SET weight_grams = NULL, length_cm = NULL, width_cm = NULL, height_cm = NULL
WHERE slug_fr IN ('crochet-et-tourne-serrure-voleur', 'cle-vierge-et-lime-voleur');

-- Texte des aiguilles de suture : vendues droites, courbes ou les deux.
UPDATE products
SET description_fr = 'Aiguilles de suture moulées au fini fer froid, droites ou incurvées, pour simuler les sutures et refermer les plaies en toute circonstance.',
    description_en = 'Molded suture needles with a cold iron finish, straight or curved, to simulate sutures and close wounds in any situation.'
WHERE slug_fr = 'aiguilles-suture';

-- Vérification
SELECT slug_fr, weight_grams, length_cm, width_cm, height_cm
FROM products
WHERE slug_fr LIKE '%voleur%' OR slug_fr IN ('aiguilles-suture', 'aiguilles-douleur')
ORDER BY id;
