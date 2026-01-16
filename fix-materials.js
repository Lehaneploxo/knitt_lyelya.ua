// Скрипт для оновлення materials та dimensions в Supabase
// Запуск: node fix-materials.js

const { createClient } = require('@supabase/supabase-js')
const products = require('./data/products.json')

const supabaseUrl = 'https://pzfblgxfwvbnfbtdctun.supabase.co'
const supabaseServiceKey = 'sb_secret_saVwbawoH8jRbbPZVkPJUQ_OTseDYWz'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixMaterials() {
  console.log('🔧 Оновлення materials та dimensions в Supabase...\n')

  // Спочатку перевіримо/додамо колонки
  console.log('📋 Перевіряю структуру таблиці...')

  let updated = 0
  let errors = 0

  for (const product of products) {
    try {
      const updateData = {
        materials: product.materials || [],
        colors: product.colors || [],
        dimensions: product.dimensions || null,
        price_eur: product.priceEUR || null,
        is_new: product.new === true,
        is_bestseller: product.featured === true
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id)

      if (error) {
        // Якщо колонки не існують, спробуємо додати їх
        if (error.message.includes('column') || error.code === '42703') {
          console.log('⚠️  Колонки відсутні в таблиці. Потрібно додати їх в Supabase SQL Editor:')
          console.log(`
ALTER TABLE products ADD COLUMN IF NOT EXISTS materials JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS colors JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_eur DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false;
          `)
          process.exit(1)
        }
        throw error
      }

      updated++
      console.log(`✅ ${product.id}: ${product.name.ua}`)
      if (product.materials) {
        console.log(`   Матеріали: ${product.materials.join(', ')}`)
      }
      if (product.dimensions) {
        console.log(`   Розміри: ${JSON.stringify(product.dimensions)}`)
      }

    } catch (error) {
      errors++
      console.error(`❌ ${product.id}:`, error.message)
    }
  }

  console.log(`\n📊 Результат:`)
  console.log(`   Оновлено: ${updated}`)
  console.log(`   Помилок: ${errors}`)
  console.log(`   Всього: ${products.length}`)

  if (updated > 0) {
    console.log('\n✨ Готово! Перезавантаж сторінку на сайті.')
  }
}

fixMaterials()
