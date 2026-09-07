@echo off
set PATH=D:\Test 1\tools\php;D:\Test 1\tools\node;%PATH%
cd /d D:\Test 1
start "PHP Server" /B php artisan serve --host=127.0.0.1 --port=8000
start "Vite Dev" /B npm run dev
echo Servers started. Close this window to stop them.
cmd /c pause
