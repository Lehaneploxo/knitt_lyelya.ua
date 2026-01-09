const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

const client = createClient({
  projectId: 'alskls9k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

async function migrateProducts() {
  console.log('🚀 Починаємо міграцію товарів у Sanity...\n')

  // Читаємо JSON файл
  const filePath = path.join(__dirname, 'data', 'products.json')
  const productsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  console.log(`📦 Знайдено ${productsData.length} товарів для міграції\n`)

  let success = 0
  let failed = 0

  for (const product of productsData) {
    try {
      // Конвертуємо формат
      const sanityProduct = {
        _type: 'product',
        _id: product.id,
        name_ua: product.name.ua,
        name_en: product.name.en,
        description_ua: product.description.ua,
        description_en: product.description.en,
        price: product.price,
        category: product.category,
        inStock: product.inStock,
        sku: product.sku,
        images: product.images,
        materials: product.materials,
        colors: product.colors,
        dimensions: product.dimensions
      }

      // Створюємо або оновлюємо в Sanity
      await client.createOrReplace(sanityProduct)

      success++
      console.log(`✅ ${success}. ${product.name.ua} (${product.id})`)
    } catch (error) {
      failed++
      console.error(`❌ Помилка для ${product.id}:`, error.message)
    }
  }

  console.log(`\n✨ Міграція завершена!`)
  console.log(`✅ Успішно: ${success}`)
  console.log(`❌ Помилок: ${failed}`)
}

migrateProducts().catch(console.error)
