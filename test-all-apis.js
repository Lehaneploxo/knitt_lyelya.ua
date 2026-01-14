/**
 * Полная проверка всех API endpoints
 * Запуск: node test-all-apis.js
 */

const BASE_URL = 'https://www.knittlyelyaua.com';

async function testOrderCreation() {
  console.log('\n========================================');
  console.log('ТЕСТ 1: Создание заказа (наложенный платеж)');
  console.log('========================================\n');

  const testOrder = {
    customerName: 'Тест Тестович',
    customerEmail: 'test@example.com',
    customerPhone: '+380501234567',
    items: [
      {
        id: 'test-1',
        name: { ua: 'Тестовый товар', en: 'Test Product' },
        quantity: 1,
        price: 100,
        image: 'test.jpg'
      }
    ],
    totalAmount: 100,
    deliveryMethod: 'meest',
    deliveryAddress: 'Київ, відділення 1',
    paymentMethod: 'cash_on_delivery',
    notes: 'Тестове замовлення'
  };

  try {
    console.log('📤 Отправка запроса на создание заказа...');
    console.log('URL:', `${BASE_URL}/api/orders/create`);
    console.log('Данные:', JSON.stringify(testOrder, null, 2));

    const response = await fetch(`${BASE_URL}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });

    console.log('\n📥 Статус ответа:', response.status, response.statusText);

    const data = await response.json();
    console.log('📄 Ответ:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log('\n✅ УСПЕХ! Заказ создан:', data.orderNumber);
      return { success: true, orderNumber: data.orderNumber };
    } else {
      console.log('\n❌ ОШИБКА! Заказ не создан');
      console.log('Детали:', data.error || data);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.log('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    return { success: false, error: error.message };
  }
}

async function testMonobankInvoice(orderNumber) {
  console.log('\n========================================');
  console.log('ТЕСТ 2: Создание Monobank invoice');
  console.log('========================================\n');

  const invoiceData = {
    amount: 100,
    orderId: orderNumber,
    customerEmail: 'test@example.com'
  };

  try {
    console.log('📤 Отправка запроса на создание invoice...');
    console.log('URL:', `${BASE_URL}/api/payment/create-invoice`);
    console.log('Данные:', JSON.stringify(invoiceData, null, 2));

    const response = await fetch(`${BASE_URL}/api/payment/create-invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });

    console.log('\n📥 Статус ответа:', response.status, response.statusText);

    const data = await response.json();
    console.log('📄 Ответ:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log('\n✅ УСПЕХ! Invoice создан');
      console.log('Invoice ID:', data.invoiceId);
      console.log('Payment URL:', data.pageUrl);
      return { success: true, pageUrl: data.pageUrl };
    } else {
      console.log('\n❌ ОШИБКА! Invoice не создан');
      console.log('Детали:', data.error || data);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.log('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    return { success: false, error: error.message };
  }
}

async function testWebhookEndpoint() {
  console.log('\n========================================');
  console.log('ТЕСТ 3: Webhook endpoint');
  console.log('========================================\n');

  try {
    console.log('📤 Проверка webhook endpoint...');
    console.log('URL:', `${BASE_URL}/api/payment/webhook`);

    const response = await fetch(`${BASE_URL}/api/payment/webhook`, {
      method: 'GET'
    });

    console.log('\n📥 Статус ответа:', response.status, response.statusText);

    const data = await response.json();
    console.log('📄 Ответ:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ УСПЕХ! Webhook endpoint работает');
      return { success: true };
    } else {
      console.log('\n❌ ОШИБКА! Webhook endpoint не работает');
      return { success: false };
    }
  } catch (error) {
    console.log('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('🚀 ЗАПУСК ПОЛНОЙ ПРОВЕРКИ API');
  console.log('Дата:', new Date().toLocaleString('uk-UA'));
  console.log('Base URL:', BASE_URL);

  const results = {
    orderCreation: null,
    monobankInvoice: null,
    webhookEndpoint: null
  };

  // Тест 1: Создание заказа
  results.orderCreation = await testOrderCreation();

  // Тест 2: Monobank invoice (только если есть orderNumber)
  if (results.orderCreation.success && results.orderCreation.orderNumber) {
    results.monobankInvoice = await testMonobankInvoice(results.orderCreation.orderNumber);
  } else {
    console.log('\n⚠️  ПРОПУСК теста Monobank (нет orderNumber)');
    results.monobankInvoice = { success: false, skipped: true };
  }

  // Тест 3: Webhook endpoint
  results.webhookEndpoint = await testWebhookEndpoint();

  // Итоги
  console.log('\n========================================');
  console.log('📊 ИТОГИ ТЕСТИРОВАНИЯ');
  console.log('========================================\n');

  console.log('1. Создание заказа:', results.orderCreation.success ? '✅ РАБОТАЕТ' : '❌ НЕ РАБОТАЕТ');
  if (!results.orderCreation.success) {
    console.log('   Ошибка:', results.orderCreation.error);
  }

  console.log('2. Monobank invoice:', results.monobankInvoice.success ? '✅ РАБОТАЕТ' : (results.monobankInvoice.skipped ? '⚠️  ПРОПУЩЕН' : '❌ НЕ РАБОТАЕТ'));
  if (!results.monobankInvoice.success && !results.monobankInvoice.skipped) {
    console.log('   Ошибка:', results.monobankInvoice.error);
  }

  console.log('3. Webhook endpoint:', results.webhookEndpoint.success ? '✅ РАБОТАЕТ' : '❌ НЕ РАБОТАЕТ');

  const allWorking = results.orderCreation.success &&
                     results.monobankInvoice.success &&
                     results.webhookEndpoint.success;

  console.log('\n========================================');
  if (allWorking) {
    console.log('✅ ВСЕ ТЕСТЫ ПРОШЛИ УСПЕШНО!');
    console.log('Оплата должна работать!');
  } else {
    console.log('❌ ЕСТЬ ПРОБЛЕМЫ!');
    console.log('Смотрите детали выше.');
  }
  console.log('========================================\n');

  return results;
}

// Запуск
runAllTests().catch(error => {
  console.error('ФАТАЛЬНАЯ ОШИБКА:', error);
  process.exit(1);
});
