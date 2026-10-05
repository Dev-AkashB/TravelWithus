#!/usr/bin/env bash
# ==============================================================================
# TravelWithUs - Ubuntu Environment Setup & Dependency Installer
# Supports Ubuntu 20.04 LTS, 22.04 LTS, 24.04 LTS & Debian-based distributions
# ==============================================================================

set -e

# Terminal Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
echo "==============================================================================="
echo "       TRAVELWITHUS - UBUNTU ENVIRONMENT & DEPENDENCY INSTALLER"
echo "==============================================================================="
echo -e "${NC}"

if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}[!] Note: Running as non-root user. 'sudo' will be used for package installations.${NC}"
    SUDO="sudo"
else
    SUDO=""
fi

echo -e "\n${CYAN}[1/6] Updating APT package repositories...${NC}"
$SUDO apt-get update -y

echo -e "\n${CYAN}[2/6] Installing core build utilities (curl, wget, git, lsof, jq, tmux)...${NC}"
$SUDO apt-get install -y curl wget git lsof jq tmux ca-certificates gnupg build-essential

# ---------------------------------------------------------
# Java 21 Installation
# ---------------------------------------------------------
echo -e "\n${CYAN}[3/6] Checking Java 21...${NC}"
if command -v java >/dev/null 2>&1 && java -version 2>&1 | grep -q "21"; then
    echo -e "${GREEN}[✔] Java 21 is already installed:${NC}"
    java -version
else
    echo -e "${YELLOW}[*] Installing OpenJDK 21...${NC}"
    $SUDO apt-get install -y openjdk-21-jdk || {
        echo -e "${YELLOW}[*] Fallback: Installing default-jdk...${NC}"
        $SUDO apt-get install -y default-jdk
    }
fi

# ---------------------------------------------------------
# Maven Installation
# ---------------------------------------------------------
echo -e "\n${CYAN}[4/6] Checking Apache Maven...${NC}"
if command -v mvn >/dev/null 2>&1; then
    echo -e "${GREEN}[✔] Maven is already installed:${NC}"
    mvn -version
else
    echo -e "${YELLOW}[*] Installing Maven...${NC}"
    $SUDO apt-get install -y maven
fi

# ---------------------------------------------------------
# Node.js 20+ & npm Installation
# ---------------------------------------------------------
echo -e "\n${CYAN}[5/6] Checking Node.js & npm...${NC}"
NEED_NODE=true
if command -v node >/dev/null 2>&1; then
    NODE_MAJOR=$(node -v | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -ge 20 ]; then
        echo -e "${GREEN}[✔] Node.js $NODE_MAJOR is already installed:${NC}"
        node -v && npm -v
        NEED_NODE=false
    fi
fi

if [ "$NEED_NODE" = true ]; then
    echo -e "${YELLOW}[*] Installing Node.js 20.x from NodeSource repository...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | $SUDO -E bash -
    $SUDO apt-get install -y nodejs
fi

# ---------------------------------------------------------
# Docker & Docker Compose
# ---------------------------------------------------------
echo -e "\n${CYAN}[6/6] Checking Docker & Docker Compose...${NC}"
if command -v docker >/dev/null 2>&1; then
    echo -e "${GREEN}[✔] Docker CLI is detected:${NC}"
    docker --version
else
    echo -e "${YELLOW}[*] Docker not found. Would you like to install Docker Engine? (y/N)${NC}"
    read -r -p "Install Docker? " INSTALL_DOCKER
    if [[ "$INSTALL_DOCKER" =~ ^[Yy]$ ]]; then
        $SUDO apt-get install -y docker.io docker-compose-v2
        $SUDO systemctl enable --now docker
        if [ -n "$SUDO_USER" ]; then
            $SUDO usermod -aG docker "$SUDO_USER"
            echo -e "${YELLOW}[!] Added $SUDO_USER to the docker group. Please log out and back in for this to take effect.${NC}"
        fi
    fi
fi

echo -e "\n${GREEN}${BOLD}"
echo "==============================================================================="
echo "                   SETUP & PREREQUISITES COMPLETE!             "
echo "==============================================================================="
echo -e "${NC}"
echo -e "You can now launch the platform using:"
echo -e "  ${CYAN}chmod +x *.sh${NC}"
echo -e "  ${CYAN}./start-travelwithus.sh${NC}"
echo ""
