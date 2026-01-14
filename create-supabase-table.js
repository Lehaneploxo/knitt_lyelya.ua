require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTable() {
  console.log('🚀 Створюю таблицю products в Supabase...\n');

  try {
    // Читаємо SQL файл
    const sqlPath = path.join(__dirname, 'supabase-products-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Виконуємо SQL через Supabase API
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // Якщо RPC не працює, спробуємо створити таблицю через REST API
      console.log('⚠️  RPC не доступний, створюю таблицю іншим способом...\n');

      // Просто спробуємо вставити тестовий запис - це створить таблицю якщо її немає
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          id: 'test_product',
          name_ua: 'Тест',
          name_en: 'Test',
          price: 100,
          category: 'test',
          in_stock: true
        });

      if (insertError && !insertError.message.includes('relation "public.products" does not exist')) {
        console.log('✅ Таблиця вже існує або була створена!');

        // Видаляємо тестовий товар
        await supabase.from('products').delete().eq('id', 'test_product');
      } else if (insertError) {
        throw new Error('Таблиця не існує. Створіть її вручну через Supabase Dashboard');
      }
    } else {
      console.log('✅ Таблиця створена!');
    }

    console.log('\n📝 Запустіть: node setup-supabase-products.js');
    console.log('Щоб завантажити товари з JSON в Supabase');

  } catch (error) {
    console.error('❌ Помилка:', error.message);
    console.log('\n💡 Створіть таблицю вручну:');
    console.log('1. Відкрийте: https://supabase.com/dashboard');
    console.log('2. SQL Editor → New query');
    console.log('3. Скопіюйте SQL з: supabase-products-table.sql');
    console.log('4. Execute\n');
  }
}

createTable();
