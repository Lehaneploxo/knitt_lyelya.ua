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
