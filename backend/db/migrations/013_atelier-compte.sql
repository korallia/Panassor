-- =========================================
-- L'atelier peut modifier le compte de la personne connectée (page
-- Paramètres) : son courriel et son mot de passe. Rien d'autre dans
-- atelier_users (ni ajouter, ni supprimer, ni activer quelqu'un).
-- À exécuter UNE fois sur chaque base (Neon, live RDS), après la 012.
-- =========================================

GRANT UPDATE (email, password_hash) ON atelier_users TO atelier_app;

-- Vérification
SELECT column_name, privilege_type
FROM information_schema.column_privileges
WHERE grantee = 'atelier_app' AND table_name = 'atelier_users';
