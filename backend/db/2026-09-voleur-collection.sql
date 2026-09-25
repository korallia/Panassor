-- =========================================
-- PANASSOR -- Collection "Kit du voleur" -- SCRIPT COMPLET
-- 2026-09-25
--
-- Contient tout : textes de la collection, 10 produits (prix, liens FR/EN,
-- titres et descriptions FR/EN), photos, contenu du kit, couleurs du kit.
--
-- Compatible pgAdmin, psql ET l'éditeur SQL de Neon (pas de bloc DO $$).
-- Peut être relancé sans créer de doublons : les INSERT sautent ce qui
-- existe déjà, les UPDATE remettent les textes à jour.
-- NE CHANGE PAS le statut de la collection (voir la toute fin).
--
-- Contenu du kit : clé vierge et crochet (FIXES) + lime, 3 passes et
-- tourne-serrure (outils AU CHOIX : remplaçables par n'importe quel outil
-- interchangeable, et proposés dans les autres kits). Les 2 ensembles ne
-- font PAS partie du kit. À la vente d'un kit, le stock retiré = pièces
-- fixes + outils choisis.
-- =========================================

-- Vérification AVANT : doit afficher 1 ligne (kit_voleur) et 2 couleurs.
SELECT 'collection' AS quoi, slug_fr AS valeur FROM collections WHERE slug_fr = 'kit_voleur'
UNION ALL
SELECT 'couleur', name_en FROM colors WHERE name_en IN ('Black', 'Dark brown');

BEGIN;

-- ---------- 1. Textes de la collection ----------
UPDATE collections
SET name_fr = 'Kit du voleur',  name_en = 'Thief''s Kit',
    title_fr = 'Kit du voleur', title_en = 'Thief''s Kit',
    description_fr = 'Accessoires immersifs et faits main pour donner vie à vos scènes d’infiltration, de crochetage et de cambriolage en grandeur nature.',
    description_en = 'Immersive handmade props to bring your infiltration, lockpicking and burglary scenes to life in live-action roleplay.',
    long_description_fr = 'La collection Kit du voleur est pensée pour les cambrioleurs, les espions et tous les personnages qui préfèrent une porte close à une grande entrée. Clés, crochets, passes et limes : chaque pièce appuie les scènes où la discrétion compte plus que la force.',
    long_description_en = 'The Thief’s Kit collection is made for burglars, spies and every character who prefers a locked door to a grand entrance. Keys, picks, passes and files: each piece supports the scenes where stealth matters more than strength.',
    updated_at = CURRENT_TIMESTAMP
WHERE slug_fr = 'kit_voleur';

-- ---------- 2. Produits ----------
-- Slugs suffixés "-voleur" : le kit du chirurgien a déjà un "Crochet".
-- Prix en cents. Mesures/poids vides pour l'instant.
INSERT INTO products (collection_id, slug_fr, slug_en, name_fr, name_en, price_cents,
                      customizable, is_kit, featured)
SELECT c.id, v.slug_fr, v.slug_en, v.name_fr, v.name_en, v.price_cents,
       v.au_choix, v.is_kit, FALSE
FROM (VALUES
  ('kit-du-voleur',                    'thiefs-kit',                        'Kit du voleur',            'Thief''s Kit',              24500, FALSE, TRUE),
  ('cle-vierge-voleur',                'blank-key-thief',                   'Clé vierge',               'Blank Key',                  2000, FALSE, FALSE),
  ('crochet-voleur',                   'lock-pick-thief',                   'Crochet',                  'Lock Pick',                  2000, FALSE, FALSE),
  ('lime-voleur',                      'file-thief',                        'Lime',                     'File',                       4000, TRUE,  FALSE),
  ('passe-droite-voleur',              'straight-pass-thief',               'Passe droite',             'Straight Pass',              4000, TRUE,  FALSE),
  ('passe-exterieur-voleur',           'outer-pass-thief',                  'Passe extérieur',          'Outer Pass',                 4000, TRUE,  FALSE),
  ('passe-interieur-voleur',           'inner-pass-thief',                  'Passe intérieur',          'Inner Pass',                 4000, TRUE,  FALSE),
  ('tourne-serrure-voleur',            'lock-turner-thief',                 'Tourne-serrure',           'Lock Turner',                4000, TRUE,  FALSE),
  ('cle-vierge-et-lime-voleur',        'blank-key-and-file-thief',          'Clé vierge + lime',        'Blank Key + File',           5000, FALSE, FALSE),
  ('crochet-et-tourne-serrure-voleur', 'lock-pick-and-lock-turner-thief',   'Crochet + tourne-serrure', 'Lock Pick + Lock Turner',    5000, FALSE, FALSE)
) AS v(slug_fr, slug_en, name_fr, name_en, price_cents, au_choix, is_kit)
JOIN collections c ON c.slug_fr = 'kit_voleur'
WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.slug_fr = v.slug_fr);

