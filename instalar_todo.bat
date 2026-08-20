@echo off
setlocal
echo ============================================
echo   Instalador del Descargador de YouTube
echo ============================================
echo.

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Python no esta instalado. Instalando con winget...
    winget install -e --id Python.Python.3.12 --accept-package-agreements --accept-source-agreements
    echo Cerra esta ventana y volve a ejecutar este archivo para continuar.
    pause
    exit /b
)

where ffmpeg >nul 2>nul
if %errorlevel% neq 0 (
    echo ffmpeg no esta instalado. Instalando con winget...
    winget install -e --id Gyan.FFmpeg --accept-package-agreements --accept-source-agreements
)

echo Instalando yt-dlp...
python -m pip install --upgrade yt-dlp

echo Descargando el programa...
curl -L -o "%USERPROFILE%\Desktop\ytdl_gui.py" "https://raw.githubusercontent.com/maferrari73-afk/may-ferrari/claude/nova-marketing-agency-1ew0rw/ytdl_gui.py"

echo.
echo ============================================
echo   Listo! Abriendo el descargador...
echo ============================================
start "" python "%USERPROFILE%\Desktop\ytdl_gui.py"
pause
