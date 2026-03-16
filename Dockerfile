# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Build client (Vite) + server (esbuild)
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: Production runtime
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Only install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Copy any static assets that are served at runtime
COPY --from=builder /app/published_documents ./published_documents

# Expose the application port
EXPOSE 5000

# Health check for Railway / load balancers
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "dist/index.cjs"]
