#!/bin/sh
set -e

# Self-Healing: Jika volume persistent storage Coolify/Docker di-mount menimpa /app/database,
# sinkronkan seluruh file kode JavaScript dan SQL terbaru ke folder volume database
# sambil tetap menjaga keutuhan file SQLite database (telcolearn.db).
if [ -d "/app/database_core" ] && [ -d "/app/database" ]; then
  cp -f /app/database_core/*.js /app/database/ 2>/dev/null || true
  cp -f /app/database_core/*.sql /app/database/ 2>/dev/null || true
fi

exec "$@"
