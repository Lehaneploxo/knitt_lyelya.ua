import { NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'
import { getAllProducts } from '@/lib/products'

export async function POST() {
  try {
    console.log('🚀 Початок імпорту товарів у Sanity...')

    // Читаємо товари з JSON
    const jsonProducts = getAllProducts()
    console.log(`📦 Знайдено ${jsonProducts.length} товарів у JSON`)

    let success = 0
    let errors = 0
    let skipped = 0

    for (const product of jsonProducts) {
      try {
        // Створюємо slug
        const slug = product.name.en
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')

        // Перевіряємо чи вже є товар
        const existingProduct = await writeClient.fetch(
          '*[_type == "product" && _id == $id][0]',
          { id: product.id }
        )

        if (existingProduct) {
          console.log(`⚠️  Пропускаю (вже є): ${product.name.ua}`)
          skipped++
          continue
        }

        // Створюємо товар в Sanity
        await writeClient.create({
          _type: 'product',
          _id: product.id,
          name_ua: product.name.ua,
          name_en: product.name.en,
          slug: {
            _type: 'slug',
            current: slug,
          },
          sku: product.sku || product.id,
          price: product.price,
          discount: 0,
          category: product.category,
          description_ua: product.description?.ua || '',
          description_en: product.description?.en || '',
          materials: product.materials || [],
          colors: product.colors || [],
          dimensions: product.dimensions ? {
            height: product.dimensions.height,
            width: product.dimensions.width,
            depth: product.dimensions.depth,
          } : undefined,
          inStock: product.inStock !== false,
          isNew: product.new === true,
          isBestseller: product.featured === true,
          images: [], // Фото додамо пізніше через Sanity Studio
        })

        console.log(`✅ Імпортовано: ${product.name.ua}`)
        success++

      } catch (error: any) {
        console.error(`❌ Помилка для ${product.name.ua}:`, error.message)
        errors++
      }
    }

    console.log(`\n🎉 ГОТОВО! Успішно: ${success}, Пропущено: ${skipped}, Помилок: ${errors}`)

    return NextResponse.json({
      success: true,
      imported: success,
      skipped,
      errors,
      total: jsonProducts.length
    })

  } catch (error: any) {
    console.error('💥 Критична помилка:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to import products' },
      { status: 500 }
    )
  }
}
