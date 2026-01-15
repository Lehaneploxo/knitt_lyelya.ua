import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAllProducts } from '@/lib/products'

export async function GET() {
  try {
    // Читаємо товари з Supabase
    const { data: supabaseProducts, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && supabaseProducts && supabaseProducts.length > 0) {
      // Форматуємо для фронтенду
      const formattedProducts = supabaseProducts.map(p => ({
        _id: p.id,
        name_ua: p.name_ua,
        name_en: p.name_en,
        price: p.price,
        description_ua: p.description_ua,
        description_en: p.description_en,
        category: p.category,
        inStock: p.in_stock,
        images: p.images || [],
        sku: p.sku,
        isNew: p.is_new,
        isBestseller: p.is_bestseller
      }))
      return NextResponse.json({ success: true, products: formattedProducts })
    }

    // Якщо в Supabase немає товарів, читаємо з JSON (fallback)
    console.log('Supabase порожній, fallback до JSON')
    const jsonProducts = getAllProducts()
    const formattedProducts = jsonProducts.map(p => ({
      _id: p.id,
      name_ua: p.name.ua,
      name_en: p.name.en,
      price: p.price,
      description_ua: p.description?.ua || '',
      description_en: p.description?.en || '',
      category: p.category,
      inStock: p.inStock,
      images: p.images || [],
      sku: p.sku
    }))

    return NextResponse.json({ success: true, products: formattedProducts })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
