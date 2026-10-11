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

# Ensure runtime directories exist for volumes
RUN mkdir -p /app/auth_info_baileys /app/database /app/reports

# Declare persistent volumes
VOLUME ["/app/auth_info_baileys", "/app/database", "/app/reports"]

# Start the TelcoLearn Baileys + Gemini daemon
CMD ["node", "index.js"]
