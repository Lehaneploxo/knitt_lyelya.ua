import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAllProducts, getProductsByCategory } from '@/lib/products'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  try {
    // Пробуємо читати з Supabase
    let query = supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (!error && data && data.length > 0) {
      const products = data.map(p => ({
        id: p.id,
        name: { ua: p.name_ua, en: p.name_en },
        price: p.price,
        description: { ua: p.description_ua || '', en: p.description_en || '' },
        category: p.category,
        inStock: p.in_stock,
        sku: p.sku,
        images: p.images || [],
        materials: p.materials || [],
        colors: p.colors || [],
        dimensions: p.dimensions,
        isNew: p.is_new,
        isBestseller: p.is_bestseller
      }))
      return NextResponse.json({ success: true, products })
    }

    // Fallback до JSON
    console.log('Supabase порожній, fallback до JSON')
    const jsonProducts = category
      ? getProductsByCategory(category)
      : getAllProducts()

    return NextResponse.json({ success: true, products: jsonProducts })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
