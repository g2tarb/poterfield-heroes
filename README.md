# Porterfield Heroes

Plateforme personnelle d'apprentissage dev fullstack.
Mono-user, web + PWA mobile, coach IA permanent.

## Stack

- **Frontend** : Next.js 15 + React 19 + Tailwind v4 + TypeScript strict
- **Backend** : Fastify 5 + Drizzle ORM + Postgres 16 + pgvector
- **IA** : Anthropic Claude + Voyage AI embeddings
- **Sandbox** : Pyodide (Python), PGlite (SQL), WebContainers (Node), Docker éphémère (fallback)
- **PWA** : Service worker offline-first + Web Push

## Structure

```
apps/
  web/         Next.js 15 app
  api/         Fastify 5 backend
packages/
  db/          Drizzle schemas + migrations
  shared/      Types + utils partagés
```

## Setup local

```bash
# 1. Lancer Postgres + Redis
pnpm docker:up

# 2. Installer les deps
pnpm install

# 3. Pousser le schéma DB
pnpm db:push

# 4. Seeder les données initiales
pnpm db:seed

# 5. Lancer dev (API + Web en parallèle)
pnpm dev
```

URLs locales :
- Web : http://localhost:3000
- API : http://localhost:3001
- Drizzle Studio : http://localhost:4983 (via `pnpm db:studio`)

## Scripts utiles

| Commande | Description |
|---|---|
| `pnpm dev` | Lance web + api en parallèle |
| `pnpm db:generate` | Génère une migration Drizzle |
| `pnpm db:migrate` | Applique les migrations |
| `pnpm db:studio` | Ouvre Drizzle Studio |
| `pnpm typecheck` | TS check sur tout le repo |

## Owner

Erwin (Scory) — projet perso, 2026.
