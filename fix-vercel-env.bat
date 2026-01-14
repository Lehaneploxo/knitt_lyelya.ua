@echo off
echo ======================================
echo ИСПРАВЛЕНИЕ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ VERCEL
echo ======================================
echo.

echo Этот скрипт удалит и заново добавит переменные окружения
echo без лишних символов новой строки.
echo.
echo ВАЖНО: У вас должен быть установлен Vercel CLI и авторизация!
echo.
pause

cd /d "%~dp0"

echo.
echo [1/9] Удаление MONOBANK_TOKEN...
vercel env rm MONOBANK_TOKEN production --yes

echo.
echo [2/9] Добавление MONOBANK_TOKEN...
echo mEV7ptuaG1LcHiw1viKbAaQ | vercel env add MONOBANK_TOKEN production

echo.
echo [3/9] Удаление NEXT_PUBLIC_BASE_URL...
vercel env rm NEXT_PUBLIC_BASE_URL production --yes

echo.
echo [4/9] Добавление NEXT_PUBLIC_BASE_URL...
echo https://www.knittlyelyaua.com | vercel env add NEXT_PUBLIC_BASE_URL production

echo.
echo [5/9] Удаление SHOP_NAME...
vercel env rm SHOP_NAME production --yes

echo.
echo [6/9] Добавление SHOP_NAME...
echo knitt_lyelya.ua | vercel env add SHOP_NAME production

echo.
echo [7/9] Удаление NOTIFICATION_EMAIL...
vercel env rm NOTIFICATION_EMAIL production --yes

echo.
echo [8/9] Добавление NOTIFICATION_EMAIL...
echo knitt.lyelya531@gmail.com | vercel env add NOTIFICATION_EMAIL production

echo.
echo [9/9] Проверка переменных...
vercel env ls

echo.
echo ======================================
echo ГОТОВО! Теперь нужно сделать redeploy:
echo ======================================
echo.
echo Вариант 1 (рекомендуется):
echo   1. Откройте https://vercel.com/lehaneploxos-projects/designer-bags-ua
echo   2. Перейдите в "Deployments"
echo   3. Найдите последний деплой
echo   4. Нажмите три точки (...) → "Redeploy"
echo.
echo Вариант 2 (через командную строку):
echo   vercel --prod --force
echo.
pause
