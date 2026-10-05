#!/usr/bin/env bash
# ==============================================================================
# TravelWithUs - Enterprise Launcher for Ubuntu / Linux
# Real-Time Distributed Travel Booking Platform
# ==============================================================================

set -o pipefail

# ANSI Color Palette
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
NC='\033[0m'

# Resolve Project Root Directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"
LOGS_DIR="$ROOT_DIR/logs"
PIDS_DIR="$ROOT_DIR/.pids"

mkdir -p "$LOGS_DIR" "$PIDS_DIR"

# Environment Defaults for Native Execution
export MYSQL_USER="${MYSQL_USER:-root}"
export MYSQL_PASSWORD="${MYSQL_PASSWORD:-root}"
export MYSQL_HOST="${MYSQL_HOST:-localhost}"
export MYSQL_PORT="${MYSQL_PORT:-3306}"
export CACHE_TYPE="${CACHE_TYPE:-simple}"

print_header() {
    clear 2>/dev/null || true
    echo -e "${CYAN}${BOLD}"
    echo "==============================================================================="
    echo "     TRAVELWITHUS - REAL-TIME ENTERPRISE DISTRIBUTED TRAVEL BOOKING"
    echo "                             [UBUNTU / LINUX]"
    echo "==============================================================================="
    echo -e "${NC}"
}

print_header

# Dependency & Environment Checks
detect_prerequisites() {
    local missing=0

    echo -e "${WHITE}${BOLD}Checking Prerequisites:${NC}"

    # Java check
    if command -v java >/dev/null 2>&1; then
        local j_ver
        j_ver=$(java -version 2>&1 | head -n 1)
        echo -e "  [✔] Java Runtime:       ${GREEN}$j_ver${NC}"
    else
        echo -e "  [✘] Java Runtime:       ${RED}NOT FOUND${NC} (Required: Java 21+)"
        missing=1
    fi

    # Maven check
    if command -v mvn >/dev/null 2>&1; then
        local m_ver
        m_ver=$(mvn -version 2>&1 | head -n 1 | awk '{print $1, $2, $3}')
        echo -e "  [✔] Apache Maven:       ${GREEN}$m_ver${NC}"
    else
        echo -e "  [✘] Apache Maven:       ${RED}NOT FOUND${NC} (Required: Maven 3.9+)"
        missing=1
    fi

    # Node check
    if command -v node >/dev/null 2>&1; then
        local n_ver
        n_ver=$(node -v)
        echo -e "  [✔] Node.js Runtime:    ${GREEN}$n_ver${NC}"
    else
        echo -e "  [✘] Node.js Runtime:    ${RED}NOT FOUND${NC} (Required: Node 20+)"
        missing=1
    fi

    # Docker check
    DOCKER_AVAILABLE=0
    DOCKER_COMPOSE_CMD=""
    if command -v docker >/dev/null 2>&1; then
        if docker info >/dev/null 2>&1; then
            DOCKER_AVAILABLE=1
            echo -e "  [✔] Docker Engine:      ${GREEN}Active & Running${NC}"
        else
            echo -e "  [!] Docker CLI:         ${YELLOW}Installed, but daemon is not running${NC}"
        fi
    else
        echo -e "  [!] Docker:             ${YELLOW}Not installed (Running in Native Mode)${NC}"
    fi

    # Docker Compose check
    if docker compose version >/dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker compose"
        local c_ver
        c_ver=$(docker compose version 2>&1 | head -n 1)
        echo -e "  [✔] Docker Compose:     ${GREEN}$c_ver${NC}"
    elif command -v docker-compose >/dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker-compose"
        local c_ver
        c_ver=$(docker-compose --version 2>&1 | head -n 1)
        echo -e "  [✔] Docker Compose:     ${GREEN}$c_ver${NC}"
    else
        echo -e "  [!] Docker Compose:     ${YELLOW}Not installed (Install via: apt install -y docker-compose-v2)${NC}"
    fi

    echo ""
    if [ "$missing" -eq 1 ] && [ "$DOCKER_AVAILABLE" -eq 0 ]; then
        echo -e "${YELLOW}[!] Warning: Missing native tools and Docker is unavailable.${NC}"
        echo -e "${YELLOW}    Run './setup-ubuntu.sh' to install required packages.${NC}\n"
    fi
}

# Pure Bash Port Checker
wait_for_port() {
    local port="$1"
    local name="$2"
    local max_wait="${3:-25}"
    local count=0

    echo -ne "      Waiting for $name on port $port to become ready"
    while ! (echo > "/dev/tcp/127.0.0.1/$port") >/dev/null 2>&1; do
        sleep 1
        echo -ne "."
        count=$((count + 1))
        if [ "$count" -ge "$max_wait" ]; then
            echo -e " ${YELLOW}[timeout - continuing]${NC}"
            return 1
        fi
    done
    echo -e " ${GREEN}[READY]${NC}"
    return 0
}

