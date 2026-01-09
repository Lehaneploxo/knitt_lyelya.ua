import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    // Читаємо JSON файл
    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileData = fs.readFileSync(filePath, 'utf-8')
    const products = JSON.parse(fileData)

    // Фільтруємо товар
    const filteredProducts = products.filter((p: any) => p.id !== id)

    if (filteredProducts.length === products.length) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Зберігаємо назад у файл
    fs.writeFileSync(filePath, JSON.stringify(filteredProducts, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
