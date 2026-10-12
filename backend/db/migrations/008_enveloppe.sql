-- =========================================
-- Envoi en enveloppe (Poste-lettres, sans suivi)
-- À exécuter UNE fois sur chaque base (locale, sandbox, live RDS),
-- AVANT de déployer le code qui l'utilise.
--
-- L'enveloppe no 10 est un format d'emballage comme les boîtes
-- (box_types), marqué is_letter : le panier offre « Poste-lettres » à 3 $
-- (sans suivi, environ 2 semaines) quand la commande y entre, calculé
-- comme pour une boîte. Jamais utilisée pour un colis.
--
-- Mesures intérieures utiles : 22 x 9,5 cm (l'enveloppe fait 24,1 x 10,5,
-- on garde de quoi la fermer). Épaisseur : 0,9 cm (la pince, 1 cm, n'entre pas), ce qu'une enveloppe de
-- papier no 10 prend vraiment (Postes Canada accepterait 2 cm, mais une
-- enveloppe de papier ne se ferme pas sur un outil de 1,75 cm). 500 g au
-- plus : limite de la Poste-lettres surdimensionnée.
-- =========================================

-- Première version (flag par produit) : remplacée par le calcul.
ALTER TABLE products DROP COLUMN IF EXISTS fits_envelope;

ALTER TABLE box_types
  ADD COLUMN IF NOT EXISTS is_letter boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS max_weight_grams integer;

INSERT INTO box_types (slug, name_fr, name_en, weight_grams, length_cm, width_cm, height_cm, sort_order, is_letter, max_weight_grams)
SELECT 'enveloppe-10', 'Enveloppe no 10 (Poste-lettres)', 'No. 10 envelope (Lettermail)', 5, 22, 9.5, 0.9, 0, true, 500
WHERE NOT EXISTS (SELECT 1 FROM box_types WHERE slug = 'enveloppe-10');

-- Si une version précédente a déjà créé l'enveloppe à 2 cm.
UPDATE box_types SET height_cm = 0.9 WHERE slug = 'enveloppe-10';

-- Vérification
SELECT slug, name_fr, weight_grams, length_cm, width_cm, height_cm, is_letter, max_weight_grams
FROM box_types ORDER BY is_letter DESC, sort_order;
