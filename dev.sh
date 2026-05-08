#!/bin/bash

# ============================================================
# Platform Dev Server Manager
# Usage:
#   ./dev.sh start    — start all 4 apps
#   ./dev.sh stop     — stop all 4 apps
#   ./dev.sh restart  — stop then start all 4 apps
#   ./dev.sh status   — check what's running
#   ./dev.sh logs     — tail logs from all apps (Ctrl+C to exit)
# ============================================================

APPS=("web" "talent" "company" "admin")
PORTS=(3000 3001 3002 3003)
LOG_DIR="/tmp/platform-logs"
PID_DIR="/tmp/platform-pids"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$LOG_DIR" "$PID_DIR"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

print_header() {
  echo ""
  echo -e "${BOLD}$1${NC}"
  echo "────────────────────────────────────"
}

is_running() {
  local port=$1
  lsof -ti:$port > /dev/null 2>&1
}

stop_app() {
  local app=$1
  local port=$2
  local pid_file="$PID_DIR/$app.pid"

  if is_running $port; then
    local pid=$(lsof -ti:$port)
    kill $pid 2>/dev/null
    sleep 0.5
    # Force kill if still running
    if is_running $port; then
      kill -9 $pid 2>/dev/null
    fi
    rm -f "$pid_file"
    echo -e "  ${RED}◼${NC} $app (port $port) stopped"
  else
    echo -e "  ${YELLOW}○${NC} $app (port $port) was not running"
  fi
}

start_app() {
  local app=$1
  local port=$2
  local app_dir="$ROOT_DIR/apps/$app"
  local log_file="$LOG_DIR/$app.log"
  local pid_file="$PID_DIR/$app.pid"

  if is_running $port; then
    echo -e "  ${YELLOW}⚠${NC}  $app (port $port) already running — skipping"
    return
  fi

  if [ ! -d "$app_dir" ]; then
    echo -e "  ${RED}✗${NC} $app directory not found: $app_dir"
    return
  fi

  # Start the app
  cd "$app_dir"
  npm run dev > "$log_file" 2>&1 &
  echo $! > "$pid_file"
  cd "$ROOT_DIR"

  echo -e "  ${BLUE}▶${NC} $app starting on port $port..."
}

wait_for_ready() {
  echo ""
  echo -e "${BOLD}Waiting for apps to be ready...${NC}"
  local all_ready=false
  local attempts=0
  local max_attempts=30

  while [ $attempts -lt $max_attempts ]; do
    all_ready=true
    for i in "${!APPS[@]}"; do
      local port=${PORTS[$i]}
      if ! is_running $port; then
        all_ready=false
        break
      fi
    done

    if $all_ready; then
      break
    fi

    sleep 1
    ((attempts++))
    printf "."
  done

  echo ""
  echo ""

  # Print status
  for i in "${!APPS[@]}"; do
    local app=${APPS[$i]}
    local port=${PORTS[$i]}
    if is_running $port; then
      echo -e "  ${GREEN}✓${NC} ${BOLD}$app${NC}    → http://localhost:$port"
    else
      echo -e "  ${RED}✗${NC} ${BOLD}$app${NC}    → failed to start (check: tail -f $LOG_DIR/$app.log)"
    fi
  done
  echo ""
}

cmd_start() {
  print_header "Starting platform dev servers"
  for i in "${!APPS[@]}"; do
    start_app "${APPS[$i]}" "${PORTS[$i]}"
  done
  wait_for_ready
}

cmd_stop() {
  print_header "Stopping platform dev servers"
  for i in "${!APPS[@]}"; do
    stop_app "${APPS[$i]}" "${PORTS[$i]}"
  done
  echo ""
}

cmd_restart() {
  cmd_stop
  sleep 1
  cmd_start
}

cmd_status() {
  print_header "Platform dev server status"
  for i in "${!APPS[@]}"; do
    local app=${APPS[$i]}
    local port=${PORTS[$i]}
    if is_running $port; then
      local pid=$(lsof -ti:$port)
      echo -e "  ${GREEN}●${NC} ${BOLD}$app${NC}    http://localhost:$port  (PID $pid)"
    else
      echo -e "  ${RED}○${NC} ${BOLD}$app${NC}    not running"
    fi
  done
  echo ""
}

cmd_logs() {
  local log_files=()
  for app in "${APPS[@]}"; do
    log_files+=("$LOG_DIR/$app.log")
  done
  echo -e "${BOLD}Tailing logs for all apps (Ctrl+C to exit)${NC}"
  echo "────────────────────────────────────"
  tail -f "${log_files[@]}" 2>/dev/null
}

# ── Main ──────────────────────────────────────────────────────────
case "${1:-}" in
  start)   cmd_start ;;
  stop)    cmd_stop ;;
  restart) cmd_restart ;;
  status)  cmd_status ;;
  logs)    cmd_logs ;;
  *)
    echo ""
    echo -e "${BOLD}Platform Dev Server Manager${NC}"
    echo ""
    echo "  Usage: ./dev.sh <command>"
    echo ""
    echo "  Commands:"
    echo "    start    Start all 4 apps"
    echo "    stop     Stop all 4 apps"
    echo "    restart  Stop then start all 4 apps"
    echo "    status   Show what's running"
    echo "    logs     Tail logs from all apps"
    echo ""
    ;;
esac
