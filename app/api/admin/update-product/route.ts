import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getProductById } from '@/lib/products'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, name_ua, name_en, price, description_ua, description_en, category, inStock } = data

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Перевіряємо чи є товар в Supabase
    const { data: existingProduct } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    // Якщо товару немає - створюємо його
    if (!existingProduct) {
      console.log(`Товар ${id} не знайдено в Supabase, створюю...`)

      // Читаємо товар з JSON
      const jsonProduct = getProductById(id)
      if (!jsonProduct) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        )
      }

      // Створюємо товар в Supabase
      const { error: insertError } = await supabaseAdmin.from('products').insert({
        id,
        name_ua: name_ua || jsonProduct.name.ua,
        name_en: name_en || jsonProduct.name.en,
        price: price || jsonProduct.price,
        description_ua: description_ua || jsonProduct.description?.ua || '',
        description_en: description_en || jsonProduct.description?.en || '',
        category: category || jsonProduct.category,
        in_stock: inStock !== undefined ? inStock : (jsonProduct.inStock !== false),
        sku: jsonProduct.sku || id,
        images: jsonProduct.images || [],
      })

      if (insertError) {
        throw insertError
      }

      console.log(`✅ Товар ${id} створено в Supabase`)
      return NextResponse.json({ success: true, created: true })
    }

    // Оновлюємо товар
    const updates: any = {}
    if (name_ua !== undefined) updates.name_ua = name_ua
    if (name_en !== undefined) updates.name_en = name_en
    if (price !== undefined) updates.price = price
    if (description_ua !== undefined) updates.description_ua = description_ua
    if (description_en !== undefined) updates.description_en = description_en
    if (category !== undefined) updates.category = category
    if (inStock !== undefined) updates.in_stock = inStock

    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id)

    if (updateError) {
      throw updateError
    }

    console.log(`✅ Товар ${id} оновлено в Supabase`)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 500 }
    )
  }
}
