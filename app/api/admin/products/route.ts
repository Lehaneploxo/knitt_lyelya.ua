import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/sanity'
import { getAllProducts } from '@/lib/products'

export async function GET() {
  try {
    // Спочатку пробуємо читати з Sanity
    try {
      const sanityProducts = await getProducts()
      if (sanityProducts && sanityProducts.length > 0) {
        return NextResponse.json({ success: true, products: sanityProducts })
      }
    } catch (sanityError) {
      console.log('Sanity unavailable, fallback to JSON')
    }

    // Якщо в Sanity немає товарів, читаємо з JSON
    const jsonProducts = getAllProducts()
    const formattedProducts = jsonProducts.map(p => ({
      _id: p.id,
      name_ua: p.name.ua,
      name_en: p.name.en,
      price: p.price,
      description_ua: p.description.ua,
      description_en: p.description.en,
      category: p.category,
      inStock: p.inStock,
      images: p.images,
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
