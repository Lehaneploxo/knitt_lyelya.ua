import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, name_ua, name_en, price, description_ua, description_en, category, inStock } = data

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Оновлюємо товар в Sanity
    const updates: any = {}
    if (name_ua !== undefined) updates.name_ua = name_ua
    if (name_en !== undefined) updates.name_en = name_en
    if (price !== undefined) updates.price = price
    if (description_ua !== undefined) updates.description_ua = description_ua
    if (description_en !== undefined) updates.description_en = description_en
    if (category !== undefined) updates.category = category
    if (inStock !== undefined) updates.inStock = inStock

    await writeClient
      .patch(id)
      .set(updates)
      .commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}
