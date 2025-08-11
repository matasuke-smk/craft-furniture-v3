@echo off
echo Starting Craft Furniture Local Server...
echo.
cd /d "C:\Users\shioz\iCloudDrive\portfolio\craft-furniture"
echo Current directory: %CD%
echo.
echo Starting server on http://localhost:3000
echo.
node simple-server.js
pause