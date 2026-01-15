import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nameUa,
      nameEn,
      sku,
      price,
      category,
      descriptionUa,
      descriptionEn,
      imageUrls,
      materials,
      colors,
      height,
      width,
      depth,
      inStock,
      isNew,
      isBestseller,
    } = body

    // Генеруємо ID з slug
    const id = nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Перевіряємо чи немає товару з таким ID
    const { data: existing } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('id', id)
      .single()

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Товар з такою назвою вже існує' },
        { status: 400 }
      )
    }

    // Формуємо dimensions
    const dimensions = (height || width || depth) ? {
      height: height ? parseFloat(height) : null,
      width: width ? parseFloat(width) : null,
      depth: depth ? parseFloat(depth) : null,
    } : null

    // Створюємо товар в Supabase
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert({
        id,
        name_ua: nameUa,
        name_en: nameEn,
        sku: sku || id,
        price: parseFloat(price),
        category,
        description_ua: descriptionUa || '',
        description_en: descriptionEn || '',
        images: imageUrls?.filter((url: string) => url?.trim()) || [],
        materials: materials || [],
        colors: colors || [],
        dimensions,
        in_stock: inStock !== false,
        is_new: isNew === true,
        is_bestseller: isBestseller === true,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log(`✅ Товар "${nameUa}" створено в Supabase`)
    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}
