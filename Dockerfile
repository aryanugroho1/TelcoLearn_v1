# Multi-stage / lightweight Node.js 22 Alpine base
# Supports native node:sqlite (Node 22+) and ESM modules
FROM node:22-alpine

# Install tzdata for accurate Asia/Jakarta timezone in cron jobs and reports
RUN apk add --no-cache tzdata

# Set working directory
WORKDIR /app

# Set default production environment variables
ENV NODE_ENV=production \
    TZ=Asia/Jakarta

# Copy dependency manifests first for optimal Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev || npm install --omit=dev

# Copy application source code
COPY . .

# Backup fresh source database code to sync with mounted volumes at container boot
RUN mkdir -p /app/database_core && cp -r /app/database/* /app/database_core/

# Copy and set permissions for entrypoint self-healing script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Ensure runtime directories exist for volumes
RUN mkdir -p /app/auth_info_baileys /app/data /app/database /app/reports

# Expose HTTP Web Gateway (QR Code portal & healthcheck)
EXPOSE 3000

# Entrypoint auto-syncs database code to persistent volumes then starts daemon
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "index.js"]
