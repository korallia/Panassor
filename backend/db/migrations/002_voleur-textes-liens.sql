-- =========================================
-- PANASSOR -- Kit du voleur : TEXTES + LIENS seulement
-- 2026-09-25
--
-- Pour une base où les produits du voleur existent déjà. Ne crée rien,
-- ne supprime rien : met seulement à jour, pour chaque produit de la
-- collection voleur (retrouvé par son nom FR) :
--   - les liens : /produits/<slug_fr> en français, /produits/<slug_en> en anglais
--   - le titre, la description courte et la description longue, FR et EN
--     (la description courte FR est celle envoyée à Square)
-- Peut être relancé sans problème.
-- =========================================

BEGIN;

UPDATE products p
SET slug_fr = t.slug_fr, slug_en = t.slug_en,
    title_fr = t.title_fr, title_en = t.title_en,
    description_fr = t.description_fr, description_en = t.description_en,
    long_description_fr = t.long_fr, long_description_en = t.long_en,
    updated_at = CURRENT_TIMESTAMP
FROM (VALUES
  ('Kit du voleur', 'kit-du-voleur', 'thiefs-kit', 'Kit du voleur', 'Thief''s Kit', 'La trousse complète pour incarner les voleurs, les cambrioleurs et les scènes d’infiltration.', 'The complete kit to play thieves, burglars and infiltration scenes.', 'Le kit du voleur réunit une clé vierge, un crochet, une lime, trois passes et un tourne-serrure, pensés pour les personnages qui vivent dans l’ombre. Comme pour les autres kits Panassor, la lime, les passes et le tourne-serrure peuvent être remplacés par d’autres outils au choix.', 'The Thief’s Kit brings together a blank key, a lock pick, a file, three passes and a lock turner, made for characters who live in the shadows. As with every Panassor kit, the file, the passes and the lock turner can be swapped for other tools of your choice.'),
  ('Clé vierge', 'cle-vierge-voleur', 'blank-key-thief', 'Clé vierge', 'Blank Key', 'Une clé encore sans dents, prête à devenir la copie de la serrure convoitée.', 'A key with no teeth yet, ready to become a copy of the coveted lock.', 'Point de départ de tout bon voleur, la clé vierge attend d’être taillée pour la porte visée. Idéale pour les scènes de préparation, de copie de clé et de missions d’infiltration en grandeur nature.', 'Every good thief starts here: a blank key waiting to be cut for the door in sight. Perfect for preparation scenes, key copying and infiltration missions in live-action roleplay.'),
  ('Crochet', 'crochet-voleur', 'lock-pick-thief', 'Crochet', 'Lock Pick', 'Un outil fin pour donner vie aux scènes de crochetage et d’infiltration.', 'A fine tool to bring lockpicking and infiltration scenes to life.', 'Glissé dans la serrure avec patience, le crochet est l’allié discret du voleur. Il appuie les scènes de tension où chaque seconde compte avant le retour de la garde.', 'Slipped patiently into the lock, the pick is the thief’s quiet ally. It supports those tense scenes where every second counts before the guard comes back.'),
  ('Lime', 'lime-voleur', 'file-thief', 'Lime', 'File', 'Un outil de précision pour ajuster une clé ou venir à bout d’un obstacle en scène.', 'A precision tool to shape a key or get past an obstacle in a scene.', 'Pour tailler une clé vierge, user un barreau ou effacer une marque compromettante, la lime accompagne le voleur patient. Un accessoire simple qui ajoute du réalisme aux préparations de cambriolage.', 'Cutting a blank key, wearing down a bar or erasing a telltale mark: the file goes wherever a patient thief goes. A simple prop that adds realism to any burglary preparation.'),
  ('Passe droite', 'passe-droite-voleur', 'straight-pass-thief', 'Passe droite', 'Straight Pass', 'Un passe au profil droit pour les serrures qui cèdent aux mains habiles.', 'A straight-profile pass for locks that give way to skilled hands.', 'Le passe droit est l’outil de base du crocheteur : direct, fiable et toujours à portée de main. Il complète la trousse du voleur pour les scènes d’effraction et les portes qui ne devaient pas s’ouvrir.', 'The straight pass is the lockpicker’s go-to tool: direct, reliable and always within reach. It rounds out the thief’s kit for break-in scenes and doors that were never meant to open.'),
  ('Passe extérieur', 'passe-exterieur-voleur', 'outer-pass-thief', 'Passe extérieur', 'Outer Pass', 'Un passe pensé pour les serrures qui résistent aux outils habituels.', 'A pass made for locks that resist the usual tools.', 'Quand le passe droit ne suffit plus, le passe extérieur prend le relais. Un accessoire qui donne de la profondeur aux scènes de crochetage et au savoir-faire du personnage.', 'When the straight pass is not enough, the outer pass takes over. A prop that adds depth to lockpicking scenes and to your character’s craft.'),
  ('Passe intérieur', 'passe-interieur-voleur', 'inner-pass-thief', 'Passe intérieur', 'Inner Pass', 'Un passe pour atteindre le cœur des serrures les plus tenaces.', 'A pass to reach the heart of the most stubborn locks.', 'Le passe intérieur complète le trio des passes du voleur. Avec lui, le personnage montre qu’aucune serrure ne lui résiste bien longtemps, pour des scènes d’infiltration plus crédibles.', 'The inner pass completes the thief’s trio of passes. With it, your character shows that no lock holds out for long, making infiltration scenes all the more convincing.'),
  ('Tourne-serrure', 'tourne-serrure-voleur', 'lock-turner-thief', 'Tourne-serrure', 'Lock Turner', 'L’outil qui maintient la tension pendant que le crochet fait son travail.', 'The tool that holds the tension while the pick does its work.', 'Indispensable au crochetage, le tourne-serrure exerce la pression qui permet à la serrure de céder. Associé au crochet, il donne toute sa crédibilité aux scènes d’infiltration.', 'Essential to lockpicking, the lock turner applies the pressure that makes the lock give way. Paired with the pick, it makes infiltration scenes truly believable.'),
  ('Clé vierge + lime', 'cle-vierge-et-lime-voleur', 'blank-key-and-file-thief', 'Clé vierge + lime', 'Blank Key + File', 'Le duo pour tailler sa propre clé en pleine scène.', 'The duo to cut your own key right in the middle of a scene.', 'Cet ensemble réunit une clé vierge et une lime : tout ce qu’il faut pour jouer la copie d’une clé dérobée, le temps d’une nuit.', 'This set brings together a blank key and a file: everything you need to play out copying a stolen key, just for one night.'),
  ('Crochet + tourne-serrure', 'crochet-et-tourne-serrure-voleur', 'lock-pick-and-lock-turner-thief', 'Crochet + tourne-serrure', 'Lock Pick + Lock Turner', 'Le duo essentiel du crochetage, réuni dans un seul ensemble.', 'The essential lockpicking duo, together in one set.', 'Le crochet et le tourne-serrure travaillent toujours ensemble : l’un maintient la tension, l’autre trouve le chemin. L’ensemble parfait pour les personnages qui ouvrent les portes sans y être invités.', 'The pick and the lock turner always work together: one holds the tension, the other finds the way. The perfect set for characters who open doors without an invitation.')
) AS t(name_fr, slug_fr, slug_en, title_fr, title_en, description_fr, description_en, long_fr, long_en)
WHERE p.name_fr = t.name_fr
  AND p.collection_id = (SELECT id FROM collections WHERE slug_fr ILIKE '%voleur%');

-- Vérification : les 10 produits doivent apparaître avec leurs liens et textes_ok = true.
SELECT p.name_fr,
       '/produits/' || p.slug_fr AS lien_fr,
       '/produits/' || p.slug_en AS lien_en,
       (p.description_fr IS NOT NULL AND p.long_description_en IS NOT NULL) AS textes_ok
FROM products p
WHERE p.collection_id = (SELECT id FROM collections WHERE slug_fr ILIKE '%voleur%')
ORDER BY p.id;

COMMIT;
