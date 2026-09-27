@echo off
setlocal enabledelayedexpansion

title TravelWithUs - Enterprise Microservices Platform Launcher
color 0B

echo.
echo ===============================================================================
echo     TRAVELWITHUS - REAL-TIME ENTERPRISE DISTRIBUTED TRAVEL BOOKING
echo ===============================================================================
echo.
echo  [*] Checking Docker Environment...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  [!] ERROR: Docker is not installed or not in PATH!
    echo      Please start Docker Desktop and ensure the 'docker' command is available.
    echo.
    pause
    exit /b 1
)

docker info >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  [!] ERROR: Docker daemon is not running!
    echo      Please start Docker Desktop and wait until the engine is ready.
    echo.
    pause
    exit /b 1
)

echo  [+] Docker daemon is running.
echo.
echo  [*] Choose startup mode:
echo      [1] Start Full Stack via Docker Compose (Recommended)
echo      [2] Build and Start Full Stack (Fresh Container Build)
echo      [3] Start Infrastructure Only (MySQL, Redis, Kafka, Zookeeper)
echo      [4] Exit
echo.
set /p START_CHOICE="Enter choice [1-4] (Default is 1): "
if "%START_CHOICE%"=="" set START_CHOICE=1

if "%START_CHOICE%"=="1" (
    echo.
    echo  [*] Starting TravelWithUs ecosystem in background...
    docker compose up -d
) else if "%START_CHOICE%"=="2" (
    echo.
    echo  [*] Building images and starting ecosystem...
    docker compose up -d --build
) else if "%START_CHOICE%"=="3" (
    echo.
    echo  [*] Starting infrastructure services (MySQL, Redis, Zookeeper, Kafka)...
    docker compose up -d mysql redis zookeeper kafka
) else if "%START_CHOICE%"=="4" (
    echo  [*] Operation cancelled. Exiting...
    exit /b 0
) else (
    echo  [!] Invalid selection. Defaulting to standard startup...
    docker compose up -d
)

echo.
echo ===============================================================================
echo                        ACTIVE CONTAINERS STATUS
echo ===============================================================================
docker compose ps

echo.
echo ===============================================================================
echo                        TRAVELWITHUS ACCESS PORTALS
echo ===============================================================================
echo.
echo   Customer Traveler Portal : http://localhost:3000
echo   Executive Admin Console  : http://localhost:3001
echo   Spring Cloud API Gateway : http://localhost:8080
echo   Eureka Service Registry  : http://localhost:8761
echo   Spring Cloud Config      : http://localhost:8888
echo.
echo -------------------------------------------------------------------------------
echo   DEMO CREDENTIALS:
echo     Super Admin  : admin@travelwithus.com      / Admin@123
echo     Admin        : support@travelwithus.com    / Admin@123
echo     Customer     : john.doe@travelwithus.com   / Customer@123
echo -------------------------------------------------------------------------------
echo.
echo  [*] To stop the system at any time, run: stop-travelwithus.bat
echo.
pause
