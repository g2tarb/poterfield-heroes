# Déploiement Porterfield Heroes

Trois cibles supportées. **Coolify sur VPS Hostinger** est la cible recommandée.

---

## Variables d'environnement

Toutes celles ci-dessous se posent au niveau du **service web** ET **service api**
(Coolify duplique ; en docker-compose elles sont mutualisées via `.env.production`).

| Variable | Obligatoire | Description |
|---|---|---|
| `DATABASE_URL` | oui | `postgresql://user:pwd@host:5432/db` (pgvector requis) |
| `SESSION_SECRET` | oui | Clé HMAC cookie session. `openssl rand -hex 32` |
| `ACCESS_PASSWORD` | oui | Mot de passe perso (login mono-user) |
| `CORS_ORIGIN` | oui | URL exacte du web prod (ex: `https://porterfield.online`) |
| `NEXT_PUBLIC_API_URL` | oui | URL publique de l'API (web → api) |
| `ANTHROPIC_API_KEY` | oui | `sk-ant-api03-...` (coach + exercice + skill validator) |
| `NODE_ENV` | oui | `production` |
| `API_PORT` | non | défaut `3031` |
| `API_HOST` | non | défaut `0.0.0.0` |
| `MONTHLY_AI_BUDGET_CENTS` | non | défaut `5000` (50€). 429 si dépassé |
| `VOYAGE_API_KEY` | non | RAG embeddings (sans → RAG désactivé) |
| `REDIS_URL` | non | rate-limit distribué (sans → en mémoire) |
| `GITHUB_APP_ID` / `GITHUB_APP_PRIVATE_KEY` / `GITHUB_WEBHOOK_SECRET` / `GITHUB_INSTALLATION_ID` | non | Code review IA via webhook GitHub App |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` | non | Push notifications PWA |
| `SENTRY_DSN` | non | Reporting erreurs côté API (et server/edge web) |
| `NEXT_PUBLIC_SENTRY_DSN` | non | Reporting erreurs côté navigateur (web) |

Si Sentry n'est pas configuré, les exceptions tombent dans les logs Pino seulement —
l'app fonctionne normalement.

---

## 🟢 Option A — Coolify sur VPS Hostinger (recommandé)

### Pré-requis côté toi

- [ ] VPS Hostinger commandé (KVM 2 ou KVM 4 conseillés — 2 vCPU / 4 Go RAM minimum)
- [ ] Accès SSH root ou sudo
- [ ] Domaine pointé (A record vers IP du VPS) — `porterfield.tondomaine.com` + `api.porterfield.tondomaine.com`

### 1. Installer Coolify sur le VPS (10 min)

```bash
ssh root@<TON_IP>
curl -fsSL https://cdn.coolify.io/coolify/install.sh | bash
```

Coolify s'expose sur `http://<TON_IP>:8000`. Crée le compte admin direct.

### 2. Ajouter le projet dans Coolify

1. **New Resource** → **Public Repository** → colle l'URL GitHub du repo (push d'abord)
2. **Type** : Docker Compose
3. **Compose file** : `docker-compose.prod.yml`
4. **Build pack** : Docker Compose

### 3. Configurer les variables d'env

Dans Coolify → ton service → **Environment Variables**, ajoute toutes celles de `.env.production.example` :

```
POSTGRES_PASSWORD=         openssl rand -base64 32
SESSION_SECRET=            openssl rand -hex 32
ACCESS_PASSWORD=           ton mot de passe perso
CORS_ORIGIN=               https://porterfield.tondomaine.com
PUBLIC_API_URL=            https://api.porterfield.tondomaine.com
ANTHROPIC_API_KEY=         sk-ant-api03-... (celle de console.anthropic.com)
VOYAGE_API_KEY=            pa-... (celle de dash.voyageai.com)
```

### 4. Domaines

Dans Coolify → service `web` → **Domains** : `https://porterfield.tondomaine.com`  
Service `api` → **Domains** : `https://api.porterfield.tondomaine.com`

Coolify gère Let's Encrypt automatiquement → HTTPS en ~1 min.

### 5. Deploy

Clique **Deploy**. Premier build : ~5-10 min. Logs en direct dans l'UI.

### 6. Initialiser la DB (une fois, après premier deploy)

```bash
# SSH dans le VPS, puis :
docker exec -it ph_api_prod sh
node apps/api/dist/scripts/seed.js   # ou pnpm db:seed selon la structure
```

