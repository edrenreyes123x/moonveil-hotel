@echo off
echo Starting Moonveil Hotel System...
echo.

echo Starting Backend on port 5000...
start "Backend" cmd /k "cd /d c:\Users\USER\OneDrive\Desktop\moonveil-hotel\backend-nodejs && node server.js"

timeout /t 4 /nobreak

echo Starting Frontend on port 3000...
start "Frontend" cmd /k "cd /d c:\Users\USER\OneDrive\Desktop\moonveil-hotel\frontend && npm start"

echo.
echo Both servers should be starting...
echo Please wait 10-20 seconds then open http://localhost:3000
