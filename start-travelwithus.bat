@echo off
setlocal enabledelayedexpansion

title TravelWithUs - Enterprise Launcher
color 0B

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"

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

:: Environment defaults for native microservice execution
if "%MYSQL_USER%"=="" set "MYSQL_USER=root"
if "%MYSQL_PASSWORD%"=="" set "MYSQL_PASSWORD=root"
if "%MYSQL_HOST%"=="" set "MYSQL_HOST=localhost"
if "%MYSQL_PORT%"=="" set "MYSQL_PORT=3306"
if "%CACHE_TYPE%"=="" set "CACHE_TYPE=simple"


:: Check Docker availability
set DOCKER_AVAILABLE=0
where docker >nul 2>&1
if %errorlevel% equ 0 (
    docker info >nul 2>&1
    if %errorlevel% equ 0 (
        set DOCKER_AVAILABLE=1
    )
)

if %DOCKER_AVAILABLE% equ 1 goto MENU_DOCKER
goto MENU_TERMINAL

:MENU_DOCKER
echo  [+] Docker engine is detected and running.
echo.
echo  Choose Startup Mode:
echo    1. Start Frontend Portals (Web on 3000, Admin on 3001)
echo    2. Start Full Stack via Docker Compose
echo    3. Start Core Backend (Registry, Config, Gateway, Auth, User)
echo    4. Start ALL in Terminal Windows (All Services and Frontends)
echo    5. Exit
echo.
set /p MODE="Select mode [1-5] (Default is 1): "
if "%MODE%"=="" set MODE=1
if "%MODE%"=="1" goto LAUNCH_FRONTENDS
if "%MODE%"=="2" goto LAUNCH_DOCKER
if "%MODE%"=="3" goto LAUNCH_BACKEND_CORE
if "%MODE%"=="4" goto LAUNCH_ALL_TERMINAL
if "%MODE%"=="5" exit /b 0
goto LAUNCH_FRONTENDS

:MENU_TERMINAL
color 0E
echo  [i] Docker is not detected. Running in Native Terminal Mode.
echo  [+] Direct Maven, Node.js, and MySQL execution.
echo.
echo  Choose Startup Mode:
echo    1. Start Frontend Portals (Web on 3000, Admin on 3001)
echo    2. Start Core Infrastructure (Registry 8761, Config 8888, Gateway 8080)
echo    3. Start Core Services with Frontends (Registry, Config, Gateway, Auth, User, Web, Admin)
echo    4. Start Complete Ecosystem (All Microservices and Frontends)
echo    5. Exit
echo.
set /p MODE="Select mode [1-5] (Press Enter for default [1]): "
if "%MODE%"=="" set MODE=1
if "%MODE%"=="1" goto LAUNCH_FRONTENDS
if "%MODE%"=="2" goto LAUNCH_BACKEND_CORE
if "%MODE%"=="3" goto LAUNCH_CORE_AND_FRONTENDS
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
start "TravelWithUs - Customer Web (3000)" cmd /k "cd /d %ROOT_DIR%\travelwithus-web && npm run dev"

echo  [*] Launching Executive Admin Console on Port 3001...
start "TravelWithUs - Admin Console (3001)" cmd /k "cd /d %ROOT_DIR%\travelwithus-admin && npm run dev"
goto SHOW_PORTALS

:LAUNCH_BACKEND_CORE
echo.
echo  [*] Launching Eureka Service Registry on 8761...
start "TravelWithUs - Service Registry (8761)" cmd /k "cd /d %ROOT_DIR%\service-registry && %MVN_CMD% spring-boot:run"
timeout /t 5 /nobreak >nul

echo  [*] Launching Config Server on 8888...
start "TravelWithUs - Config Server (8888)" cmd /k "cd /d %ROOT_DIR%\config-server && %MVN_CMD% spring-boot:run"
timeout /t 5 /nobreak >nul

echo  [*] Launching Spring Cloud API Gateway on 8080...
start "TravelWithUs - API Gateway (8080)" cmd /k "cd /d %ROOT_DIR%\api-gateway && %MVN_CMD% spring-boot:run"
goto SHOW_PORTALS

:LAUNCH_CORE_AND_FRONTENDS
echo.
echo  [*] Launching Service Registry (8761)...
start "TravelWithUs - Service Registry (8761)" cmd /k "cd /d %ROOT_DIR%\service-registry && %MVN_CMD% spring-boot:run"
timeout /t 4 /nobreak >nul

