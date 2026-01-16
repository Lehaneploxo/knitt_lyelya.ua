import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAllProducts } from '@/lib/products'

export async function POST() {
  try {
    console.log('🚀 Ініціалізація products в Supabase...')

    // Спробуємо прочитати products
    const { data: existingProducts, error: readError } = await supabaseAdmin
      .from('products')
      .select('id')
      .limit(1)

    // Якщо таблиці немає - створюємо через SQL
    if (readError && readError.code === '42P01') {
      console.log('Створюю таблицю products...')

      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name_ua TEXT NOT NULL,
          name_en TEXT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          price_eur DECIMAL(10, 2),
          description_ua TEXT,
          description_en TEXT,
          category TEXT NOT NULL,
          in_stock BOOLEAN DEFAULT true,
          sku TEXT,
          images JSONB,
          materials JSONB,
          colors JSONB,
          dimensions JSONB,
          is_new BOOLEAN DEFAULT false,
          is_bestseller BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `

      // Виконуємо SQL (якщо є доступ)
      const { error: createError } = await supabaseAdmin.rpc('exec_sql', {
        sql: createTableSQL
      })

      if (createError) {
        console.error('Не вдалося створити таблицю через RPC:', createError.message)
        // Просто спробуємо вставити - це може створити таблицю
      }
    }

    // Завантажуємо товари з JSON
    const jsonProducts = getAllProducts()
    console.log(`📦 Знайдено ${jsonProducts.length} товарів у JSON`)

    let success = 0
    let skipped = 0
    let errors = 0

    for (const product of jsonProducts) {
      try {
        // Перевіряємо чи вже є
        const { data: existing } = await supabaseAdmin
          .from('products')
          .select('id')
          .eq('id', product.id)
          .single()

        if (existing) {
          skipped++
          continue
        }

        // Додаємо товар
        const { error } = await supabaseAdmin.from('products').insert({
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
        })

        if (error) throw error

        success++
        console.log(`✅ Додано: ${product.name.ua}`)

      } catch (error: any) {
        errors++
        console.error(`❌ ${product.name.ua}:`, error.message)
      }
    }

    return NextResponse.json({
      success: true,
      imported: success,
      skipped,
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
