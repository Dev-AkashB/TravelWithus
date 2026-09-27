@echo off
setlocal enabledelayedexpansion

title TravelWithUs - Enterprise Microservices Shutdown Utility
color 0E

echo.
echo ===============================================================================
echo            TRAVELWITHUS - ECOSYSTEM SHUTDOWN UTILITY
echo ===============================================================================
echo.
echo  [*] Choose shutdown option:
echo      [1] Graceful Stop & Remove Containers (Preserve Database Volumes) [Default]
echo      [2] Stop Containers Only (Pause Execution)
echo      [3] Total Teardown (Remove Containers AND Database/Redis Volumes)
echo      [4] Cancel
echo.
set /p STOP_CHOICE="Enter choice [1-4] (Default is 1): "
if "%STOP_CHOICE%"=="" set STOP_CHOICE=1

if "%STOP_CHOICE%"=="1" (
    echo.
    echo  [*] Gracefully shutting down TravelWithUs microservices...
    docker compose down
    color 0A
    echo  [+] All microservices and networks cleanly stopped. Volumes preserved.
) else if "%STOP_CHOICE%"=="2" (
    echo.
    echo  [*] Pausing TravelWithUs containers...
    docker compose stop
    color 0A
    echo  [+] Containers stopped.
) else if "%STOP_CHOICE%"=="3" (
    color 0C
    echo.
    echo  [!] WARNING: This will purge all MySQL and Redis database volumes!
    set /p CONFIRM="Are you absolutely sure? (Y/N): "
    if /i "!CONFIRM!"=="Y" (
        echo  [*] Purging containers and volumes...
        docker compose down -v
        echo  [+] Clean teardown complete.
    ) else (
        echo  [*] Total teardown cancelled.
    )
) else if "%STOP_CHOICE%"=="4" (
    echo  [*] Operation cancelled. Exiting...
    exit /b 0
) else (
    echo  [*] Defaulting to standard graceful stop...
    docker compose down
)

echo.
echo ===============================================================================
echo                        SHUTDOWN COMPLETE
echo ===============================================================================
echo.
pause
