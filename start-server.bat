@echo off
title LLM Agent POC Server

echo.
echo ========================================
echo    LLM Agent POC - Local Server
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo 💡 Please install Python 3.7+ and try again
    echo    Download from: https://python.org/downloads/
    pause
    exit /b 1
)

echo 🐍 Python found!
echo 🚀 Starting server...
echo.

REM Start the Python server
python server.py

REM If server.py is not available, use built-in HTTP server
if errorlevel 1 (
    echo.
    echo ⚠️  server.py not found, using built-in Python server...
    echo 🌐 Server will be available at: http://localhost:8000
    echo 📖 Demo page: http://localhost:8000/demo.html
    echo 🤖 Agent interface: http://localhost:8000/index.html
    echo.
    echo 🛑 Press Ctrl+C to stop the server
    echo.
    
    REM Try to open browser
    start http://localhost:8000/demo.html
    
    REM Start simple HTTP server
    python -m http.server 8000
)

echo.
echo 👋 Server stopped. Press any key to exit...
pause >nul
