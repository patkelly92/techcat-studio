#!/usr/bin/env bash
# One-shot launcher: PostgreSQL (brew), FastAPI (Uvicorn) & Next.js (Turbopack)
# Writes PIDs to .run/  so they can be shut down by stop.sh

set -euo pipefail
IFS=$'\n\t'

BACKEND_CMD="uvicorn apps.api.main:app --port 9000 --reload"
FRONTEND_CMD="npm run dev --turbopack"
FRONTEND_DIR="apps/techcat-studio"
PG_SERVICE="postgresql"
PG_PORT=5432
LOG_DIR="$(pwd)/.logs"
RUN_DIR="$(pwd)/.run"

mkdir -p "$LOG_DIR" "$RUN_DIR"

# ───────────────────────────────── helpers ──────────────────────────────────
already_running () { [[ -f "$RUN_DIR/$1.pid" ]] && kill -0 "$(cat "$RUN_DIR/$1.pid")" 2>/dev/null; }

abort_if_running () {
  if already_running "$1"; then
    echo "⛔  $1 is already running (PID $(cat "$RUN_DIR/$1.pid")).  Stop it first."; exit 1
  fi
}

# ───────────────────────────────── launch ───────────────────────────────────
echo "▶️  Starting PostgreSQL via Homebrew …"
brew services start "$PG_SERVICE" >/dev/null

echo "⏳  Waiting for Postgres on port $PG_PORT …"
until nc -z localhost "$PG_PORT"; do sleep 1; done
echo "✅  Postgres is up."

abort_if_running backend
abort_if_running frontend

echo "🚀  Starting FastAPI (backend) …"
nohup $BACKEND_CMD >"$LOG_DIR/backend.log" 2>&1 &
echo $! > "$RUN_DIR/backend.pid"

echo "🚀  Starting Next.js (frontend) …"
(
  cd "$FRONTEND_DIR"
  nohup $FRONTEND_CMD >"$LOG_DIR/frontend.log" 2>&1 &
  echo $! > "$RUN_DIR/frontend.pid"
)

echo "🎉  All services started.
    • API      → http://localhost:9000
    • Next.js  → http://localhost:3000
Logs → $LOG_DIR
Stop → ./scripts/stop.sh
"