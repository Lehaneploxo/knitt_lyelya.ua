/**
 * Скрипт для створення таблиці orders в Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://pzfblgxfwvbnfbtdctun.supabase.co';
const SUPABASE_SERVICE_KEY = 'sb_secret_saVwbawoH8jRbbPZVkPJUQ_OTseDYWz';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupDatabase() {
  console.log('🚀 Створення таблиці orders в Supabase...\n');

  try {
    // Читаємо SQL файл
    const sqlPath = path.join(__dirname, 'supabase-setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Виконуємо SQL (розділяємо на окремі команди)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      console.log('Виконую SQL команду...');
      const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });

      if (error) {
        // Пробуємо альтернативний спосіб
        console.log('Використовую альтернативний метод...');
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: statement })
        });

        if (!response.ok) {
          console.log('⚠️  Команда не виконалась, але продовжуємо...');
        }
      }
    }

    console.log('\n✅ SQL команди виконано!');

    // Перевіряємо чи таблиця створена
    console.log('\n🔍 Перевіряю таблицю...');
    const { data, error } = await supabase
      .from('orders')
      .select('count')
      .limit(1);

    if (error) {
      console.log('⚠️  Помилка перевірки:', error.message);
      console.log('\n📝 Вам потрібно вручну створити таблицю:');
      console.log('1. Відкрийте Supabase Dashboard');
      console.log('2. SQL Editor');
      console.log('3. Скопіюйте вміст файлу supabase-setup.sql');
      console.log('4. Виконайте SQL\n');
    } else {
      console.log('✅ Таблиця orders створена успішно!');
    }

  } catch (error) {
    console.error('❌ Помилка:', error.message);
  }
}

setupDatabase();