-- ---------- 3. Titres + descriptions des produits (FR/EN) ----------
-- La description courte FR est aussi celle envoyée à Square.
UPDATE products p
SET title_fr = t.title_fr, title_en = t.title_en,
    description_fr = t.description_fr, description_en = t.description_en,
    long_description_fr = t.long_fr, long_description_en = t.long_en,
    updated_at = CURRENT_TIMESTAMP
FROM (VALUES
  ('kit-du-voleur', 'Kit du voleur', 'Thief''s Kit', 'La trousse complète pour incarner les voleurs, les cambrioleurs et les scènes d’infiltration.', 'The complete kit to play thieves, burglars and infiltration scenes.', 'Le kit du voleur réunit une clé vierge, un crochet, une lime, trois passes et un tourne-serrure, pensés pour les personnages qui vivent dans l’ombre. Comme pour les autres kits Panassor, la lime, les passes et le tourne-serrure peuvent être remplacés par d’autres outils au choix.', 'The Thief’s Kit brings together a blank key, a lock pick, a file, three passes and a lock turner, made for characters who live in the shadows. As with every Panassor kit, the file, the passes and the lock turner can be swapped for other tools of your choice.'),
  ('cle-vierge-voleur', 'Clé vierge', 'Blank Key', 'Une clé encore sans dents, prête à devenir la copie de la serrure convoitée.', 'A key with no teeth yet, ready to become a copy of the coveted lock.', 'Point de départ de tout bon voleur, la clé vierge attend d’être taillée pour la porte visée. Idéale pour les scènes de préparation, de copie de clé et de missions d’infiltration en grandeur nature.', 'Every good thief starts here: a blank key waiting to be cut for the door in sight. Perfect for preparation scenes, key copying and infiltration missions in live-action roleplay.'),
  ('crochet-voleur', 'Crochet', 'Lock Pick', 'Un outil fin pour donner vie aux scènes de crochetage et d’infiltration.', 'A fine tool to bring lockpicking and infiltration scenes to life.', 'Glissé dans la serrure avec patience, le crochet est l’allié discret du voleur. Il appuie les scènes de tension où chaque seconde compte avant le retour de la garde.', 'Slipped patiently into the lock, the pick is the thief’s quiet ally. It supports those tense scenes where every second counts before the guard comes back.'),
  ('lime-voleur', 'Lime', 'File', 'Un outil de précision pour ajuster une clé ou venir à bout d’un obstacle en scène.', 'A precision tool to shape a key or get past an obstacle in a scene.', 'Pour tailler une clé vierge, user un barreau ou effacer une marque compromettante, la lime accompagne le voleur patient. Un accessoire simple qui ajoute du réalisme aux préparations de cambriolage.', 'Cutting a blank key, wearing down a bar or erasing a telltale mark: the file goes wherever a patient thief goes. A simple prop that adds realism to any burglary preparation.'),
  ('passe-droite-voleur', 'Passe droite', 'Straight Pass', 'Un passe au profil droit pour les serrures qui cèdent aux mains habiles.', 'A straight-profile pass for locks that give way to skilled hands.', 'Le passe droit est l’outil de base du crocheteur : direct, fiable et toujours à portée de main. Il complète la trousse du voleur pour les scènes d’effraction et les portes qui ne devaient pas s’ouvrir.', 'The straight pass is the lockpicker’s go-to tool: direct, reliable and always within reach. It rounds out the thief’s kit for break-in scenes and doors that were never meant to open.'),
  ('passe-exterieur-voleur', 'Passe extérieur', 'Outer Pass', 'Un passe pensé pour les serrures qui résistent aux outils habituels.', 'A pass made for locks that resist the usual tools.', 'Quand le passe droit ne suffit plus, le passe extérieur prend le relais. Un accessoire qui donne de la profondeur aux scènes de crochetage et au savoir-faire du personnage.', 'When the straight pass is not enough, the outer pass takes over. A prop that adds depth to lockpicking scenes and to your character’s craft.'),
  ('passe-interieur-voleur', 'Passe intérieur', 'Inner Pass', 'Un passe pour atteindre le cœur des serrures les plus tenaces.', 'A pass to reach the heart of the most stubborn locks.', 'Le passe intérieur complète le trio des passes du voleur. Avec lui, le personnage montre qu’aucune serrure ne lui résiste bien longtemps, pour des scènes d’infiltration plus crédibles.', 'The inner pass completes the thief’s trio of passes. With it, your character shows that no lock holds out for long, making infiltration scenes all the more convincing.'),
  ('tourne-serrure-voleur', 'Tourne-serrure', 'Lock Turner', 'L’outil qui maintient la tension pendant que le crochet fait son travail.', 'The tool that holds the tension while the pick does its work.', 'Indispensable au crochetage, le tourne-serrure exerce la pression qui permet à la serrure de céder. Associé au crochet, il donne toute sa crédibilité aux scènes d’infiltration.', 'Essential to lockpicking, the lock turner applies the pressure that makes the lock give way. Paired with the pick, it makes infiltration scenes truly believable.'),
  ('cle-vierge-et-lime-voleur', 'Clé vierge + lime', 'Blank Key + File', 'Le duo pour tailler sa propre clé en pleine scène.', 'The duo to cut your own key right in the middle of a scene.', 'Cet ensemble réunit une clé vierge et une lime : tout ce qu’il faut pour jouer la copie d’une clé dérobée, le temps d’une nuit.', 'This set brings together a blank key and a file: everything you need to play out copying a stolen key, just for one night.'),
  ('crochet-et-tourne-serrure-voleur', 'Crochet + tourne-serrure', 'Lock Pick + Lock Turner', 'Le duo essentiel du crochetage, réuni dans un seul ensemble.', 'The essential lockpicking duo, together in one set.', 'Le crochet et le tourne-serrure travaillent toujours ensemble : l’un maintient la tension, l’autre trouve le chemin. L’ensemble parfait pour les personnages qui ouvrent les portes sans y être invités.', 'The pick and the lock turner always work together: one holds the tension, the other finds the way. The perfect set for characters who open doors without an invitation.')
) AS t(slug_fr, title_fr, title_en, description_fr, description_en, long_fr, long_en)
WHERE p.slug_fr = t.slug_fr;

