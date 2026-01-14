import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

    // Видаляємо товар з Supabase
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      // Якщо товару немає в Supabase - все одно повертаємо успіх
      if (error.code === 'PGRST116') {
        console.log(`Товар ${id} не в Supabase`)
        return NextResponse.json({ success: true })
      }
      throw error
    }

    console.log(`✅ Товар ${id} видалено з Supabase`)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}
