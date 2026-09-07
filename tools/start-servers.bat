@echo off
set "ROOT_DIR=%~dp0.."
set "PATH=%~dp0php;%~dp0node;%PATH%"
cd /d "%ROOT_DIR%"
start "PHP Server" /B php artisan serve --host=127.0.0.1 --port=8000
start "Vite Dev" /B npm run dev
echo Servers started at http://127.0.0.1:8000 and http://localhost:5173. Close this window to stop them.
cmd /c pause
