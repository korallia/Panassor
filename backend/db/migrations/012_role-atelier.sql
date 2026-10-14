-- =========================================
-- Utilisateur Postgres propre à l'atelier : il ne voit QUE ce dont il a
-- besoin (produits, photos, couleurs, composants, ses utilisateurs) et ne
-- peut écrire QUE le stock. Aucun accès aux commandes, expéditions ni
-- aux données des clients.
-- À exécuter UNE fois sur chaque base (Neon, live RDS), avec l'utilisateur
-- principal (celui du site).
--
-- Le mot de passe n'est PAS dans ce fichier (il est dans Git). Après la
-- migration, dans pgAdmin, une seule fois :
--   ALTER ROLE atelier_app PASSWORD 'un-long-mot-de-passe-au-hasard';
-- Puis, dans Vercel (projet de l'atelier), DATABASE_URL devient :
--   postgresql://atelier_app:<ce mot de passe>@<même hôte>:5432/<même base>
--
-- Les tables de la grande tâche d'inventaire donneront leurs droits à
-- atelier_app dans leur propre migration.
-- =========================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'atelier_app') THEN
    CREATE ROLE atelier_app LOGIN;
  END IF;
END
$$;

-- On repart de zéro : aucun droit par défaut sur les tables.
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM atelier_app;

DO $$
BEGIN
  EXECUTE format('GRANT CONNECT ON DATABASE %I TO atelier_app', current_database());
END
$$;
GRANT USAGE ON SCHEMA public TO atelier_app;

-- Lecture : seulement le catalogue et les comptes de l'atelier.
GRANT SELECT ON
  collections,
  products,
  product_images,
  colors,
  product_color_variants,
  product_options,
  kit_components,
  atelier_users
TO atelier_app;

-- Écriture : seulement le stock (étuis de cuir par kit et par couleur).
GRANT UPDATE (case_stock, case_minimum) ON product_color_variants TO atelier_app;

-- Vérification : les droits de l'atelier, table par table.
SELECT table_name, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS droits
FROM information_schema.role_table_grants
WHERE grantee = 'atelier_app'
GROUP BY table_name
UNION ALL
SELECT table_name || ' (colonnes ' || string_agg(column_name, ', ') || ')', 'UPDATE'
FROM information_schema.column_privileges
WHERE grantee = 'atelier_app' AND privilege_type = 'UPDATE'
GROUP BY table_name
ORDER BY 1;
