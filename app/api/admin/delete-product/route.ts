import { NextRequest, NextResponse } from 'next/server'
import { writeClient, client } from '@/lib/sanity'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Перевіряємо чи є товар в Sanity
    const existingProduct = await client.fetch(
      '*[_type == "product" && _id == $id][0]',
      { id }
    )

    // Якщо товару немає в Sanity - повертаємо успіх
    // (товар показується з JSON, але видалити його там не можна на Vercel)
    if (!existingProduct) {
      console.log(`Товар ${id} не в Sanity, пропускаю видалення`)
      return NextResponse.json({
        success: true,
        message: 'Product not in Sanity, cannot delete from JSON on Vercel'
      })
    }

    // Видаляємо товар з Sanity
    await writeClient.delete(id)
    console.log(`✅ Товар ${id} видалено з Sanity`)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}
