@echo off
REM Git Push Script
REM Usage: git-push.bat "your commit message"

echo.
echo ====================================
echo    Git Add, Commit, and Push
echo ====================================
echo.

REM Check if commit message is provided
if "%~1"=="" (
    echo Error: Please provide a commit message!
    echo Usage: git-push.bat "your commit message"
    exit /b 1
)

REM Add all changes
echo [1/3] Adding all changes...
git add .

REM Commit with message
echo.
echo [2/3] Committing changes...
git commit -m "%~1"

REM Push to origin main
echo.
echo [3/3] Pushing to origin main...
git push origin main

echo.
echo ====================================
echo    Done! ✓
echo ====================================
