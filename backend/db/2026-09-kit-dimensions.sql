-- =========================================
-- DIMENSIONS : kit-chirurgien et kit-tortionnaire
-- =========================================
-- Mesures de Korallia, en pouces, ordre hauteur / longueur / largeur --
-- converties en cm (1 pouce = 2.54 cm).
--
-- Kit chirurgien : 8 1/4 x 7 1/2 x 2 po -> hauteur 20.96, longueur 19.05, largeur 5.08 cm
-- Kit tortionnaire ("Torture", modifie) : 3 x 8 1/4 x 2 po -> hauteur 7.62, longueur 20.96, largeur 5.08 cm
--
-- ATTENTION : le premier bloc de mesures (8 1/4 x 7 1/2 x 2) n'etait pas
-- etiquete -- je l'ai assigne au kit-chirurgien par elimination (l'autre
-- bloc dit explicitement "Torture" = kit-tortionnaire). Confirme que
-- c'est le bon sens avant de rouler si t'as un doute.

UPDATE products
SET height_cm = 20.96, length_cm = 19.05, width_cm = 5.08
WHERE slug_fr = 'kit-chirurgien';

UPDATE products
SET height_cm = 7.62, length_cm = 20.96, width_cm = 5.08
WHERE slug_fr = 'kit-tortionnaire';