### 7. Auto-deploy git push

Dans Coolify → ton service → **Sources** → coche **Auto Deploy on push**. À chaque `git push origin main`, redéploie automatique.

---

## 🟡 Option B — VPS sans Coolify (docker-compose direct)

### Setup une fois

```bash
ssh root@<TON_IP>
apt update && apt install -y docker.io docker-compose-plugin git
git clone https://github.com/<toi>/porterfield-heroes.git
cd porterfield-heroes
cp .env.production.example .env.production
nano .env.production   # remplis tout
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

### Reverse proxy HTTPS (Caddy en 1 ligne)

```bash
# Sur le VPS, en root :
curl -sSL https://caddyserver.com/api/download/linux/amd64 -o /usr/local/bin/caddy
chmod +x /usr/local/bin/caddy
```

Crée `/etc/caddy/Caddyfile` :
```
porterfield.tondomaine.com {
  reverse_proxy localhost:3030
}
api.porterfield.tondomaine.com {
  reverse_proxy localhost:3031
}
```

```bash
caddy run --config /etc/caddy/Caddyfile &
```

HTTPS automatique via Let's Encrypt.

### Update après git push

```bash
git pull
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

---

## 🔵 Option C — Vercel + Neon (rapide, hybride)

Pas idéal pour mono-user self-hosted (perte de souveraineté + coûts), mais possible si tu veux du **deploy en 10 min**.

### Web sur Vercel

```bash
cd apps/web
vercel
```

### API sur Railway / Render / Fly.io (Docker)

Pousse le Dockerfile API sur Railway. Plus simple : `railway up`.

### DB sur Neon

Neon supporte pgvector natif. Crée un projet → copie la `DATABASE_URL` → mets-la dans Railway + Vercel env.

---

## ✅ Checklist post-deploy

- [ ] `https://porterfield.tondomaine.com` charge le login
- [ ] Login avec `ACCESS_PASSWORD` fonctionne
- [ ] Dashboard affiche l'escalier 25 modules
- [ ] Coach IA répond (test 1 message)
- [ ] SRS affiche les cartes
- [ ] Service worker enregistré (PWA installable)
- [ ] HTTPS OK (cadenas vert)
- [ ] Auto-deploy GitHub configuré

---

## 🔐 Sécurité prod

- **Postgres** : pas exposé publiquement (pas de `ports:` dans compose prod)
- **API** : si reverse proxy en place, retire `ports: 3031` du compose
- **CORS** : strictement le domaine du web
- **Cookie httpOnly** : déjà configuré, `SameSite=lax`
- **Backups** : workflow GitHub Actions `backup.yml` activé (cron quotidien 3h UTC).
  Pour qu'il fonctionne, configure ces 4 secrets dans GitHub repo settings :
  - `DATABASE_URL_PROD` : URL externe Postgres prod (Coolify → DB → "Connection String External")
  - `R2_ACCOUNT_ID` : Cloudflare R2 account ID
  - `R2_ACCESS_KEY_ID` : R2 API token access key
  - `R2_SECRET_ACCESS_KEY` : R2 API token secret
  - `R2_BUCKET_NAME` : nom du bucket (ex: `porterfield-backups`)
  Trigger manuel : Actions tab → "Backup Postgres → R2" → Run workflow.
- **Rate limiting** : 5 tentatives/5min sur `/api/auth/login` (Fastify rate-limit plugin)
- **Cost cap IA** : `MONTHLY_AI_BUDGET_CENTS` env var (défaut 5000¢ = 50€).
  Au-delà, tous les calls Claude retournent 429. Vu dans Settings UI.

---

## 🆘 Troubleshooting

| Symptôme | Cause probable | Fix |
|---|---|---|
| `502 Bad Gateway` | API n'a pas démarré | `docker logs ph_api_prod` |
| `Connection refused postgres` | Race condition au boot | Healthcheck postgres OK ? Voir `docker compose ps` |
| `pgvector extension not found` | Init script pas appliqué | `docker exec ph_postgres_prod psql -U ph -c "CREATE EXTENSION vector;"` |
| HTTPS échoue | DNS pas propagé | Attendre 5-15 min après config DNS, vérifier avec `dig porterfield.tondomaine.com` |
| `401` après login | CORS_ORIGIN ≠ URL navigateur | Vérifier var d'env, le frontend doit appeler depuis le même domaine que CORS |
