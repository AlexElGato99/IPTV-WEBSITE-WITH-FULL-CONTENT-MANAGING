@echo off
echo ========================================
echo   Starting IPTV Next.js Frontend
echo ========================================
echo.

cd "D:\download\iptv template from zero\next-app"

echo Installing dependencies if needed...
call npm install

echo.
echo Starting Next.js development server...
echo.
call npm run dev

pause
