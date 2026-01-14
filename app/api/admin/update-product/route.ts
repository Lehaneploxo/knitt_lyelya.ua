import { NextRequest, NextResponse } from 'next/server'
import { writeClient, client } from '@/lib/sanity'
import { getProductById } from '@/lib/products'

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

    // Перевіряємо чи є товар в Sanity
    const existingProduct = await client.fetch(
      '*[_type == "product" && _id == $id][0]',
      { id }
    )

    // Якщо товару немає в Sanity - створюємо його спочатку
    if (!existingProduct) {
      console.log(`Товар ${id} не знайдено в Sanity, створюю...`)

      // Читаємо товар з JSON
      const jsonProduct = getProductById(id)
      if (!jsonProduct) {
        return NextResponse.json(
          { success: false, error: 'Product not found in JSON' },
          { status: 404 }
        )
      }

      // Створюємо slug
      const slug = (name_en || jsonProduct.name.en)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')

      // Створюємо товар в Sanity з усіма даними
      await writeClient.create({
        _type: 'product',
        _id: id,
        name_ua: name_ua || jsonProduct.name.ua,
        name_en: name_en || jsonProduct.name.en,
        slug: {
          _type: 'slug',
          current: slug,
        },
        sku: jsonProduct.sku || id,
        price: price || jsonProduct.price,
        discount: 0,
        category: category || jsonProduct.category,
        description_ua: description_ua || jsonProduct.description?.ua || '',
        description_en: description_en || jsonProduct.description?.en || '',
        materials: jsonProduct.materials || [],
        colors: jsonProduct.colors || [],
        dimensions: jsonProduct.dimensions ? {
          height: jsonProduct.dimensions.height,
          width: jsonProduct.dimensions.width,
          depth: jsonProduct.dimensions.depth,
        } : undefined,
        inStock: inStock !== undefined ? inStock : jsonProduct.inStock !== false,
        isNew: jsonProduct.new === true,
        isBestseller: jsonProduct.featured === true,
        images: [],
      })

      console.log(`✅ Товар ${id} створено в Sanity`)
      return NextResponse.json({ success: true, created: true })
    }

    // Якщо товар вже є - просто оновлюємо
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

    console.log(`✅ Товар ${id} оновлено в Sanity`)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 500 }
    )
  }
}
