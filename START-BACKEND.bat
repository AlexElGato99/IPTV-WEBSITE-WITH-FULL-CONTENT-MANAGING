@echo off
echo ========================================
echo   Starting IPTV Backend API
echo ========================================
echo.

cd "D:\download\iptv template from zero\backend"

echo Installing dependencies if needed...
call npm install

echo.
echo Starting Express server...
echo.
call npm run dev

pause