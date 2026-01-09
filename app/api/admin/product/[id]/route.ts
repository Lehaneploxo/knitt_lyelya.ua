import { NextRequest, NextResponse } from 'next/server'
import { getProductById } from '@/lib/products'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const product = getProductById(productId)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Конвертуємо формат для адмін-панелі
    const formattedProduct = {
      _id: product.id,
      name_ua: product.name.ua,
      name_en: product.name.en,
      price: product.price,
      description_ua: product.description.ua,
      description_en: product.description.en,
      category: product.category,
      inStock: product.inStock
    }

    return NextResponse.json({ success: true, product: formattedProduct })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
