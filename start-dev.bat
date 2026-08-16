@echo off
REM Quick Start Script for Digital InfraTech

echo.
echo ========================================
echo Digital InfraTech - Quick Start
echo ========================================
echo.
echo This script will start both Backend and Frontend
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo.

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js is installed
echo.

REM Start Backend
echo Starting Backend server...
echo.
cd backend
call npm install --silent 2>nul
start "Digital InfraTech Backend" npm run dev
echo ✓ Backend starting in new window...
echo.

REM Wait a bit for backend to start
timeout /t 2 /nobreak >nul

REM Start Frontend
cd ../frontend
call npm install --silent 2>nul
start "Digital InfraTech Frontend" npm run dev
echo ✓ Frontend starting in new window...
echo.

echo ========================================
echo.
echo ✓ Both services are starting!
echo.
echo Backend:  http://localhost:5000/api
echo Frontend: http://localhost:5173
echo.
echo Check the new terminal windows for output.
echo Press Ctrl+C in each window to stop.
echo.
echo ========================================

pause
