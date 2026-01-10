import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nameUa,
      nameEn,
      sku,
      price,
      discount,
      category,
      descriptionUa,
      descriptionEn,
      imageUrls,
      materials,
      colors,
      height,
      width,
      depth,
      inStock,
      isNew,
      isBestseller,
    } = body

    // Створюємо slug з англійської назви
    const slug = nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Створюємо image references з URL (для простоти зберігаємо як URL)
    // В реальному випадку треба завантажувати через Sanity API
    const imageAssets = imageUrls && imageUrls.length > 0
      ? await Promise.all(imageUrls.map(async (url: string) => {
          if (!url) return null
          try {
            // Створюємо тимчасове посилання на зображення
            return {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: url // Тимчасово зберігаємо URL
              }
            }
          } catch {
            return null
          }
        }))
      : []

    const dimensions = (height || width || depth) ? {
      height: height ? parseFloat(height) : undefined,
      width: width ? parseFloat(width) : undefined,
      depth: depth ? parseFloat(depth) : undefined,
    } : undefined

    // Створюємо документ в Sanity
    const result = await writeClient.create({
      _type: 'product',
      name_ua: nameUa,
      name_en: nameEn,
      slug: {
        _type: 'slug',
        current: slug,
      },
      sku,
      price: parseFloat(price),
      discount: discount ? parseFloat(discount) : 0,
      category,
      description_ua: descriptionUa || undefined,
      description_en: descriptionEn || undefined,
      images: imageAssets.filter(Boolean),
      materials: materials || [],
      colors: colors || [],
      dimensions,
      inStock: inStock !== false,
      isNew: isNew === true,
      isBestseller: isBestseller === true,
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
