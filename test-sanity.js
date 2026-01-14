/**
 * Проверка подключения к Sanity
 */

const { createClient } = require('next-sanity');

const SANITY_PROJECT_ID = 'alskls9k';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_API_TOKEN || 'skFevW9cg8AArRkqRJZBothK14NbuEa8nAHLIwZUsBql7nzEu3EBXAtsmNXYChIVqKBY6CRkkIFzLHGo8OtMKlAtyoMZRQeYsGxkqfqebYDpiOKAMUaO00Ls2OcyOEMe6Cupdwm6uYb6WyTM3NfbDi6TTmW9uyxny45suJoaEJ16zIuN16Pw';

console.log('🔍 ПРОВЕРКА SANITY ПОДКЛЮЧЕНИЯ\n');
console.log('Project ID:', SANITY_PROJECT_ID);
console.log('Dataset:', SANITY_DATASET);
console.log('Token:', SANITY_TOKEN ? `${SANITY_TOKEN.substring(0, 10)}***` : 'НЕ УСТАНОВЛЕН');

const writeClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: SANITY_TOKEN,
});

async function testSanityConnection() {
  try {
    console.log('\n📤 Попытка создать тестовый заказ в Sanity...\n');

    const testOrder = {
      _type: 'order',
      orderNumber: 'TEST-' + Date.now(),
      customerName: 'Test User',
      customerEmail: 'test@test.com',
      customerPhone: '+380501234567',
      items: [
        {
          _type: 'object',
          productId: 'test-1',
          name: 'Test Product',
          quantity: 1,
          price: 100,
        }
      ],
      totalAmount: 100,
      paymentStatus: 'not_paid',
      deliveryMethod: 'test',
      deliveryAddress: 'Test address',
      orderDate: new Date().toISOString(),
      notes: 'Test order from diagnostic script',
    };

    console.log('Данные заказа:', JSON.stringify(testOrder, null, 2));

    const result = await writeClient.create(testOrder);

    console.log('\n✅ УСПЕХ! Заказ создан в Sanity');
    console.log('Order ID:', result._id);
    console.log('Order Number:', result.orderNumber);

    // Удалим тестовый заказ
    console.log('\n🗑️  Удаление тестового заказа...');
    await writeClient.delete(result._id);
    console.log('✅ Тестовый заказ удален');

    return { success: true };
  } catch (error) {
    console.log('\n❌ ОШИБКА подключения к Sanity!');
    console.log('Тип ошибки:', error.name);
    console.log('Сообщение:', error.message);
    console.log('\nПолная ошибка:', error);

    return { success: false, error: error.message };
  }
}

testSanityConnection();
