#!/usr/bin/env bash
# ==============================================================================
# TravelWithUs - Service Status & Health Inspector for Ubuntu / Linux
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

echo -e "${CYAN}${BOLD}"
echo "==============================================================================="
echo "               TRAVELWITHUS - SERVICE STATUS & HEALTH CHECK"
echo "==============================================================================="
echo -e "${NC}"

printf "%-25s %-8s %-10s %-14s %-12s\n" "SERVICE" "PORT" "PID" "STATUS" "HEALTH"
echo "-------------------------------------------------------------------------------"

check_service() {
    local name="$1"
    local port="$2"
    local health_path="${3:-/actuator/health}"
    local pid="-"
    local status="${RED}STOPPED${NC}"
    local health="-"

    # Check PID file first
    if [ -f "$PIDS_DIR/$name.pid" ]; then
        local tracked_pid
        tracked_pid=$(cat "$PIDS_DIR/$name.pid" 2>/dev/null || true)
        if [ -n "$tracked_pid" ] && kill -0 "$tracked_pid" 2>/dev/null; then
            pid="$tracked_pid"
        fi
    fi

    # Check port via /dev/tcp or lsof
    if (echo > "/dev/tcp/127.0.0.1/$port") >/dev/null 2>&1; then
        status="${GREEN}LISTENING${NC}"
        if [ "$pid" = "-" ] && command -v lsof >/dev/null 2>&1; then
            pid=$(lsof -ti :"$port" 2>/dev/null | head -n 1 || echo "-")
        fi

        # Probe health endpoint
        if command -v curl >/dev/null 2>&1; then
            local http_code
            http_code=$(curl -s -o /dev/null -w "%{http_code}" -m 2 "http://127.0.0.1:$port$health_path" 2>/dev/null || echo "ERR")
            if [ "$http_code" = "200" ]; then
                health="${GREEN}UP (200)${NC}"
            elif [ "$http_code" = "ERR" ]; then
                health="${YELLOW}CONNECT_ERR${NC}"
            else
                health="${YELLOW}HTTP $http_code${NC}"
            fi
        fi
    fi

    printf "%-25s %-8s %-10s %-23b %-20b\n" "$name" "$port" "$pid" "$status" "$health"
}

# Core Infrastructure
check_service "Eureka Registry" "8761" "/"
check_service "Config Server" "8888" "/actuator/health"
check_service "API Gateway" "8080" "/actuator/health"

# Security & Business Microservices
check_service "Auth Service" "8081" "/actuator/health"
check_service "User Service" "8082" "/actuator/health"
check_service "Destination Service" "8083" "/actuator/health"
check_service "Package Service" "8084" "/actuator/health"
check_service "Hotel Service" "8085" "/actuator/health"
check_service "Booking Service" "8086" "/actuator/health"
check_service "Payment Service" "8087" "/actuator/health"
check_service "Notification Service" "8088" "/actuator/health"
check_service "Review Service" "8089" "/actuator/health"

# Frontend Applications
check_service "Customer Web" "3000" "/"
check_service "Admin Console" "3001" "/"

echo "-------------------------------------------------------------------------------"
echo ""
