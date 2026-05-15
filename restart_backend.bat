@echo off
cd /d c:\Users\USER\OneDrive\Desktop\moonveil-hotel\backend-nodejs
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
start "" node server.js
echo Backend restarted!
