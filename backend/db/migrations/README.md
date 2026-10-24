# Migrations de la base

Chaque fichier modifie la structure ou les données de la base, **une seule fois**,
dans l'ordre des numéros. Pour un nouveau changement : créer `017_nom-court.sql`, etc.

| # | Fichier | Date | Contenu |
|---|---------|------|---------|
| 001 | kit-dimensions | 2026-09-08 | Dimensions des kits chirurgien et tortionnaire (livraison) |
| 002 | voleur-textes-liens | 2026-09-25 | Textes et liens de la collection du voleur |
| 003 | voleur-collection | 2026-09-26 | Produits, images, couleurs et kit du voleur |
| 004 | numero-commande | 2026-09-29 | Numéro de commande donné seulement au paiement |
| 005 | coupon-totaux | 2026-09-29 | Coupon et montants réellement facturés par Square |
| 006 | etuis-et-ensembles | 2026-10-01 | Stock d'étuis sur les variantes de couleur des kits, composants des duos du voleur |
| 007 | options-produit | 2026-10-01 | Options de produit avec leur prix (aiguilles 1 ou 2) |
| 008 | enveloppe | 2026-10-12 | Enveloppe no 10 comme format d'emballage (option Poste-lettres à 3 $) |
| 009 | mesures-voleur-texte-aiguilles | 2026-10-12 | Poids et mesures des produits du voleur, nouveau texte des aiguilles de suture |
| 010 | textes-kits | 2026-10-12 | Textes des trois kits : « garnie de tous les outils de la collection » |
| 011 | atelier-users | 2026-10-14 | Utilisateurs de l'atelier (courriel + mot de passe en empreinte scrypt) |
| 012 | role-atelier | 2026-10-14 | Utilisateur Postgres de l'atelier : catalogue en lecture, stock en écriture, rien d'autre |
| 013 | atelier-compte | 2026-10-14 | L'atelier peut changer le courriel et le mot de passe de la personne connectée |
| 014 | stock | 2026-10-22 | Stock dans la base (table stock), ajouté et retiré depuis l'atelier — Neon seulement pour l'instant |
| 015 | variantes-aiguilles | 2026-10-23 | Aiguilles comptées par sorte (Droite, Courbe, Aiguille) et ce que retire chaque option (variant_ids) — Neon seulement pour l'instant |
| 016 | product-variants | 2026-10-23 | product_color_variants devient product_variants (couleurs et sortes) ; retrait de case_stock / case_minimum ; vue temporaire product_color_variants pour l'ancien code — Neon seulement pour l'instant |

Toutes ont été appliquées en live (RDS).

## Reconstruire une base neuve

1. `../schema.sql` : la structure complète actuelle (exportée de la base live).
2. `../catalogue.sql` : les données du catalogue (collections, produits, images,
   couleurs, variantes, kits, boîtes). Aucune donnée client.

Pas besoin de rejouer les migrations : elles sont déjà incluses dans `schema.sql`.
Les commandes et envois (données clients) ne sont jamais dans le dépôt : ils sont
protégés par les sauvegardes automatiques de RDS.

## Lancer une migration

Dans pgAdmin : Query Tool, coller le fichier, F5.

Sur EC2, depuis `~/panassor` :

```bash
node --input-type=module -e '
import "dotenv/config"; import fs from "fs"; import pg from "pg";
const c = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await c.connect();
const r = await c.query(fs.readFileSync(process.argv[1], "utf8"));
console.table([].concat(r).at(-1).rows);
await c.end();' backend/db/migrations/006_etuis-et-ensembles.sql
```
