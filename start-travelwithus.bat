@echo off
setlocal enabledelayedexpansion

title TravelWithUs - Enterprise Launcher
color 0B

echo.
echo ===============================================================================
echo     TRAVELWITHUS - REAL-TIME ENTERPRISE DISTRIBUTED TRAVEL BOOKING
echo ===============================================================================
echo.

:: Detect Maven
set "MVN_CMD=mvn"
where mvn >nul 2>&1
if %errorlevel% neq 0 (
    if exist "C:\Users\akash\apache-maven-3.9.11\bin\mvn.cmd" (
        set "MVN_CMD=C:\Users\akash\apache-maven-3.9.11\bin\mvn.cmd"
    )
)

:: Check Docker availability
set DOCKER_AVAILABLE=0
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    docker info >nul 2>&1
    if %errorlevel% equ 0 (
        set DOCKER_AVAILABLE=1
    )
)

if %DOCKER_AVAILABLE% equ 1 (
    echo  [+] Docker engine is detected and running.
    echo.
    echo  Choose Startup Mode:
    echo    [1] Start Frontend Portals in Terminal (Web :3000 and Admin :3001) [Recommended]
    echo    [2] Start Full Stack via Docker Compose (:3000, :3001, and all microservices)
    echo    [3] Start Core Microservices in Terminal Windows (Java / Maven)
    echo    [4] Start ALL in Terminal Windows (Frontends + Microservices)
    echo    [5] Exit
    echo.
    set /p MODE="Select mode [1-5] (Default is 1): "
    if "!MODE!"=="" set MODE=1
) else (
    color 0E
    echo  [i] Notice: Docker is not installed or daemon is not running on this machine.
    echo  [+] Running natively in Native Terminal Mode.
    echo.
    echo  Choose Startup Mode:
    echo    [1] Start Frontend Portals in Terminal (Web :3000 and Admin :3001) [Default]
    echo    [2] Start Core Infrastructure & Gateway (Registry, Config Server, Gateway)
    echo    [3] Start ALL (Core Services + Frontends) in Terminal Windows
    echo    [4] Exit
    echo.
    set /p MODE="Select mode [1-4] (Default is 1): "
    if "!MODE!"=="" set MODE=1
    
    :: Map selection to terminal modes
    if "!MODE!"=="1" (
        goto LAUNCH_FRONTENDS
    ) else if "!MODE!"=="2" (
        goto LAUNCH_BACKEND_CORE
    ) else if "!MODE!"=="3" (
        goto LAUNCH_ALL_TERMINAL
    ) else (
        echo  [*] Exiting...
        exit /b 0
    )
)

if "%MODE%"=="1" goto LAUNCH_FRONTENDS
if "%MODE%"=="2" goto LAUNCH_DOCKER
if "%MODE%"=="3" goto LAUNCH_BACKEND_CORE
if "%MODE%"=="4" goto LAUNCH_ALL_TERMINAL
if "%MODE%"=="5" exit /b 0
goto LAUNCH_FRONTENDS

:LAUNCH_DOCKER
echo.
echo  [*] Starting TravelWithUs ecosystem via Docker Compose...
docker compose up -d
goto SHOW_PORTALS

:LAUNCH_FRONTENDS
echo.
echo  [*] Launching Customer Traveler Portal on Port 3000...
start "TravelWithUs - Customer Web (:3000)" cmd /k "cd /d d:\TravelWithUs\travelwithus-web && npm run dev"

echo  [*] Launching Executive Admin Console on Port 3001...
start "TravelWithUs - Admin Console (:3001)" cmd /k "cd /d d:\TravelWithUs\travelwithus-admin && npm run dev"
goto SHOW_PORTALS

:LAUNCH_BACKEND_CORE
echo.
echo  [*] Launching Eureka Service Registry (:8761)...
start "TravelWithUs - Service Registry (:8761)" cmd /k "cd /d d:\TravelWithUs\service-registry && "!MVN_CMD!" spring-boot:run"

timeout /t 5 /nobreak >nul

echo  [*] Launching Config Server (:8888)...
start "TravelWithUs - Config Server (:8888)" cmd /k "cd /d d:\TravelWithUs\config-server && "!MVN_CMD!" spring-boot:run"

timeout /t 5 /nobreak >nul

echo  [*] Launching Spring Cloud API Gateway (:8080)...
start "TravelWithUs - API Gateway (:8080)" cmd /k "cd /d d:\TravelWithUs\api-gateway && "!MVN_CMD!" spring-boot:run"
goto SHOW_PORTALS

:LAUNCH_ALL_TERMINAL
echo.
echo  [*] Launching Core Services...
start "TravelWithUs - Service Registry (:8761)" cmd /k "cd /d d:\TravelWithUs\service-registry && "!MVN_CMD!" spring-boot:run"
timeout /t 3 /nobreak >nul
start "TravelWithUs - Config Server (:8888)" cmd /k "cd /d d:\TravelWithUs\config-server && "!MVN_CMD!" spring-boot:run"
timeout /t 3 /nobreak >nul
start "TravelWithUs - API Gateway (:8080)" cmd /k "cd /d d:\TravelWithUs\api-gateway && "!MVN_CMD!" spring-boot:run"

timeout /t 2 /nobreak >nul
echo  [*] Launching Frontend Portals...
start "TravelWithUs - Customer Web (:3000)" cmd /k "cd /d d:\TravelWithUs\travelwithus-web && npm run dev"
start "TravelWithUs - Admin Console (:3001)" cmd /k "cd /d d:\TravelWithUs\travelwithus-admin && npm run dev"
goto SHOW_PORTALS

:SHOW_PORTALS
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
echo  [*] All processes launched in dedicated terminal windows!
echo  [*] To stop all running components, execute: stop-travelwithus.bat
echo.
pause
