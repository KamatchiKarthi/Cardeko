# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace manifests first so npm can resolve workspaces
COPY package.json package-lock.json .npmrc ./
COPY packages/types/package.json ./packages/types/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/
COPY apps/server/package.json ./apps/server/

RUN npm install

# Copy source and compile
COPY packages/types ./packages/types
COPY apps/server ./apps/server
COPY tsconfig.json ./

RUN npm run build --workspace=packages/types
RUN npm run build --workspace=apps/server

# ── Stage 2: production image ─────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json .npmrc ./
COPY packages/types/package.json ./packages/types/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/
COPY apps/server/package.json ./apps/server/

# Install production dependencies only
RUN npm install --omit=dev

# Copy compiled output from builder
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/packages/types/dist ./packages/types/dist

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "apps/server/dist/index.js"]
