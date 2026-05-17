# =============================================================================
# Porterfield Heroes — API (Fastify) Dockerfile multi-stage
# Build context : monorepo root (cd .. && docker build -f apps/api/Dockerfile .)
#
# Note prod: les packages workspace (@ph/db, @ph/shared) exposent leur source TS
# via leurs exports — donc on exécute l'API en prod avec tsx (transpile JIT).
# Tradeoff : +500ms startup, mais évite la complexité d'un build cross-workspace.
# =============================================================================

# ---- Stage 1 : deps install ------------------------------------------------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile --prod=false

# ---- Stage 2 : runtime -----------------------------------------------------
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache tini

# tsx pour exécuter le TS workspace en prod (cf. note en tête de fichier)
RUN npm install -g tsx@4.22.0

RUN addgroup -g 1001 -S nodejs && adduser -S api -u 1001

# Copy resolved node_modules from deps stage
COPY --from=deps --chown=api:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=api:nodejs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps --chown=api:nodejs /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=deps --chown=api:nodejs /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy source files
COPY --chown=api:nodejs apps/api/src ./apps/api/src
COPY --chown=api:nodejs apps/api/package.json ./apps/api/
COPY --chown=api:nodejs packages/db ./packages/db
COPY --chown=api:nodejs packages/shared ./packages/shared
COPY --chown=api:nodejs package.json pnpm-workspace.yaml ./

USER api
EXPOSE 3031
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["tsx", "apps/api/src/server.ts"]
