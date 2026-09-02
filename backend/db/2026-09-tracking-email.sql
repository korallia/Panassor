-- =========================================
-- COURRIEL DE TRACKING : token d'accès admin + statut "shipped"
-- =========================================
-- Contexte : on ajoute une petite page (protégée par un token secret par
-- expédition, pas un vrai système de login) où Korallia rentre le
-- transporteur + numéro de tracking d'une commande -- ça sauvegarde et
-- envoie automatiquement un courriel de suivi au client. Le lien vers
-- cette page est ajouté à la notification Discord de nouvelle commande.
--
-- Le token est généré côté Node (randomUUID(), même pattern que
-- thank_you_token sur "orders") pour les NOUVELLES expéditions -- ce
-- script ne fait que la colonne + le backfill des expéditions
-- existantes qui n'en ont pas encore.

-- 1) Colonnes sur shipments ------------------------------------------
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS admin_access_token VARCHAR(64) UNIQUE;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS tracking_email_sent_at TIMESTAMP;

COMMENT ON COLUMN shipments.admin_access_token IS 'Jeton secret (dans l''URL) donnant accès à la page où entrer le transporteur/tracking pour CETTE expédition -- pas un vrai login, même principe que orders.thank_you_token.';
COMMENT ON COLUMN shipments.tracking_email_sent_at IS 'Quand le courriel de suivi a été envoyé au client pour la dernière fois (NULL si jamais envoyé).';

-- 2) Nouveau statut "shipped" sur l'enum shipment_status ---------------
-- Ne peut pas tourner dans la même transaction qu'un usage de cette
-- valeur -- mais rien plus bas dans CE script ne l'utilise, donc aucun
-- souci ici (l'usage se fait plus tard, depuis le code applicatif).
ALTER TYPE shipment_status ADD VALUE IF NOT EXISTS 'shipped';

-- 3) Backfill des expéditions existantes sans token -------------------
-- md5(random + horloge) plutôt qu'une vraie UUID pour ne dépendre
-- d'aucune extension Postgres -- amplement suffisant pour un lien secret
-- à usage interne.
UPDATE shipments
SET admin_access_token = md5(random()::text || clock_timestamp()::text)
WHERE admin_access_token IS NULL;
