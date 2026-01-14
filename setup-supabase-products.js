require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ПОМИЛКА: Немає SUPABASE_URL або SUPABASE_SERVICE_KEY в .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupProductsTable() {
  console.log('🚀 Налаштування таблиці products в Supabase...\n');

  try {
    // Перевіряємо чи існує таблиця
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (checkError && checkError.code !== 'PGRST116') {
      console.log('⚠️  Таблиця products ще не створена');
      console.log('📝 Створіть таблицю вручну виконавши SQL з файлу: supabase-products-table.sql');
      console.log('\n1. Відкрийте Supabase Dashboard: https://supabase.com/dashboard');
      console.log('2. Виберіть ваш проект');
      console.log('3. Перейдіть в "SQL Editor"');
      console.log('4. Скопіюйте SQL з файлу supabase-products-table.sql');
      console.log('5. Виконайте SQL');
      console.log('6. Запустіть цей скрипт знову\n');
      return;
    }

    console.log('✅ Таблиця products існує!');

    // Читаємо товари з JSON
    const productsPath = path.join(__dirname, 'data', 'products.json');
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    console.log(`📦 Знайдено ${products.length} товарів у JSON\n`);

    let success = 0;
    let errors = 0;
    let skipped = 0;

    for (const product of products) {
      try {
        // Перевіряємо чи вже є товар
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('id', product.id)
          .single();

        if (existing) {
          console.log(`⚠️  Пропускаю (вже є): ${product.name.ua}`);
          skipped++;
          continue;
        }

        // Додаємо товар
        const { error } = await supabase.from('products').insert({
          id: product.id,
          name_ua: product.name.ua,
          name_en: product.name.en,
          price: product.price,
          description_ua: product.description?.ua || '',
          description_en: product.description?.en || '',
          category: product.category,
          in_stock: product.inStock !== false,
          sku: product.sku || product.id,
          images: product.images || [],
          materials: product.materials || [],
          colors: product.colors || [],
          dimensions: product.dimensions || {},
          is_new: product.new === true,
          is_bestseller: product.featured === true,
        });

        if (error) {
          throw error;
        }

        console.log(`✅ Додано: ${product.name.ua}`);
        success++;

      } catch (error) {
        console.error(`❌ Помилка для ${product.name.ua}:`, error.message);
        errors++;
      }
    }

    console.log(`\n\n🎉 ГОТОВО!`);
    console.log(`✅ Успішно додано: ${success} товарів`);
    console.log(`⚠️  Пропущено: ${skipped} товарів`);
    if (errors > 0) {
      console.log(`❌ Помилок: ${errors}`);
    }

  } catch (error) {
    console.error('💥 Критична помилка:', error.message);
  }
}

setupProductsTable();