echo  [*] Launching Config Server (8888)...
start "TravelWithUs - Config Server (8888)" cmd /k "cd /d %ROOT_DIR%\config-server && %MVN_CMD% spring-boot:run"
timeout /t 4 /nobreak >nul

echo  [*] Launching API Gateway (8080)...
start "TravelWithUs - API Gateway (8080)" cmd /k "cd /d %ROOT_DIR%\api-gateway && %MVN_CMD% spring-boot:run"
timeout /t 3 /nobreak >nul

echo  [*] Launching Auth Service (8081)...
start "TravelWithUs - Auth Service (8081)" cmd /k "cd /d %ROOT_DIR%\auth-service && %MVN_CMD% spring-boot:run"
timeout /t 3 /nobreak >nul

echo  [*] Launching User Service (8082)...
start "TravelWithUs - User Service (8082)" cmd /k "cd /d %ROOT_DIR%\user-service && %MVN_CMD% spring-boot:run"
timeout /t 2 /nobreak >nul

echo  [*] Launching Frontend Portals (3000, 3001)...
start "TravelWithUs - Customer Web (3000)" cmd /k "cd /d %ROOT_DIR%\travelwithus-web && npm run dev"
start "TravelWithUs - Admin Console (3001)" cmd /k "cd /d %ROOT_DIR%\travelwithus-admin && npm run dev"
goto SHOW_PORTALS

:LAUNCH_ALL_TERMINAL
echo.
echo  [*] Launching Eureka Service Registry (8761)...
start "TravelWithUs - Service Registry (8761)" cmd /k "cd /d %ROOT_DIR%\service-registry && %MVN_CMD% spring-boot:run"
timeout /t 4 /nobreak >nul

echo  [*] Launching Config Server (8888)...
start "TravelWithUs - Config Server (8888)" cmd /k "cd /d %ROOT_DIR%\config-server && %MVN_CMD% spring-boot:run"
timeout /t 4 /nobreak >nul

echo  [*] Launching API Gateway (8080)...
start "TravelWithUs - API Gateway (8080)" cmd /k "cd /d %ROOT_DIR%\api-gateway && %MVN_CMD% spring-boot:run"
timeout /t 3 /nobreak >nul

echo  [*] Launching Auth Service (8081)...
start "TravelWithUs - Auth Service (8081)" cmd /k "cd /d %ROOT_DIR%\auth-service && %MVN_CMD% spring-boot:run"

echo  [*] Launching User Service (8082)...
start "TravelWithUs - User Service (8082)" cmd /k "cd /d %ROOT_DIR%\user-service && %MVN_CMD% spring-boot:run"

echo  [*] Launching Destination Service (8083)...
start "TravelWithUs - Destination Service (8083)" cmd /k "cd /d %ROOT_DIR%\destination-service && %MVN_CMD% spring-boot:run"

echo  [*] Launching Package Service (8084)...
start "TravelWithUs - Package Service (8084)" cmd /k "cd /d %ROOT_DIR%\package-service && %MVN_CMD% spring-boot:run"

echo  [*] Launching Hotel Service (8085)...
start "TravelWithUs - Hotel Service (8085)" cmd /k "cd /d %ROOT_DIR%\hotel-service && %MVN_CMD% spring-boot:run"

echo  [*] Launching Booking Service (8086)...
start "TravelWithUs - Booking Service (8086)" cmd /k "cd /d %ROOT_DIR%\booking-service && %MVN_CMD% spring-boot:run"

echo  [*] Launching Payment Service (8087)...
start "TravelWithUs - Payment Service (8087)" cmd /k "cd /d %ROOT_DIR%\payment-service && %MVN_CMD% spring-boot:run"

echo  [*] Launching Notification Service (8088)...
start "TravelWithUs - Notification Service (8088)" cmd /k "cd /d %ROOT_DIR%\notification-service && %MVN_CMD% spring-boot:run"

echo  [*] Launching Review Service (8089)...
start "TravelWithUs - Review Service (8089)" cmd /k "cd /d %ROOT_DIR%\review-service && %MVN_CMD% spring-boot:run"

timeout /t 3 /nobreak >nul
echo  [*] Launching Frontend Portals...
start "TravelWithUs - Customer Web (3000)" cmd /k "cd /d %ROOT_DIR%\travelwithus-web && npm run dev"
start "TravelWithUs - Admin Console (3001)" cmd /k "cd /d %ROOT_DIR%\travelwithus-admin && npm run dev"
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
