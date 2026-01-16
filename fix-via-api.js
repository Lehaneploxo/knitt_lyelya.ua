// Виправлення через пряме підключення до PostgreSQL
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://pzfblgxfwvbnfbtdctun.supabase.co'
const supabaseServiceKey = 'sb_secret_saVwbawoH8jRbbPZVkPJUQ_OTseDYWz'
const products = require('./data/products.json')

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fix() {
  console.log('🔧 Оновлюю товари БЕЗ нових колонок (тільки існуючі поля)...\n')

  // Спочатку перевіримо які колонки є
  const { data: testData, error: testError } = await supabase
    .from('products')
    .select('*')
    .limit(1)

  if (testError) {
    console.log('❌ Помилка підключення:', testError.message)
    return
  }

  const existingColumns = testData && testData[0] ? Object.keys(testData[0]) : []
  console.log('📋 Існуючі колонки:', existingColumns.join(', '))

  const hasMaterials = existingColumns.includes('materials')
  const hasColors = existingColumns.includes('colors')
  const hasDimensions = existingColumns.includes('dimensions')
  const hasPriceEur = existingColumns.includes('price_eur')
  const hasIsNew = existingColumns.includes('is_new')
  const hasIsBestseller = existingColumns.includes('is_bestseller')

  console.log(`\n📊 Статус колонок:`)
  console.log(`   materials: ${hasMaterials ? '✅' : '❌'}`)
  console.log(`   colors: ${hasColors ? '✅' : '❌'}`)
  console.log(`   dimensions: ${hasDimensions ? '✅' : '❌'}`)
  console.log(`   price_eur: ${hasPriceEur ? '✅' : '❌'}`)

  if (!hasMaterials || !hasDimensions) {
    console.log('\n⚠️  Колонки materials/dimensions відсутні!')
    console.log('   Потрібно додати їх в Supabase SQL Editor.')
    return
  }

  console.log('\n📦 Оновлюю товари...')

  let updated = 0
  let errors = 0

  for (const product of products) {
    try {
      const updateData = {}

      if (hasMaterials) updateData.materials = product.materials || []
      if (hasColors) updateData.colors = product.colors || []
      if (hasDimensions) updateData.dimensions = product.dimensions || null
      if (hasPriceEur) updateData.price_eur = product.priceEUR || null
      if (hasIsNew) updateData.is_new = product.new === true
      if (hasIsBestseller) updateData.is_bestseller = product.featured === true

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id)

      if (error) throw error

      updated++
      const mats = product.materials ? product.materials.join(', ') : '-'
      console.log(`✅ ${product.id} [${mats}]`)

    } catch (error) {
      errors++
      console.error(`❌ ${product.id}:`, error.message)
    }
  }

  console.log(`\n📊 Результат: оновлено ${updated}, помилок ${errors}`)
}

fix()
