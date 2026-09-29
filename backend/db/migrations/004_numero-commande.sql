-- =========================================
-- Numéro de commande visible, donné seulement au paiement
-- À exécuter UNE fois sur chaque base (locale, sandbox, live RDS),
-- AVANT de déployer le code qui l'utilise.
-- =========================================

BEGIN;

CREATE SEQUENCE IF NOT EXISTS order_number_seq;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number integer UNIQUE;

-- Les commandes déjà payées GARDENT leur numéro actuel (celui que les
-- clients ont déjà vu dans leurs courriels). Les commandes jamais payées
-- n'en reçoivent pas.
UPDATE orders
SET order_number = id
WHERE status = 'paid'
  AND order_number IS NULL;

-- La prochaine commande payée continue à partir du plus grand numéro.
SELECT setval(
  'order_number_seq',
  COALESCE((SELECT max(order_number) FROM orders), 0) + 1,
  false
);

COMMIT;

-- Vérification : les commandes payées et leur nouveau numéro.
SELECT id, order_number, status, created_at
FROM orders
WHERE order_number IS NOT NULL
ORDER BY order_number;
