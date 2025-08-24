# ──────────────────────────────
# Stage 1 – build / dependency layer
# ──────────────────────────────
# • Uses patched base image (node 20.19.2 + alpine 3.20) to remove libxml2 & OpenSSL CVEs
# • Installs ONLY production dependencies
FROM node:20.19.2-alpine3.20 AS builder

# Always keep the base image packages current
RUN apk update && apk upgrade --no-cache

WORKDIR /workspace

# Copy manifests first to leverage Docker-layer caching
COPY package*.json ./

# Install deps; --omit=dev replaces “npm install --production” in npm >= 7
RUN npm ci --omit=dev --silent \
    && npm cache clean --force

# Application source
COPY app.js .

# ──────────────────────────────
# Stage 2 – runtime image
# ──────────────────────────────
# • Same patched base image → minimal CVE surface
# • Adds tini as a minimal init system
# • Runs as the pre-created non-root “node” user
FROM node:20.19.2-alpine3.20

# Apply any fresh distro patches + install tini
RUN apk update && \
    apk add --no-cache tini && \
    apk upgrade --no-cache

WORKDIR /usr/src/app

# Copy built artefacts & dependencies from builder stage
COPY --from=builder /workspace ./

# Best-practice runtime settings
USER node
ENV NODE_ENV=production

EXPOSE 80
ENTRYPOINT ["tini", "--"]
CMD ["node", "app.js"]
