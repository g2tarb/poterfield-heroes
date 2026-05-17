# =============================================================================
# Porterfield Heroes — API (Fastify) Dockerfile multi-stage
# Build context : monorepo root (cd .. && docker build -f apps/api/Dockerfile .)
# =============================================================================

# ---- Stage 1 : deps install (cache layer) ------------------------------------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

# Copy workspace manifests for cache-friendly install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile --prod=false

# ---- Stage 2 : build ---------------------------------------------------------
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .

# Build packages workspaces (db + shared) then API
RUN pnpm --filter @ph/db run build || true
RUN pnpm --filter @ph/shared run build || true
RUN pnpm --filter @ph/api run build

# ---- Stage 3 : runtime (small) ----------------------------------------------
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache tini
RUN addgroup -g 1001 -S nodejs && adduser -S api -u 1001

# Copy only what we need to run
COPY --from=builder --chown=api:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=api:nodejs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder --chown=api:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=api:nodejs /app/apps/api/package.json ./apps/api/
COPY --from=builder --chown=api:nodejs /app/packages/db ./packages/db
COPY --from=builder --chown=api:nodejs /app/packages/shared ./packages/shared
COPY --from=builder --chown=api:nodejs /app/package.json ./

USER api
EXPOSE 3031
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "apps/api/dist/server.js"]
