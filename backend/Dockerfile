# ---- KidScape backend (Node + Express) ----
FROM node:22-alpine

WORKDIR /app

# Install production dependencies first for better layer caching.
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# App source.
COPY . .

# Make the entrypoint executable (runs the create-only admin seed, then the server).
RUN chmod +x docker-entrypoint.sh

ENV NODE_ENV=production \
    PORT=5000

EXPOSE 5000

# Drop to the built-in non-root user.
USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["./docker-entrypoint.sh"]
