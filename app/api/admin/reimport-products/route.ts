import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAllProducts } from '@/lib/products'

export async function POST() {
  try {
    console.log('🔄 Повний реімпорт товарів в Supabase...')

    const jsonProducts = getAllProducts()
    console.log(`📦 Знайдено ${jsonProducts.length} товарів у JSON`)

    let updated = 0
    let created = 0
    let errors = 0

    for (const product of jsonProducts) {
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
          is_bestseller: product.featured === true,
        }

        // Upsert - оновити якщо є, створити якщо немає
        const { error } = await supabaseAdmin
          .from('products')
          .upsert(productData, { onConflict: 'id' })

        if (error) throw error

        // Перевіряємо чи було оновлення чи створення
        const { data: existing } = await supabaseAdmin
          .from('products')
          .select('created_at, updated_at')
          .eq('id', product.id)
          .single()

        if (existing && existing.created_at !== existing.updated_at) {
          updated++
        } else {
          created++
        }

        console.log(`✅ ${product.name.ua}`)

      } catch (error: any) {
        errors++
        console.error(`❌ ${product.name.ua}:`, error.message)
      }
    }

    return NextResponse.json({
      success: true,
      updated,
      created,
      errors,
      total: jsonProducts.length
    })

  } catch (error: any) {
    console.error('💥 Помилка:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
