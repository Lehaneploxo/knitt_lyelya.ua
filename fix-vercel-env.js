/**
 * Скрипт для исправления переменных окружения в Vercel
 * Удаляет символы новой строки (\n) из переменных
 *
 * Запуск: node fix-vercel-env.js
 */

const { execSync } = require('child_process');

// Переменные которые нужно обновить
const envVars = {
  MONOBANK_TOKEN: 'mEV7ptuaG1LcHiw1viKbAaQ',
  NEXT_PUBLIC_BASE_URL: 'https://www.knittlyelyaua.com',
  SHOP_NAME: 'knitt_lyelya.ua',
  NOTIFICATION_EMAIL: 'knitt.lyelya531@gmail.com',
  GMAIL_USER: 'knitt.lyelya531@gmail.com',
  GMAIL_APP_PASSWORD: 'qiyuuhzinhfqtxic'
};

console.log('🔧 ИСПРАВЛЕНИЕ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ VERCEL\n');
console.log('=' .repeat(60));
console.log('\n⚠️  ВАЖНО: Убедитесь что у вас:');
console.log('   1. Установлен Vercel CLI (npm i -g vercel)');
console.log('   2. Выполнена авторизация (vercel login)');
console.log('   3. Вы находитесь в директории проекта\n');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Продолжить? (y/n): ', (answer) => {
  readline.close();

  if (answer.toLowerCase() !== 'y') {
    console.log('\n❌ Отменено пользователем');
    process.exit(0);
  }

  console.log('\n🚀 Начинаем обновление переменных...\n');

  let successCount = 0;
  let errorCount = 0;

  Object.entries(envVars).forEach(([key, value], index) => {
    try {
      console.log(`[${index + 1}/${Object.keys(envVars).length}] Обновление ${key}...`);

      // Удаляем старую переменную
      try {
        execSync(`vercel env rm ${key} production --yes`, {
          stdio: 'pipe',
          encoding: 'utf-8'
        });
        console.log(`   ✓ Удалена старая переменная`);
      } catch (e) {
        // Игнорируем ошибку если переменной не существовало
        console.log(`   ℹ Переменная не существовала`);
      }

      // Добавляем новую переменную
      // Используем временный файл для передачи значения
      const fs = require('fs');
      const tmpFile = `.tmp-env-${key}`;
      fs.writeFileSync(tmpFile, value);

      execSync(`type ${tmpFile} | vercel env add ${key} production`, {
        stdio: 'pipe',
        encoding: 'utf-8',
        shell: 'cmd.exe'
      });

      fs.unlinkSync(tmpFile);
      console.log(`   ✓ Добавлена новая переменная\n`);
      successCount++;

    } catch (error) {
      console.log(`   ✗ Ошибка: ${error.message}\n`);
      errorCount++;
    }
  });

  console.log('\n' + '=' .repeat(60));
  console.log('📊 РЕЗУЛЬТАТЫ:');
  console.log(`   ✓ Успешно обновлено: ${successCount}`);
  console.log(`   ✗ Ошибок: ${errorCount}`);
  console.log('=' .repeat(60));

  if (successCount > 0) {
    console.log('\n✅ ПЕРЕМЕННЫЕ ОБНОВЛЕНЫ!');
    console.log('\n📋 СЛЕДУЮЩИЕ ШАГИ:');
    console.log('\n1. Проверьте переменные:');
    console.log('   vercel env ls');
    console.log('\n2. Сделайте redeploy одним из способов:');
    console.log('\n   Вариант A (через Dashboard):');
    console.log('   → https://vercel.com/lehaneploxos-projects/designer-bags-ua');
    console.log('   → Deployments → последний деплой → ⋯ → Redeploy');
    console.log('\n   Вариант B (через CLI):');
    console.log('   → vercel --prod --force');
    console.log('\n3. После редеплоя протестируйте оплату на сайте');
  } else {
    console.log('\n❌ НЕ УДАЛОСЬ ОБНОВИТЬ ПЕРЕМЕННЫЕ');
    console.log('   Проверьте что Vercel CLI установлен и вы авторизованы');
  }
});
