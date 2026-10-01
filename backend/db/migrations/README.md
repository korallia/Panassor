# Migrations de la base

Chaque fichier modifie la structure ou les données de la base, **une seule fois**,
dans l'ordre des numéros. Pour un nouveau changement : créer `007_nom-court.sql`, etc.

| # | Fichier | Date | Contenu |
|---|---------|------|---------|
| 001 | kit-dimensions | 2026-09-08 | Dimensions des kits chirurgien et tortionnaire (livraison) |
| 002 | voleur-textes-liens | 2026-09-25 | Textes et liens de la collection du voleur |
| 003 | voleur-collection | 2026-09-26 | Produits, images, couleurs et kit du voleur |
| 004 | numero-commande | 2026-09-29 | Numéro de commande donné seulement au paiement |
| 005 | coupon-totaux | 2026-09-29 | Coupon et montants réellement facturés par Square |
| 006 | etuis-et-ensembles | 2026-10-01 | Stock d'étuis sur les variantes de couleur des kits, composants des duos du voleur |

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
