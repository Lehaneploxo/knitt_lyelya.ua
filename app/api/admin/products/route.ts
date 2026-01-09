import { NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/products'

export async function GET() {
  try {
    const products = getAllProducts()
    // Конвертуємо формат для адмін-панелі
    const formattedProducts = products.map(p => ({
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
