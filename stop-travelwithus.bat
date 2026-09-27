@echo off
setlocal enabledelayedexpansion

title TravelWithUs - Shutdown Utility
color 0E

echo.
echo ===============================================================================
echo            TRAVELWITHUS - ECOSYSTEM SHUTDOWN UTILITY
echo ===============================================================================
echo.
echo  [*] Shutting down TravelWithUs components...

:: Stop Docker containers if docker is running
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo  [*] Stopping Docker containers...
    docker compose down 2>nul
)

:: Terminate Windows processes on ports 3000, 3001, 8080, 8761, 8888, 8081-8089
echo  [*] Terminating terminal dev servers and microservice processes...
powershell -NoProfile -Command ^
  "Get-NetTCPConnection -LocalPort 3000,3001,8080,8761,8888,8081,8082,8083,8084,8085,8086,8087,8088,8089 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

color 0A
echo.
echo  [+] All TravelWithUs services and frontend dev servers have been cleanly stopped!
echo.
echo ===============================================================================
echo                        SHUTDOWN COMPLETE
echo ===============================================================================
echo.
pause
