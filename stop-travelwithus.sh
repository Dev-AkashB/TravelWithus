#!/usr/bin/env bash
# ==============================================================================
# TravelWithUs - Shutdown Utility for Ubuntu / Linux
# Gracefully stops all microservices, frontends, and container workloads
# ==============================================================================

# ANSI Color Palette
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIDS_DIR="$SCRIPT_DIR/.pids"

echo -e "${YELLOW}${BOLD}"
echo "==============================================================================="
echo "            TRAVELWITHUS - ECOSYSTEM SHUTDOWN UTILITY [LINUX]"
echo "==============================================================================="
echo -e "${NC}"

# 1. Stop Docker Compose containers if active
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
    echo -e "${CYAN}[*] Stopping Docker containers...${NC}"
    if docker compose version >/dev/null 2>&1; then
        docker compose -f "$SCRIPT_DIR/docker-compose.yml" down 2>/dev/null || true
    else
        docker-compose -f "$SCRIPT_DIR/docker-compose.yml" down 2>/dev/null || true
    fi
    echo -e "    ${GREEN}[✔] Docker containers stopped.${NC}"
fi

# 2. Terminate PID-tracked processes
if [ -d "$PIDS_DIR" ]; then
    echo -e "\n${CYAN}[*] Terminating tracked background processes...${NC}"
    for pid_file in "$PIDS_DIR"/*.pid; do
        if [ -f "$pid_file" ]; then
            svc_name=$(basename "$pid_file" .pid)
            pid=$(cat "$pid_file" 2>/dev/null || true)
            if [ -n "$pid" ] && kill -0 "$pid" >/dev/null 2>&1; then
                echo -e "    Stopping $svc_name (PID: $pid)..."
                kill "$pid" 2>/dev/null || true
                sleep 0.5
                if kill -0 "$pid" >/dev/null 2>&1; then
                    kill -9 "$pid" 2>/dev/null || true
                fi
            fi
            rm -f "$pid_file"
        fi
    done
fi

# 3. Kill lingering processes listening on TravelWithUs service ports
PORTS=(3000 3001 8080 8761 8888 8081 8082 8083 8084 8085 8086 8087 8088 8089)

echo -e "\n${CYAN}[*] Verifying service ports are clear...${NC}"
for port in "${PORTS[@]}"; do
    # Try lsof
    if command -v lsof >/dev/null 2>&1; then
        pids=$(lsof -ti :"$port" 2>/dev/null || true)
        if [ -n "$pids" ]; then
            echo -e "    ${YELLOW}Releasing port $port (PID: $pids)${NC}"
            echo "$pids" | xargs -r kill -9 2>/dev/null || true
        fi
    # Try fuser fallback
    elif command -v fuser >/dev/null 2>&1; then
        fuser -k -n tcp "$port" 2>/dev/null || true
    fi
done

echo -e "\n${GREEN}${BOLD}"
echo "==============================================================================="
echo "               SHUTDOWN COMPLETE - ALL SERVICES STOPPED        "
echo "==============================================================================="
echo -e "${NC}"
