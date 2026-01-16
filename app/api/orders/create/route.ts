import { NextRequest, NextResponse } from 'next/server'
import { createOrder, type OrderItem, supabaseAdmin } from '@/lib/supabase'

// Функція для генерації номера замовлення: 2026-01-16-0001
async function generateOrderNumber() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  // Рахуємо кількість існуючих замовлень
  const { count, error } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact', head: true })

  const orderCount = (count || 0) + 1
  const orderNum = String(orderCount).padStart(4, '0')

  return `${year}-${month}-${day}-${orderNum}`
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Orders API] Received order creation request')
    const orderData = await request.json()
    console.log('[Orders API] Order data:', JSON.stringify(orderData, null, 2))

    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      totalAmount,
      deliveryMethod,
      deliveryAddress,
      paymentMethod,
      notes,
    } = orderData

    // Валідація
    if (!customerName || !customerEmail || !customerPhone || !items || !totalAmount) {
      console.error('[Orders API] Validation failed: missing required fields')
      return NextResponse.json(
        { success: false, error: 'Відсутні обов\'язкові поля' },
        { status: 400 }
      )
    }

    // Генерація номера замовлення
    const orderNumber = await generateOrderNumber()

    // Визначення статусу оплати
    let paymentStatus = 'not_paid'
    if (paymentMethod === 'card_online') {
      paymentStatus = 'not_paid' // Буде змінено на 'paid' після успішної оплати через webhook
    } else if (paymentMethod === 'cash_on_delivery') {
      paymentStatus = 'not_paid' // Наложений платіж
    }

    // Створення замовлення в Supabase
    console.log('[Orders API] Creating order in Supabase, orderNumber:', orderNumber)

    const orderItems: OrderItem[] = items.map((item: any) => ({
      id: item.id || '',
      name: {
        ua: typeof item.name === 'object' && item.name !== null
          ? (item.name.ua || item.name.en || String(item.name))
          : String(item.name || 'Товар без назви'),
        en: typeof item.name === 'object' ? item.name.en : undefined
      },
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
      image: item.image || undefined
    }))

    const order = await createOrder({
      order_number: orderNumber,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      items: orderItems,
      total_amount: Number(totalAmount) || 0,
      payment_method: paymentMethod || 'cash_on_delivery',
      payment_status: paymentStatus,
      delivery_method: deliveryMethod || '',
      delivery_address: deliveryAddress || '',
      notes: notes || '',
      order_date: new Date().toISOString()
    })

    // Відправка email (якщо налаштовано)
    try {
      const notificationEmail = process.env.NOTIFICATION_EMAIL || 'knitt.lyelya531@gmail.com'
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin

      console.log('[Orders API] Sending email to:', notificationEmail)
      console.log('[Orders API] Email API URL:', `${baseUrl}/api/send-order-email`)

      const emailResponse = await fetch(`${baseUrl}/api/send-order-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: notificationEmail,
          orderNumber,
          customerName,
          customerEmail,
          customerPhone,
          totalAmount,
          items,
          deliveryMethod,
          deliveryAddress,
          paymentMethod,
        }),
      })

      const emailResult = await emailResponse.json()
      console.log('[Orders API] Email API response:', emailResult)

      if (!emailResponse.ok) {
        console.error('[Orders API] Email API error:', emailResponse.status, emailResult)
      } else {
        console.log('[Orders API] Email sent successfully!')
      }
    } catch (emailError) {
      console.error('[Orders API] Email sending failed:', emailError)
      // Не блокуємо створення замовлення через помилку email
    }

    console.log('[Orders API] Order created successfully:', order.id)

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: order.id,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Помилка створення замовлення' },
      { status: 500 }
    )
  }
}
