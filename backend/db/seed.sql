-- =========================================
-- PANASSOR LOCAL DATABASE SEED
-- PostgreSQL
-- =========================================

TRUNCATE TABLE kit_items, product_images, products, collections
RESTART IDENTITY CASCADE;

-- =========================================
-- COLLECTIONS
-- =========================================

INSERT INTO collections (
  slug,
  name_fr,
  title_fr,
  eyebrow_fr,
  url,
  description_fr,
  long_description_fr,
  hero_image_url,
  thumbnail_image_url,
  video_url,
  featured
)
VALUES
(
  'chirurgien',
  'Chirurgien',
  'Kit Chirurgien',
  'Dernière collection',
  '/collections/chirurgien',
  'Accessoires immersifs et faits main pour sublimer vos scènes de soin, de tension et de survie en grandeur nature.',
  'La collection Chirurgien rassemble des accessoires pensés pour donner du poids aux scènes médicales en jeu : soins d’urgence, diagnostics, sutures, opérations improvisées et moments de tension autour de la survie d’un personnage.',
  '/images/hero-kit-chirurgien.jpg',
  '/images/hero-kit-chirurgien.jpg',
  '/video/kit-chirurgien-panassor.mp4',
  TRUE
),
(
  'tortionnaire',
  'Tortionnaire',
  'Kit Tortionnaire',
  'Collection immersive',
  '/collections/tortionnaire',
  'Accessoires immersifs et théâtraux pour enrichir les scènes d’interrogatoire, de menace et de tension narrative.',
  'La collection Tortionnaire est pensée pour les personnages inquiétants, les geôliers, les inquisiteurs et les scènes où l’ambiance compte plus que l’action physique.',
  '/images/PhotoSacoche3.png',
  '/images/PhotoSacocheFerme3.png',
  '/video/kit-chirurgien-panassor.mp4',
  FALSE
);

-- =========================================
-- PRODUCTS
-- =========================================

INSERT INTO products (
  collection_id,
  slug,
  name_fr,
  title_fr,
  description_fr,
  price_cents,
  customizable,
  is_kit,
  featured
)
VALUES
-- Chirurgien
(
  (SELECT id FROM collections WHERE slug = 'chirurgien'),
  'kit-chirurgien',
  'Kit du chirurgien',
  'Kit chirurgien',
  'La trousse complète pour incarner les scènes de soin, de tension et de survie.',
  29500,
  FALSE,
  TRUE,
  TRUE
),
(
  (SELECT id FROM collections WHERE slug = 'chirurgien'),
  'spatule',
  'Spatule',
  'Spatule',
  'Un outil de manipulation simple pour enrichir les examens et les interventions en scène.',
  4000,
  TRUE,
  FALSE,
  FALSE
),
(
  (SELECT id FROM collections WHERE slug = 'chirurgien'),
  'pince',
  'Pince',
  'Pince',
  'Un accessoire médical visuel pour manipuler, examiner et intervenir avec précision.',
  4000,
  FALSE,
  FALSE,
  FALSE
),
(
  (SELECT id FROM collections WHERE slug = 'chirurgien'),
  'curette',
  'Curette',
  'Curette',
  'Une pièce spécialisée pour donner plus de réalisme aux scènes de soin et d’intervention.',
  4000,
  TRUE,
  FALSE,
  FALSE
),
(
  (SELECT id FROM collections WHERE slug = 'chirurgien'),
  'crochet',
  'Crochet',
  'Crochet',
  'Un outil fin pour appuyer les manipulations délicates et les scènes médicales tendues.',
  4000,
  TRUE,
  FALSE,
  FALSE
),
(
  (SELECT id FROM collections WHERE slug = 'chirurgien'),
  'scalpel',
  'Scalpel',
  'Scalpel',
  'Un accessoire immersif pour les interventions délicates et les scènes chirurgicales.',
  4000,
  TRUE,
  FALSE,
  FALSE
),
(
  (SELECT id FROM collections WHERE slug = 'chirurgien'),
  'aiguilles-suture',
  'Aiguilles de suture',
  'Aiguilles',
  'Des pièces visuelles pour enrichir les scènes de couture, de soin et d’intervention.',
  2000,
  FALSE,
  FALSE,
  FALSE
),
(
  (SELECT id FROM collections WHERE slug = 'chirurgien'),
  'bandage',
  'Bandage',
  'Bandage',
  'Un élément simple et efficace pour appuyer les blessures et les premiers soins sur le terrain.',
  500,
  FALSE,
  FALSE,
  FALSE
),

-- Tortionnaire
(
  (SELECT id FROM collections WHERE slug = 'tortionnaire'),
  'kit-tortionnaire',
  'Kit du tortionnaire',
  'Kit tortionnaire',
  'La trousse complète pour incarner les scènes d’interrogatoire, de tension et de domination narrative.',
  19500,
  FALSE,
  TRUE,
  TRUE
),
(
  (SELECT id FROM collections WHERE slug = 'tortionnaire'),
  'aiguilles-douleur',
  'Aiguilles de douleur',
  'Aiguilles',
  'Deux longues aiguilles visuelles pour accentuer les scènes de menace, d’intimidation et d’interrogatoire.',
  3000,
  FALSE,
  FALSE,
  FALSE
),
(
  (SELECT id FROM collections WHERE slug = 'tortionnaire'),
  'redresseur',
  'Le Redresseur',
  'Redresseur',
  'Un outil de scène au nom évocateur, pensé pour imposer une présence froide et inquiétante.',
  4000,
  TRUE,
  FALSE,
  FALSE
),
(
  (SELECT id FROM collections WHERE slug = 'tortionnaire'),
  'correcteur',
  'Le Correcteur',
  'Correcteur',
  'Un accessoire théâtral pour appuyer les scènes de discipline, de menace et de confrontation.',
  4000,
  TRUE,
  FALSE,
  FALSE
),
(
  (SELECT id FROM collections WHERE slug = 'tortionnaire'),
  'dernier-argument',
  'Le Dernier Argument',
  'Dernier Argument',
  'Un outil narratif au nom dramatique, parfait pour faire monter la tension avant une décision finale.',
  4000,
  TRUE,
  FALSE,
  FALSE
),
(
  (SELECT id FROM collections WHERE slug = 'tortionnaire'),
  'pacificateur',
  'Le Pacificateur',
  'Pacificateur',
  'Un accessoire sombre et ironique pour les personnages qui imposent le silence par leur seule présence.',
  4000,
  TRUE,
  FALSE,
  FALSE
);

