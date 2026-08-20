@echo off
setlocal
echo ============================================
echo   Descargando el proyecto a tu Escritorio
echo ============================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Git no esta instalado. Instalando con winget...
    winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements
    echo Cerra esta ventana y volve a ejecutar este archivo para continuar.
    pause
    exit /b
)

cd "%USERPROFILE%\Desktop"

if exist "may-ferrari" (
    echo La carpeta may-ferrari ya existe. Actualizandola...
    cd may-ferrari
    git pull
) else (
    git clone https://github.com/maferrari73-afk/may-ferrari.git
)

echo.
echo ============================================
echo   Listo! Carpeta creada en el Escritorio: may-ferrari
echo ============================================
pause
