@echo off
echo Starting Moonveil Hotel System...
cd /d c:\Users\USER\OneDrive\Desktop\moonveil-hotel\backend-nodejs
start "" cmd /k "node server.js"
echo Backend starting on port 5000...
timeout /t 3 /nobreak >nul
cd /d c:\Users\USER\OneDrive\Desktop\moonveil-hotel\frontend
start "" cmd /k "npm start"
echo Frontend starting on port 3000...
echo.
echo System started! Open http://localhost:3000 in browser.
