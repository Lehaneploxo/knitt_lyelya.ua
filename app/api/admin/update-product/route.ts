import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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

    // Читаємо JSON файл
    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileData = fs.readFileSync(filePath, 'utf-8')
    const products = JSON.parse(fileData)

    // Знаходимо товар
    const productIndex = products.findIndex((p: any) => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Оновлюємо тільки надані поля
    if (name_ua !== undefined) products[productIndex].name.ua = name_ua
    if (name_en !== undefined) products[productIndex].name.en = name_en
    if (price !== undefined) products[productIndex].price = price
    if (description_ua !== undefined) products[productIndex].description.ua = description_ua
    if (description_en !== undefined) products[productIndex].description.en = description_en
    if (category !== undefined) products[productIndex].category = category
    if (inStock !== undefined) products[productIndex].inStock = inStock

    // Зберігаємо назад у файл
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}
