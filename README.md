# Porterfield Heroes

Atelier privé d'apprentissage dev fullstack. Mono-user, web + PWA mobile,
coach IA permanent, 25 modules verrouillés en cascade, SRS FSRS-4, RAG
embeddings, GitHub code review IA, examens hebdomadaires auto-générés.

> Pour utiliser l'app au quotidien, voir [ONBOARDING.md](ONBOARDING.md).
> Pour le déploiement prod, voir [DEPLOY.md](DEPLOY.md).

## Stack

- **Frontend** : Next.js 15 + React 19 + Tailwind v4 + TypeScript strict
- **Backend** : Fastify 5 + Drizzle ORM + Postgres 16 + pgvector
- **IA** : Anthropic Claude (Haiku 4.5 + Sonnet 4.6 + Opus 4.7) + Voyage AI embeddings
- **Sandbox** : Web Worker isolé (JS/TS), Pyodide WASM (Python)
- **PWA** : Service worker offline-first (Serwist) + Web Push (VAPID)
- **Deploy** : Docker multi-stage + Coolify + Traefik

## Structure

```
apps/
  web/         Next.js 15 app router (PWA, server components)
  api/         Fastify 5 backend (REST + SSE streaming)
packages/
  db/          Drizzle schemas + migrations (27 tables)
  shared/      Types + utils + algo FSRS-4
.github/workflows/
  ci.yml       Lint + typecheck + tests intégration
  backup.yml   Backup quotidien Postgres → R2 (3h UTC)
```

## Setup local

```bash
# 1. Lancer Postgres + Redis
pnpm docker:up

# 2. Installer les deps
pnpm install

# 3. Pousser le schéma DB
pnpm db:push

# 4. Seeder les données initiales (25 modules)
pnpm db:seed

# 5. Lancer dev (API + Web en parallèle)
pnpm dev
```

URLs locales :
- Web : http://localhost:3030
- API : http://localhost:3031
- Drizzle Studio : http://localhost:4983 (via `pnpm db:studio`)

## Variables d'environnement

Voir `.env.example` pour la liste complète. Requises pour dev :

```bash
DATABASE_URL=postgresql://ph:pwd@localhost:5432/porterfield
SESSION_SECRET=<32+ chars random>
ACCESS_PASSWORD=<ton password>
CORS_ORIGIN=http://localhost:3030
ANTHROPIC_API_KEY=sk-ant-...
VOYAGE_API_KEY=pa-...              # optionnel, pour RAG embeddings
MONTHLY_AI_BUDGET_CENTS=5000       # cap mensuel (50€)
```

## Scripts utiles

| Commande | Description |
|---|---|
| `pnpm dev` | Lance web + api en parallèle |
| `pnpm db:generate` | Génère une migration Drizzle depuis le schéma |
| `pnpm db:push` | Applique le schéma direct (dev only) |
| `pnpm db:migrate` | Applique les migrations versionnées (prod) |
| `pnpm db:seed` | Seed les 25 modules + skills + exos |
| `pnpm db:studio` | Ouvre Drizzle Studio (UI DB) |
| `pnpm typecheck` | TS check sur tout le repo |
| `pnpm -r test:unit` | Tests unit |
| `pnpm -r test:integration` | Tests intégration (nécessite DB live) |

## Architecture des features

### Boucle d'apprentissage core
- **Modules verrouillés en cascade** : `routes/modules.ts` calcule le 1er
  module non-completed → `active`. Pas d'insertion manuelle nécessaire.
- **Exercices in-app** : `services/exerciseCorrector.ts` + Claude Haiku
- **Skills cochables** : `services/skillValidator.ts` génère question + valide
- **SRS FSRS-4** : `packages/shared/src/fsrs.ts` (algorithme pur, testé)
- **Coach IA** : `services/coach.ts` (streaming SSE + RAG injection)
- **Examens hebdo** : `services/examGenerator.ts` (cron hourly)

### Sécurité
- Auth password stateless (cookie signé HMAC SHA256, SameSite=None+Secure)
- Validation Zod à toutes les frontières
- Rate limit Fastify (5/5min sur /login)
- CSP strict, HSTS, X-Frame-Options, etc.
- IP/host whitelist côté reverse proxy (Coolify Traefik)

### Cost tracking IA
- Table `ai_costs` persiste chaque appel Claude par catégorie
- `services/costTracker.ts` : `trackAiCost`, `assertBudget`, `getAiSpendStats`
- Cap mensuel via `MONTHLY_AI_BUDGET_CENTS` (429 si dépassé)
- Wrapper unique `lib/claudeCall.ts` pour TOUS les appels Claude

### Code Noir (module sécurité offensive/défensive)
- `lib/codeNoirData.ts` : 26 techniques mappées M01-M25
- `lib/codeNoirPersona.ts` : prompt Mentor Offensive Senior cadré CTF
- `routes/codeNoir.ts` : GET /state + POST /ask
- UI dédiée terminal hacker (`/code-noir`)
- Déblocage par overscroll-pull 3s sur le dashboard

## Tests

- **Unit** : `packages/shared` (FSRS-4 testé exhaustivement)
- **Intégration** : `apps/api/src/routes/*.integration.test.ts` (health, auth)
- Pas de tests e2e Playwright pour l'instant — à venir

## Owner

Erwin Yana (alias Scory) — projet perso, 2026.
