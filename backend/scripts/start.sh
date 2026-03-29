#!/usr/bin/env sh
set -e

EMBEDDING_INTERNAL_PORT="${EMBEDDING_INTERNAL_PORT:-8000}"
export EMBEDDING_SERVICE_URL="${EMBEDDING_SERVICE_URL:-http://127.0.0.1:${EMBEDDING_INTERNAL_PORT}}"

# Start embedding service on an internal port.
python -m uvicorn main:app \
  --app-dir /app/embedding-service \
  --host 0.0.0.0 \
  --port "${EMBEDDING_INTERNAL_PORT}" &

# Start public Go API on Render-provided PORT.
exec /usr/local/bin/archer-api
