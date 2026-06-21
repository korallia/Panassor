-- =========================================
-- PANASSOR LOCAL DATABASE SCHEMA
-- PostgreSQL
-- =========================================

DROP TABLE IF EXISTS kit_items CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS collections CASCADE;

-- =========================================
-- COLLECTIONS
-- =========================================

CREATE TABLE collections (
  id SERIAL PRIMARY KEY,

  slug VARCHAR(120) NOT NULL UNIQUE,

  name_fr VARCHAR(160) NOT NULL,
  name_en VARCHAR(160),

  title_fr VARCHAR(200),
  title_en VARCHAR(200),

  eyebrow_fr VARCHAR(160),
  eyebrow_en VARCHAR(160),

  url VARCHAR(255),

  description_fr TEXT,
  description_en TEXT,

  long_description_fr TEXT,
  long_description_en TEXT,

  hero_image_url TEXT,
  thumbnail_image_url TEXT,
  video_url TEXT,

  featured BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- PRODUCTS
-- =========================================

CREATE TABLE products (
  id SERIAL PRIMARY KEY,

  collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,

  slug VARCHAR(120) NOT NULL UNIQUE,

  name_fr VARCHAR(160) NOT NULL,
  name_en VARCHAR(160),

  title_fr VARCHAR(200),
  title_en VARCHAR(200),

  description_fr TEXT,
  description_en TEXT,

  long_description_fr TEXT,
  long_description_en TEXT,

  price_cents INTEGER,
  customizable BOOLEAN NOT NULL DEFAULT FALSE,

  is_kit BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- PRODUCT IMAGES
-- =========================================

CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,

  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  url TEXT NOT NULL,

  alt_fr VARCHAR(255),
  alt_en VARCHAR(255),

  sort_order INTEGER NOT NULL DEFAULT 0,
  is_main BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- KIT ITEMS
-- A kit is a product where is_kit = true.
-- This table links a kit product to the products it contains.
-- =========================================

CREATE TABLE kit_items (
  id SERIAL PRIMARY KEY,

  kit_product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  included_product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  quantity INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT no_self_inclusion CHECK (kit_product_id <> included_product_id),
  CONSTRAINT unique_kit_item UNIQUE (kit_product_id, included_product_id)
);

-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX idx_products_collection_id ON products(collection_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_kit_items_kit_product_id ON kit_items(kit_product_id);
CREATE INDEX idx_kit_items_included_product_id ON kit_items(included_product_id);