-- ---------- 4. Photos ----------
-- Dossier S3 : panassormedia/images/voleurs_temp/
-- sort_order 0 + is_main = photo principale (celle envoyée à Square).
INSERT INTO product_images (product_id, url, alt_fr, alt_en, sort_order, is_main)
SELECT p.id, '/images/voleurs_temp/' || i.file, p.name_fr, p.name_en, i.sort_order, i.is_main
FROM (VALUES
  ('kit-du-voleur',                    'LeKitArriveraProchainement.jpg', 0, TRUE),

  ('cle-vierge-voleur',                'key.jpg',                 0, TRUE),
  ('cle-vierge-voleur',                'key(1).jpg',              1, FALSE),
  ('cle-vierge-voleur',                'key(2).jpg',              2, FALSE),

  ('crochet-voleur',                   'crochet.jpg',             0, TRUE),
  ('crochet-voleur',                   'crochet(1).jpg',          1, FALSE),
  ('crochet-voleur',                   'crochet(2).jpg',          2, FALSE),
  ('crochet-voleur',                   'crochet(3).jpg',          3, FALSE),

  ('lime-voleur',                      'lime.jpg',                0, TRUE),
  ('lime-voleur',                      'lime(1).jpg',             1, FALSE),

  ('passe-droite-voleur',              'passe_droite.jpg',        0, TRUE),
  ('passe-droite-voleur',              'passe_droite(1).jpg',     1, FALSE),

  ('passe-exterieur-voleur',           'passe_exterieur.jpg',     0, TRUE),
  ('passe-exterieur-voleur',           'passe_exterieur(1).jpg',  1, FALSE),

  ('passe-interieur-voleur',           'passe_interieur.jpg',     0, TRUE),
  ('passe-interieur-voleur',           'passe_interieur(1).jpg',  1, FALSE),

  ('tourne-serrure-voleur',            'tourne_serrure.jpg',      0, TRUE),
  ('tourne-serrure-voleur',            'tourne_serrure(1).jpg',   1, FALSE),
  ('tourne-serrure-voleur',            'tourne_serrure(2).jpg',   2, FALSE),

  ('cle-vierge-et-lime-voleur',        'key.jpg',                 0, TRUE),
  ('cle-vierge-et-lime-voleur',        'lime.jpg',                1, FALSE),

  ('crochet-et-tourne-serrure-voleur', 'tourne_serrure.jpg',      0, TRUE),
  ('crochet-et-tourne-serrure-voleur', 'tourne_serrure(1).jpg',   1, FALSE),
  ('crochet-et-tourne-serrure-voleur', 'tourne_serrure(2).jpg',   2, FALSE),
  ('crochet-et-tourne-serrure-voleur', 'crochet.jpg',             3, FALSE)
) AS i(slug_fr, file, sort_order, is_main)
JOIN products p ON p.slug_fr = i.slug_fr
WHERE NOT EXISTS (
  SELECT 1 FROM product_images x
  WHERE x.product_id = p.id AND x.url = '/images/voleurs_temp/' || i.file AND x.color_id IS NULL
);

