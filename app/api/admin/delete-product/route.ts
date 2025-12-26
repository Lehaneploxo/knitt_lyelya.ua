import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    await client.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
