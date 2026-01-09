import { NextResponse } from 'next/server'
import { getHomePage } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'

export async function GET() {
  try {
    const homePage = await getHomePage()

    if (!homePage) {
      return NextResponse.json({ success: true, homePage: null })
    }

    // Генеруємо URL для зображень
    const response = {
      ...homePage,
      banner1: homePage.banner1 ? urlFor(homePage.banner1).url() : null,
      banner2: homePage.banner2 ? urlFor(homePage.banner2).url() : null,
    }

    return NextResponse.json({ success: true, homePage: response })
  } catch (error) {
    console.error('Error fetching home page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch home page' },
      { status: 500 }
    )
  }
}
