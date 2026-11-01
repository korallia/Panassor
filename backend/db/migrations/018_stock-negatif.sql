-- =========================================
-- Le stock peut devenir négatif (une vente passe peu importe le stock)
-- À exécuter UNE fois sur chaque base (Neon d'abord, live RDS ensuite),
-- avec l'utilisateur principal, AVANT de déployer le code qui l'utilise.
--
-- Une vente Square retire toujours ce qu'elle a vendu, même s'il n'y en
-- avait plus : 0 scalpel − 1 vendu = −1. Le −1 montre qu'on doit 1 scalpel
-- (historique : « manquait 1 »). Les retraits faits à la main dans l'atelier
-- (perte, correction) restent bloqués à 0 par le code de l'atelier.
-- =========================================

-- La règle « quantity >= 0 » de la 014 (son nom vient de Postgres : on la
-- retrouve par sa définition plutôt que de deviner son nom).
DO $$
DECLARE
  rule text;
BEGIN
  FOR rule IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'stock'::regclass AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%quantity >= 0%'
  LOOP
    EXECUTE format('ALTER TABLE stock DROP CONSTRAINT %I', rule);
  END LOOP;
END
$$;

-- Vérification : plus aucune règle sur la quantité.
SELECT conname, pg_get_constraintdef(oid) AS regle
FROM pg_constraint
WHERE conrelid = 'stock'::regclass AND contype = 'c';
