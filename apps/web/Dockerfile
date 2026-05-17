# =============================================================================
# Porterfield Heroes — Web (Next.js 15) Dockerfile multi-stage
# Build context : monorepo root (cd .. && docker build -f apps/web/Dockerfile .)
# Uses Next.js output: "standalone" for minimal runtime image (~150 MB).
# =============================================================================

# ---- Stage 1 : deps ----------------------------------------------------------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile --prod=false

# ---- Stage 2 : build (Next standalone) --------------------------------------
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .

# Build-time public env (baked into JS bundle)
ARG NEXT_PUBLIC_API_URL=http://localhost:3031
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN pnpm --filter @ph/web run build

# ---- Stage 3 : runtime ------------------------------------------------------
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3030
ENV HOSTNAME=0.0.0.0
RUN apk add --no-cache tini
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Standalone output : self-contained server with minimal deps
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3030
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "apps/web/server.js"]
