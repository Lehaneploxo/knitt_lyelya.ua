import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nameUa, nameEn, price } = body

    // Створюємо slug з англійської назви
    const slug = nameEn.toLowerCase().replace(/\s+/g, '-')

    // Створюємо документ в Sanity
    const result = await client.create({
      _type: 'product',
      name_ua: nameUa,
      name_en: nameEn,
      slug: {
        _type: 'slug',
        current: slug,
      },
      price: parseFloat(price),
      inStock: true,
      isNew: true,
      isBestseller: false,
    })

    return NextResponse.json({ success: true, product: result })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
