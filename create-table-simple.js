require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function createTable() {
  console.log('🚀 Створюю таблицю products...\n');

  try {
    // Спробуємо просто вставити тестовий запис
    // Якщо таблиця не існує, отримаємо помилку
    const { data, error } = await supabase
      .from('products')
      .insert({
        id: 'test',
        name_ua: 'Тест',
        name_en: 'Test',
        price: 100,
        category: 'test',
        in_stock: true
      })
      .select();

    if (error) {
      console.log('Помилка:', error.message);
      console.log('\n💡 Створіть таблицю вручну:');
      console.log('1. Відкрийте: https://supabase.com/dashboard/project/pzfblgxfwvbnfbtdctun/editor');
      console.log('2. SQL Editor → New query');
      console.log('3. Виконайте SQL з файлу: supabase-products-table.sql\n');
    } else {
      console.log('✅ Таблиця існує!');
      // Видаляємо тестовий запис
      await supabase.from('products').delete().eq('id', 'test');
      console.log('🎉 Готово до роботи!\n');
    }
  } catch (err) {
    console.error('Помилка:', err.message);
  }
}

createTable();