# Start a background service with logging and PID tracking
start_bg_service() {
    local service_name="$1"
    local service_dir="$2"
    local service_cmd="$3"
    local pid_file="$PIDS_DIR/$service_name.pid"
    local log_file="$LOGS_DIR/$service_name.log"

    # Check if already running
    if [ -f "$pid_file" ]; then
        local old_pid
        old_pid=$(cat "$pid_file" 2>/dev/null || true)
        if [ -n "$old_pid" ] && kill -0 "$old_pid" >/dev/null 2>&1; then
            echo -e "  [i] $service_name is already running (PID: $old_pid)"
            return 0
        fi
    fi

    echo -e "  [*] Starting ${BOLD}$service_name${NC}..."
    (
        cd "$service_dir" || exit 1
        # Execute command in subshell and redirect output
        eval "$service_cmd" > "$log_file" 2>&1
    ) &
    local new_pid=$!
    echo "$new_pid" > "$pid_file"
    echo -e "      ${GREEN}Started${NC} (PID: $new_pid) | Log: ${CYAN}logs/$service_name.log${NC}"
}

# Frontend portals runner
launch_frontends() {
    echo -e "\n${CYAN}${BOLD}[*] Launching Frontend Applications...${NC}"
    start_bg_service "travelwithus-web" "$ROOT_DIR/travelwithus-web" "npm run dev -- --host 0.0.0.0 --port 3000"
    start_bg_service "travelwithus-admin" "$ROOT_DIR/travelwithus-admin" "npm run dev -- --host 0.0.0.0 --port 3001"
    wait_for_port 3000 "Traveler Web" 10
    wait_for_port 3001 "Admin Console" 10
}

# Core backend infrastructure
launch_backend_core() {
    echo -e "\n${CYAN}${BOLD}[*] Launching Core Infrastructure & Security Tier...${NC}"
    start_bg_service "service-registry" "$ROOT_DIR/service-registry" "mvn spring-boot:run"
    wait_for_port 8761 "Eureka Service Registry" 30

    start_bg_service "config-server" "$ROOT_DIR/config-server" "mvn spring-boot:run"
    wait_for_port 8888 "Spring Cloud Config Server" 25

    start_bg_service "api-gateway" "$ROOT_DIR/api-gateway" "mvn spring-boot:run"
    wait_for_port 8080 "Spring Cloud API Gateway" 25

    start_bg_service "auth-service" "$ROOT_DIR/auth-service" "mvn spring-boot:run"
    start_bg_service "user-service" "$ROOT_DIR/user-service" "mvn spring-boot:run"
}

# Complete Ecosystem
launch_all_services() {
    launch_backend_core

    echo -e "\n${CYAN}${BOLD}[*] Launching Business Domain Microservices...${NC}"
    start_bg_service "destination-service" "$ROOT_DIR/destination-service" "mvn spring-boot:run"
    start_bg_service "package-service" "$ROOT_DIR/package-service" "mvn spring-boot:run"
    start_bg_service "hotel-service" "$ROOT_DIR/hotel-service" "mvn spring-boot:run"
    start_bg_service "booking-service" "$ROOT_DIR/booking-service" "mvn spring-boot:run"
    start_bg_service "payment-service" "$ROOT_DIR/payment-service" "mvn spring-boot:run"
    start_bg_service "notification-service" "$ROOT_DIR/notification-service" "mvn spring-boot:run"
    start_bg_service "review-service" "$ROOT_DIR/review-service" "mvn spring-boot:run"

    launch_frontends
}

