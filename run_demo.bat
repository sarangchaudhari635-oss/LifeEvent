@echo off
title LifeEvent AI — Full-Stack Runner
echo ============================================================
echo   LifeEvent AI — Full-Stack Emergency Financial Journey
echo   Paytm AI Hackathon (Build for India) - PS-2
echo   Team Crazy Coders (Sarang Chaudhari, Sumit Kalr, Sanskar Thorat)
echo ============================================================
echo.

echo [1/3] Verifying Python backend dependencies and running tests...
python -m pytest backend/tests --quiet
if %errorlevel% neq 0 (
    echo [ERROR] Backend tests failed. Aborting startup.
    pause
    exit /b %errorlevel%
)
echo [OK] 12/12 pytest unit tests passed!
echo.

echo [2/3] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "LifeEvent AI - FastAPI Backend" cmd /k "python -m uvicorn backend.app.main:app --port 8000 --host 127.0.0.1"
timeout /t 2 /nobreak >nul

echo [3/3] Launching Next.js 15 Frontend on http://localhost:3000 ...
start "LifeEvent AI - Next.js Frontend" cmd /k "cd frontend && npm run start -- -p 3000"
timeout /t 3 /nobreak >nul

echo.
echo ============================================================
echo   Application successfully started!
echo   Opening http://localhost:3000 in your browser...
echo ============================================================
start http://localhost:3000
echo.
pause

