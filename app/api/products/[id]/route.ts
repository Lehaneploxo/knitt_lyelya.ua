import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getProductById } from '@/lib/products'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Пробуємо читати з Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (!error && data) {
      const product = {
        id: data.id,
        name: { ua: data.name_ua, en: data.name_en },
        price: data.price,
        description: { ua: data.description_ua || '', en: data.description_en || '' },
        category: data.category,
        inStock: data.in_stock,
        sku: data.sku,
        images: data.images || [],
        materials: data.materials || [],
        colors: data.colors || [],
        dimensions: data.dimensions,
        isNew: data.is_new,
        isBestseller: data.is_bestseller
      }
      return NextResponse.json({ success: true, product })
    }

    // Fallback до JSON
    console.log('Товар не в Supabase, fallback до JSON')
    const jsonProduct = getProductById(id)

    if (!jsonProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, product: jsonProduct })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
