@echo off
echo.
echo ================================================
echo   Деплой змін на Vercel
echo ================================================
echo.

echo 📝 Додаємо зміни в Git...
git add data/products.json

echo.
echo 💾 Створюємо commit...
git commit -m "Оновлення товарів через адмін-панель"

echo.
echo 🚀 Відправляємо на GitHub...
git push

echo.
echo ✅ Готово! Vercel автоматично задеплоїть зміни за 1-2 хвилини
echo.
pause