-- =========================================
-- PRODUCT IMAGES
-- =========================================

INSERT INTO product_images (
  product_id,
  url,
  alt_fr,
  sort_order,
  is_main
)
VALUES
-- Chirurgien
((SELECT id FROM products WHERE slug = 'kit-chirurgien'), '/images/hero-kit-chirurgien.jpg', 'Kit du chirurgien Panassor', 0, TRUE),
((SELECT id FROM products WHERE slug = 'spatule'), '/images/spatule.jpg', 'Spatule Panassor', 0, TRUE),
((SELECT id FROM products WHERE slug = 'pince'), '/images/pinces.jpg', 'Pince Panassor', 0, TRUE),
((SELECT id FROM products WHERE slug = 'curette'), '/images/curette.jpg', 'Curette Panassor', 0, TRUE),
((SELECT id FROM products WHERE slug = 'crochet'), '/images/crochet.jpg', 'Crochet Panassor', 0, TRUE),
((SELECT id FROM products WHERE slug = 'scalpel'), '/images/scalpel.jpg', 'Scalpel Panassor', 0, TRUE),
((SELECT id FROM products WHERE slug = 'aiguilles-suture'), '/images/aiguilles_suture.jpg', 'Aiguilles de suture Panassor', 0, TRUE),
((SELECT id FROM products WHERE slug = 'bandage'), '/images/bandage.jpg', 'Bandage Panassor', 0, TRUE),

-- Tortionnaire
((SELECT id FROM products WHERE slug = 'kit-tortionnaire'), '/images/Kit_tortionnaire.png', 'Kit du tortionnaire Panassor', 0, TRUE),
((SELECT id FROM products WHERE slug = 'aiguilles-douleur'), '/images/OutilsTortionaire.png', 'Aiguilles de douleur Panassor', 0, TRUE),
((SELECT id FROM products WHERE slug = 'redresseur'), '/images/Redresseur.png', 'Le Redresseur Panassor', 0, TRUE),
((SELECT id FROM products WHERE slug = 'correcteur'), '/images/Correcteur.png', 'Le Correcteur Panassor', 0, TRUE),
((SELECT id FROM products WHERE slug = 'dernier-argument'), '/images/Dernier_Argument.png', 'Le Dernier Argument Panassor', 0, TRUE),
((SELECT id FROM products WHERE slug = 'pacificateur'), '/images/Pacificateur.png', 'Le Pacificateur Panassor', 0, TRUE);

-- =========================================
-- KIT ITEMS
-- =========================================

INSERT INTO kit_items (
  kit_product_id,
  included_product_id,
  quantity,
  sort_order
)
VALUES
-- Kit Chirurgien
(
  (SELECT id FROM products WHERE slug = 'kit-chirurgien'),
  (SELECT id FROM products WHERE slug = 'spatule'),
  1,
  1
),
(
  (SELECT id FROM products WHERE slug = 'kit-chirurgien'),
  (SELECT id FROM products WHERE slug = 'pince'),
  1,
  2
),
(
  (SELECT id FROM products WHERE slug = 'kit-chirurgien'),
  (SELECT id FROM products WHERE slug = 'curette'),
  1,
  3
),
(
  (SELECT id FROM products WHERE slug = 'kit-chirurgien'),
  (SELECT id FROM products WHERE slug = 'crochet'),
  1,
  4
),
(
  (SELECT id FROM products WHERE slug = 'kit-chirurgien'),
  (SELECT id FROM products WHERE slug = 'scalpel'),
  1,
  5
),
(
  (SELECT id FROM products WHERE slug = 'kit-chirurgien'),
  (SELECT id FROM products WHERE slug = 'aiguilles-suture'),
  1,
  6
),
(
  (SELECT id FROM products WHERE slug = 'kit-chirurgien'),
  (SELECT id FROM products WHERE slug = 'bandage'),
  1,
  7
),

-- Kit Tortionnaire
(
  (SELECT id FROM products WHERE slug = 'kit-tortionnaire'),
  (SELECT id FROM products WHERE slug = 'aiguilles-douleur'),
  1,
  1
),
(
  (SELECT id FROM products WHERE slug = 'kit-tortionnaire'),
  (SELECT id FROM products WHERE slug = 'redresseur'),
  1,
  2
),
(
  (SELECT id FROM products WHERE slug = 'kit-tortionnaire'),
  (SELECT id FROM products WHERE slug = 'correcteur'),
  1,
  3
),
(
  (SELECT id FROM products WHERE slug = 'kit-tortionnaire'),
  (SELECT id FROM products WHERE slug = 'dernier-argument'),
  1,
  4
),
(
  (SELECT id FROM products WHERE slug = 'kit-tortionnaire'),
  (SELECT id FROM products WHERE slug = 'pacificateur'),
  1,
  5
);