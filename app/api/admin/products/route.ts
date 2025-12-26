import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/sanity'

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json({ success: true, products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
