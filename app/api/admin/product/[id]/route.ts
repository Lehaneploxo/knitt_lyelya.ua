import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'
import { getProductById } from '@/lib/products'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    // Спочатку пробуємо читати з Sanity
    try {
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

      if (product) {
        return NextResponse.json({ success: true, product })
      }
    } catch (sanityError) {
      console.log('Sanity unavailable, fallback to JSON')
    }

    // Fallback до JSON
    const jsonProduct = getProductById(productId)
    if (!jsonProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const formattedProduct = {
      _id: jsonProduct.id,
      name_ua: jsonProduct.name.ua,
      name_en: jsonProduct.name.en,
      price: jsonProduct.price,
      description_ua: jsonProduct.description.ua,
      description_en: jsonProduct.description.en,
      category: jsonProduct.category,
      inStock: jsonProduct.inStock,
      sku: jsonProduct.sku,
      images: jsonProduct.images
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
