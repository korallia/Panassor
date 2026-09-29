-- =========================================
-- Coupon et montants réellement facturés par Square
-- À exécuter UNE fois sur chaque base (locale, sandbox, live RDS),
-- AVANT de déployer le code qui l'utilise.
-- =========================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS discount_cents integer,
  ADD COLUMN IF NOT EXISTS discount_label text,
  ADD COLUMN IF NOT EXISTS paid_tax_cents integer,
  ADD COLUMN IF NOT EXISTS paid_total_cents integer;

-- Commandes déjà payées : on remplit à partir de la copie de la commande
-- Square déjà gardée en base (square_order_snapshot).
UPDATE orders
SET
  discount_cents   = (square_order_snapshot->'total_discount_money'->>'amount')::int,
  paid_tax_cents   = (square_order_snapshot->'total_tax_money'->>'amount')::int,
  paid_total_cents = (square_order_snapshot->'total_money'->>'amount')::int,
  discount_label   = NULLIF((
    SELECT string_agg(d->>'name', ', ')
    FROM jsonb_array_elements(COALESCE(square_order_snapshot->'discounts', '[]'::jsonb)) d
  ), '')
WHERE square_order_snapshot IS NOT NULL
  AND paid_total_cents IS NULL;

-- Vérification
SELECT id, order_number, total_cents, paid_total_cents, discount_cents, discount_label
FROM orders
WHERE order_number IS NOT NULL
ORDER BY order_number;
