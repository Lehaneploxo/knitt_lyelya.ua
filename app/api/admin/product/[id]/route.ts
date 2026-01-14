import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    // Читаємо товар з Sanity по _id
    const product = await client.fetch(
      `*[_type == "product" && _id == $id][0] {
        _id,
        name_ua,
        name_en,
        price,
        description_ua,
        description_en,
        category,
        inStock,
        sku,
        images
      }`,
      { id: productId }
    )

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