-- ---------- 5. Contenu du kit ----------
INSERT INTO kit_components (kit_product_id, included_product_id, quantity, sort_order)
SELECT kit.id, piece.id, 1, x.sort_order
FROM (VALUES
  ('cle-vierge-voleur',      0),
  ('crochet-voleur',         1),
  ('lime-voleur',            2),
  ('passe-droite-voleur',    3),
  ('passe-exterieur-voleur', 4),
  ('passe-interieur-voleur', 5),
  ('tourne-serrure-voleur',  6)
) AS x(slug_fr, sort_order)
JOIN products piece ON piece.slug_fr = x.slug_fr
JOIN products kit   ON kit.slug_fr = 'kit-du-voleur'
WHERE NOT EXISTS (
  SELECT 1 FROM kit_components kc
  WHERE kc.kit_product_id = kit.id AND kc.included_product_id = piece.id
);

-- ---------- 6. Couleurs du kit : Noir + Brun foncé (même prix) ----------
INSERT INTO product_color_variants (product_id, color_id, price_delta_cents)
SELECT p.id, c.id, 0
FROM products p
JOIN colors c ON c.name_en IN ('Black', 'Dark brown')
WHERE p.slug_fr = 'kit-du-voleur'
  AND NOT EXISTS (
    SELECT 1 FROM product_color_variants v
    WHERE v.product_id = p.id AND v.color_id = c.id
  );

-- Image "coming soon" pour chaque couleur
INSERT INTO product_images (product_id, url, alt_fr, alt_en, sort_order, is_main, color_id)
SELECT p.id, '/images/voleurs_temp/LeKitArriveraProchainement.jpg',
       'Kit du voleur', 'Thief''s Kit', 1, FALSE, c.id
FROM products p
JOIN colors c ON c.name_en IN ('Black', 'Dark brown')
WHERE p.slug_fr = 'kit-du-voleur'
  AND NOT EXISTS (
    SELECT 1 FROM product_images i
    WHERE i.product_id = p.id AND i.color_id = c.id
  );

COMMIT;

-- ---------- Vérification APRÈS ----------
-- 10 produits attendus ; le kit : 7 pièces et 2 couleurs.
SELECT p.name_fr,
       (p.price_cents / 100.0)::numeric(10,2) AS prix,
       p.is_kit, p.customizable AS au_choix,
       '/produits/' || p.slug_fr AS lien_fr,
       '/produits/' || p.slug_en AS lien_en,
       (p.description_fr IS NOT NULL AND p.long_description_en IS NOT NULL) AS textes_ok,
       (SELECT count(*) FROM product_images i WHERE i.product_id = p.id) AS photos,
       EXISTS (SELECT 1 FROM kit_components kc WHERE kc.included_product_id = p.id) AS dans_le_kit,
       (SELECT string_agg(c.name_fr, ', ') FROM product_color_variants v
          JOIN colors c ON c.id = v.color_id WHERE v.product_id = p.id) AS couleurs
FROM products p
JOIN collections col ON col.id = p.collection_id AND col.slug_fr = 'kit_voleur'
ORDER BY p.is_kit DESC, p.id;

-- =========================================
-- À L'HEURE DU LANCEMENT SEULEMENT (ou tout de suite en SANDBOX) :
-- UPDATE collections SET status = 'published' WHERE slug_fr = 'kit_voleur';
-- puis, sur le serveur : node backend/scripts/syncProducts.js --modifiers-only
-- =========================================
