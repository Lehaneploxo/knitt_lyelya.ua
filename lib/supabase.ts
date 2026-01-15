import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

// Публічний клієнт (для читання)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Серверний клієнт (для запису) - тільки для API routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Типи для замовлення
export interface Order {
  id?: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  items: OrderItem[]
  total_amount: number
  payment_method: string
  payment_status: string
  delivery_method: string
  delivery_address: string
  notes?: string
  order_date?: string
  created_at?: string
  updated_at?: string
}

export interface OrderItem {
  id: string
  name: { ua: string; en?: string }
  quantity: number
  price: number
  image?: string
}

// Функції для роботи з замовленнями
export async function createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert([orderData])
    .select()
    .single()

  if (error) {
    console.error('Помилка створення замовлення:', error)
    throw error
  }

  return data
}

export async function getOrderByNumber(orderNumber: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single()

  if (error) {
    console.error('Помилка отримання замовлення:', error)
    throw error
  }

  return data
}

export async function updateOrderPaymentStatus(orderNumber: string, status: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ payment_status: status })
    .eq('order_number', orderNumber)
    .select()
    .single()

  if (error) {
    console.error('Помилка оновлення статусу оплати:', error)
    throw error
  }

  return data
}

export async function getAllOrders() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Помилка отримання замовлень:', error)
    throw error
  }

  return data
}

// Типи для товару
export interface Product {
  id: string
  name: { ua: string; en: string }
  price: number
  description: { ua: string; en: string }
  category: string
  inStock: boolean
  sku: string
  images: string[]
  materials?: string[]
  colors?: string[]
  dimensions?: { height?: number; width?: number; depth?: number }
  isNew?: boolean
  isBestseller?: boolean
}

// Функції для роботи з товарами (публічний доступ)
export async function getProductsFromSupabase(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Помилка отримання товарів:', error)
    return []
  }

  // Форматуємо дані для фронтенду
  return (data || []).map(p => ({
    id: p.id,
    name: { ua: p.name_ua, en: p.name_en },
    price: p.price,
    description: { ua: p.description_ua || '', en: p.description_en || '' },
    category: p.category,
    inStock: p.in_stock,
    sku: p.sku,
    images: p.images || [],
    materials: p.materials || [],
    colors: p.colors || [],
    dimensions: p.dimensions,
    isNew: p.is_new,
    isBestseller: p.is_bestseller
  }))
}

export async function getProductsByCategoryFromSupabase(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Помилка отримання товарів:', error)
    return []
  }

  return (data || []).map(p => ({
    id: p.id,
    name: { ua: p.name_ua, en: p.name_en },
    price: p.price,
    description: { ua: p.description_ua || '', en: p.description_en || '' },
    category: p.category,
    inStock: p.in_stock,
    sku: p.sku,
    images: p.images || [],
    materials: p.materials || [],
    colors: p.colors || [],
    dimensions: p.dimensions,
    isNew: p.is_new,
    isBestseller: p.is_bestseller
  }))
}

export async function getProductByIdFromSupabase(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Помилка отримання товару:', error)
    return null
  }

  return {
    id: data.id,
    name: { ua: data.name_ua, en: data.name_en },
    price: data.price,
    description: { ua: data.description_ua || '', en: data.description_en || '' },
    category: data.category,
    inStock: data.in_stock,
    sku: data.sku,
    images: data.images || [],
    materials: data.materials || [],
    colors: data.colors || [],
    dimensions: data.dimensions,
    isNew: data.is_new,
    isBestseller: data.is_bestseller
  }
}
