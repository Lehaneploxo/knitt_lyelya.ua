import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getProductById } from '@/lib/products'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    // Читаємо товар з Supabase
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (!error && product) {
      // Форматуємо для фронтенду
      const formattedProduct = {
        _id: product.id,
        name_ua: product.name_ua,
        name_en: product.name_en,
        price: product.price,
        description_ua: product.description_ua,
        description_en: product.description_en,
        category: product.category,
        inStock: product.in_stock,
        sku: product.sku,
        images: product.images || [],
        materials: product.materials || [],
        colors: product.colors || [],
        dimensions: product.dimensions,
        isNew: product.is_new,
        isBestseller: product.is_bestseller
      }
      return NextResponse.json({ success: true, product: formattedProduct })
    }

    // Fallback до JSON
    console.log('Supabase: товар не знайдено, fallback до JSON')
    const jsonProduct = getProductById(productId)
    if (!jsonProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const formattedProduct = {
      _id: jsonProduct.id,
      name_ua: jsonProduct.name.ua,
      name_en: jsonProduct.name.en,
      price: jsonProduct.price,
      description_ua: jsonProduct.description?.ua || '',
      description_en: jsonProduct.description?.en || '',
      category: jsonProduct.category,
      inStock: jsonProduct.inStock,
      sku: jsonProduct.sku,
      images: jsonProduct.images || []
    }

    return NextResponse.json({ success: true, product: formattedProduct })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
