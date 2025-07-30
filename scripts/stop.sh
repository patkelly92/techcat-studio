#!/usr/bin/env bash
# Stops FastAPI & Next.js that were started by start.sh

set -euo pipefail
IFS=$'\n\t'

RUN_DIR="$(pwd)/.run"

stop_service () {
  local name=$1
  local pid_file="$RUN_DIR/$name.pid"
  if [[ -f "$pid_file" ]]; then
    local pid
    pid=$(cat "$pid_file")
    echo "⏹  Stopping $name (PID $pid)…"
    kill "$pid" 2>/dev/null || true
    rm -f "$pid_file"
  else
    echo "ℹ️  $name not running."
  fi
}

stop_service frontend
stop_service backend

echo "✅  Dev services stopped."