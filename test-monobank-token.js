/**
 * Скрипт для проверки Monobank токена
 * Запуск: node test-monobank-token.js
 */

const MONOBANK_TOKEN = 'mEV7ptuaG1LcHiw1viKbAaQ'; // Ваш текущий токен

async function testMonobankToken() {
  console.log('🔍 Проверка Monobank токена...\n');
  console.log('Токен:', MONOBANK_TOKEN);
  console.log('Длина токена:', MONOBANK_TOKEN.length, 'символов\n');

  if (MONOBANK_TOKEN.length < 30) {
    console.log('⚠️  ПРЕДУПРЕЖДЕНИЕ: Токен слишком короткий!');
    console.log('   Обычно Monobank токен состоит из 100+ символов.\n');
  }

  try {
    console.log('📡 Отправка тестового запроса к Monobank API...\n');

    // Тестовый запрос - создание минимального invoice
    const testInvoiceData = {
      amount: 100, // 1 грн в копейках
      ccy: 980, // UAH
      merchantPaymInfo: {
        reference: 'TEST-' + Date.now(),
        destination: 'Тестовий платіж',
        comment: 'Test payment'
      }
    };

    const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Token': MONOBANK_TOKEN
      },
      body: JSON.stringify(testInvoiceData)
    });

    console.log('Статус ответа:', response.status, response.statusText);

    const data = await response.json();
    console.log('\nОтвет от Monobank:');
    console.log(JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ УСПЕХ! Токен работает!');
      console.log('Invoice ID:', data.invoiceId);
      console.log('Payment URL:', data.pageUrl);
    } else {
      console.log('\n❌ ОШИБКА! Токен не работает!');

      if (response.status === 401) {
        console.log('\n💡 Причина: Неверный токен или токен не активен');
        console.log('   Решение:');
        console.log('   1. Проверьте что токен скопирован полностью');
        console.log('   2. Свяжитесь с Monobank для получения нового токена');
      } else if (response.status === 403) {
        console.log('\n💡 Причина: Токен не имеет прав на создание invoice');
        console.log('   Решение: Обратитесь в Monobank для активации эквайринга');
      } else if (response.status === 429) {
        console.log('\n💡 Причина: Превышен лимит запросов');
        console.log('   Решение: Подождите несколько минут и попробуйте снова');
      }
    }

  } catch (error) {
    console.log('\n❌ ОШИБКА при выполнении запроса:');
    console.log(error.message);
    console.log('\n💡 Возможные причины:');
    console.log('   - Нет интернет соединения');
    console.log('   - Monobank API недоступен');
  }
}

// Запуск теста
testMonobankToken();
