# Backups Postgres → Cloudflare R2

Workflow GitHub Actions quotidien qui :
1. `pg_dump --format=custom` la DB de prod
2. Upload sur Cloudflare R2 (S3-compatible) via `rclone`
3. Garde les 30 derniers backups (auto-prune)

## Secrets GitHub à configurer

Dans GitHub → repo → Settings → Secrets and variables → Actions :

| Secret | Valeur |
|---|---|
| `DATABASE_URL_PROD` | `postgresql://user:pass@host:5432/porterfield` (prod) |
| `R2_ACCOUNT_ID` | ID de ton compte Cloudflare (cf. dashboard R2) |
| `R2_ACCESS_KEY_ID` | Access key R2 (créer un token avec scope `Object Read & Write`) |
| `R2_SECRET_ACCESS_KEY` | Secret key R2 |
| `R2_BUCKET` | Nom du bucket R2 (ex: `porterfield-backups`) |

## Créer le bucket R2

```bash
# Via wrangler (Cloudflare CLI)
npx wrangler r2 bucket create porterfield-backups

# Ou via Cloudflare Dashboard → R2 → Create bucket → "porterfield-backups"
```

## Tester le workflow manuellement

GitHub → Actions → "Backup Postgres → R2" → Run workflow.

## Restaurer un backup

```bash
# Récupérer un backup depuis R2
rclone copy r2:porterfield-backups/postgres-backups/porterfield-20260514T030000Z.dump .

# Restaurer dans une DB neuve (vide)
createdb porterfield_restored
pg_restore --no-owner --no-acl --dbname=porterfield_restored porterfield-20260514T030000Z.dump
```

## Coût estimatif

R2 = **$0.015/GB/mois** stocké, **0$** d'egress (gratuit).
30 backups × ~50 MB chacun = 1.5 GB = **~0.02 €/mois**. Indolore.