# Docker Compose Launcher
launch_docker() {
    if [ -z "$DOCKER_COMPOSE_CMD" ]; then
        echo -e "\n${YELLOW}[!] Docker Compose is not installed on this system.${NC}"
        echo -e "${CYAN}[*] Attempting to install Docker Compose plugin automatically...${NC}"
        if [ "$EUID" -ne 0 ]; then
            sudo apt-get update -y && sudo apt-get install -y docker-compose-v2 docker-compose-plugin docker-compose || true
        else
            apt-get update -y && apt-get install -y docker-compose-v2 docker-compose-plugin docker-compose || true
        fi

        if docker compose version >/dev/null 2>&1; then
            DOCKER_COMPOSE_CMD="docker compose"
        elif command -v docker-compose >/dev/null 2>&1; then
            DOCKER_COMPOSE_CMD="docker-compose"
        else
            echo -e "${RED}[✘] Could not install Docker Compose. Please run:${NC}"
            echo -e "    ${CYAN}sudo apt update && sudo apt install -y docker-compose-v2${NC}"
            return 1
        fi
    fi

    # Verify if microservice JARs exist before starting containers
    if ! ls "$ROOT_DIR"/service-registry/target/*.jar >/dev/null 2>&1; then
        echo -e "\n${YELLOW}[*] Backend JAR artifacts not detected. Building with Maven first...${NC}"
        echo -e "${CYAN}[*] Running: mvn clean package -DskipTests --batch-mode${NC}"
        mvn clean package -DskipTests --batch-mode
    fi

    echo -e "\n${CYAN}${BOLD}[*] Starting TravelWithUs ecosystem via $DOCKER_COMPOSE_CMD...${NC}"
    $DOCKER_COMPOSE_CMD -f "$ROOT_DIR/docker-compose.yml" up -d --build
    echo -e "${GREEN}[✔] Docker containers started in background.${NC}"
}

# Build All JARs and Web Bundles
build_all_artifacts() {
    echo -e "\n${CYAN}${BOLD}[*] Compiling & Packaging Java Microservices (Maven)...${NC}"
    mvn clean package -DskipTests --batch-mode
    echo -e "\n${CYAN}${BOLD}[*] Installing Frontend Dependencies...${NC}"
    (cd "$ROOT_DIR/travelwithus-web" && npm install)
    (cd "$ROOT_DIR/travelwithus-admin" && npm install)
    echo -e "${GREEN}[✔] All artifacts and dependencies built successfully!${NC}\n"
}

show_portals_banner() {
    echo -e "\n${GREEN}${BOLD}===============================================================================${NC}"
    echo -e "${GREEN}${BOLD}                        TRAVELWITHUS ACCESS PORTALS                           ${NC}"
    echo -e "${GREEN}${BOLD}===============================================================================${NC}"
    echo -e "  ${WHITE}Customer Traveler Portal :${NC} ${CYAN}http://localhost:3000${NC}"
    echo -e "  ${WHITE}Executive Admin Console  :${NC} ${CYAN}http://localhost:3001${NC}"
    echo -e "  ${WHITE}Spring Cloud API Gateway :${NC} ${CYAN}http://localhost:8080${NC}"
    echo -e "  ${WHITE}Eureka Service Registry  :${NC} ${CYAN}http://localhost:8761${NC}"
    echo -e "  ${WHITE}Spring Cloud Config      :${NC} ${CYAN}http://localhost:8888${NC}"
    echo ""
    echo -e "${WHITE}-------------------------------------------------------------------------------${NC}"
    echo -e "${YELLOW}  DEMO CREDENTIALS:${NC}"
    echo -e "    ${BOLD}Super Admin  :${NC} admin@travelwithus.com      / Admin@123"
    echo -e "    ${BOLD}Admin        :${NC} support@travelwithus.com    / Admin@123"
    echo -e "    ${BOLD}Customer     :${NC} john.doe@travelwithus.com   / Customer@123"
    echo -e "${WHITE}-------------------------------------------------------------------------------${NC}"
    echo ""
    echo -e "  [*] Service logs are available at: ${CYAN}$LOGS_DIR/<service>.log${NC}"
    echo -e "  [*] To inspect live logs, run:     ${CYAN}tail -f logs/<service-name>.log${NC}"
    echo -e "  [*] To check service status, run:  ${CYAN}./status-travelwithus.sh${NC}"
    echo -e "  [*] To shut down everything, run:  ${CYAN}./stop-travelwithus.sh${NC}"
    echo -e "${GREEN}${BOLD}===============================================================================${NC}\n"
}

detect_prerequisites

echo -e "${WHITE}${BOLD}Choose Startup Mode:${NC}"
echo -e "  ${GREEN}1.${NC} Start Frontend Portals (Web on 3000, Admin on 3001)"
if [ "$DOCKER_AVAILABLE" -eq 1 ]; then
    echo -e "  ${GREEN}2.${NC} Start Full Stack via Docker Compose (Recommended)"
else
    echo -e "  ${YELLOW}2.${NC} Start Full Stack via Docker Compose [Docker Inactive]"
fi
echo -e "  ${GREEN}3.${NC} Start Core Backend (Registry, Config, Gateway, Auth, User)"
echo -e "  ${GREEN}4.${NC} Start Complete Ecosystem (All 11 Microservices + Frontends)"
echo -e "  ${GREEN}5.${NC} Build All Projects (Maven Package & npm install)"
echo -e "  ${GREEN}6.${NC} Check Status & Health"
echo -e "  ${GREEN}7.${NC} Stop All Running Services"
echo -e "  ${GREEN}8.${NC} Exit"
echo ""

read -r -p "Select mode [1-8] (Default is 1): " MODE
MODE="${MODE:-1}"

case "$MODE" in
    1)
        launch_frontends
        show_portals_banner
        ;;
    2)
        if [ "$DOCKER_AVAILABLE" -eq 1 ]; then
            launch_docker
            show_portals_banner
        else
            echo -e "${RED}[✘] Docker daemon is not active. Please start Docker service or select another mode.${NC}"
        fi
        ;;
    3)
        launch_backend_core
        show_portals_banner
        ;;
    4)
        launch_all_services
        show_portals_banner
        ;;
    5)
        build_all_artifacts
        ;;
    6)
        if [ -f "$ROOT_DIR/status-travelwithus.sh" ]; then
            bash "$ROOT_DIR/status-travelwithus.sh"
        fi
        ;;
    7)
        if [ -f "$ROOT_DIR/stop-travelwithus.sh" ]; then
            bash "$ROOT_DIR/stop-travelwithus.sh"
        fi
        ;;
    8)
        echo -e "${CYAN}Exiting launcher.${NC}"
        exit 0
        ;;
    *)
        echo -e "${YELLOW}Invalid option selected. Launching frontends by default.${NC}"
        launch_frontends
        show_portals_banner
        ;;
esac
