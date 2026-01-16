// Повний скрипт для виправлення таблиці products
// Запуск: node fix-all.js

const { createClient } = require('@supabase/supabase-js')
const products = require('./data/products.json')

const supabaseUrl = 'https://pzfblgxfwvbnfbtdctun.supabase.co'
const supabaseServiceKey = 'sb_secret_saVwbawoH8jRbbPZVkPJUQ_OTseDYWz'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixAll() {
  console.log('🔧 Виправлення таблиці products в Supabase...\n')

  // Крок 1: Додаємо колонки через raw SQL
  console.log('📋 Крок 1: Додаю відсутні колонки...')

  const alterStatements = [
    "ALTER TABLE products ADD COLUMN IF NOT EXISTS materials JSONB DEFAULT '[]'::jsonb",
    "ALTER TABLE products ADD COLUMN IF NOT EXISTS colors JSONB DEFAULT '[]'::jsonb",
    "ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions JSONB",
    "ALTER TABLE products ADD COLUMN IF NOT EXISTS price_eur DECIMAL(10, 2)",
    "ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false",
    "ALTER TABLE products ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false"
  ]

  for (const sql of alterStatements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
      if (error && !error.message.includes('already exists')) {
        // Якщо RPC не працює, просто продовжуємо
        console.log('   RPC недоступний, пробую інший метод...')
        break
      }
    } catch (e) {
      // Ігноруємо помилки RPC
    }
  }

  // Крок 2: Оновлюємо кожен товар з повним перезаписом (upsert)
  console.log('\n📦 Крок 2: Оновлюю товари...')

  let updated = 0
  let errors = 0

  for (const product of products) {
    try {
      const productData = {
        id: product.id,
        name_ua: product.name.ua,
        name_en: product.name.en,
        price: product.price,
        price_eur: product.priceEUR || null,
        description_ua: product.description?.ua || '',
        description_en: product.description?.en || '',
        category: product.category,
        in_stock: product.inStock !== false,
        sku: product.sku || product.id,
        images: product.images || [],
        materials: product.materials || [],
        colors: product.colors || [],
        dimensions: product.dimensions || null,
        is_new: product.new === true,
        is_bestseller: product.featured === true
      }

      const { error } = await supabase
        .from('products')
        .upsert(productData, { onConflict: 'id' })

      if (error) throw error

      updated++
      const mats = product.materials ? product.materials.join(', ') : '-'
      console.log(`✅ ${product.id}: ${product.name.ua} [${mats}]`)

    } catch (error) {
      errors++
      console.error(`❌ ${product.id}:`, error.message)
    }
  }

  console.log(`\n📊 Результат:`)
  console.log(`   Оновлено: ${updated}`)
  console.log(`   Помилок: ${errors}`)
  console.log(`   Всього: ${products.length}`)

  if (errors === 0) {
    console.log('\n✨ Успішно! Перезавантаж сайт - матеріали та розміри будуть на місці!')
  } else if (errors > 0 && errors < products.length) {
    console.log('\n⚠️  Частково оновлено. Перевір помилки вище.')
  } else {
    console.log('\n❌ Не вдалося оновити. Потрібно спочатку додати колонки в Supabase:')
    console.log('\nВідкрий https://supabase.com → SQL Editor → виконай:')
    console.log(`
ALTER TABLE products ADD COLUMN IF NOT EXISTS materials JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS colors JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions JSONB;
    `)
  }
}

fixAll()
