-- =========================================
-- Utilisateurs de l'atelier d'inventaire
-- À exécuter UNE fois sur chaque base (locale, Neon, live RDS),
-- AVANT de déployer l'atelier qui l'utilise.
--
-- Connexion en 2 étapes : courriel + mot de passe d'une ligne active,
-- puis un code à 6 chiffres envoyé à ce courriel.
-- Le mot de passe n'est JAMAIS en clair : password_hash est une empreinte
-- scrypt. Pour ajouter quelqu'un ou changer son mot de passe, dans le
-- dossier de l'atelier :
--   node scripts/ajouterUtilisateur.js courriel@exemple.com
-- puis coller la ligne SQL qu'il affiche.
-- Couper l'accès de quelqu'un :
--   UPDATE atelier_users SET active = false WHERE email = 'courriel@exemple.com';
-- =========================================

CREATE TABLE IF NOT EXISTS atelier_users (
  id serial PRIMARY KEY,
  email text NOT NULL UNIQUE CHECK (email = lower(email)),
  password_hash text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Vérification
SELECT email, active, created_at FROM atelier_users ORDER BY email;
