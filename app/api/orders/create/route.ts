import { NextRequest, NextResponse } from 'next/server'
import { client, getSettings } from '@/lib/sanity'

// Функція для генерації номера замовлення
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `${timestamp}${random}`
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

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
      return NextResponse.json(
        { success: false, error: 'Відсутні обов\'язкові поля' },
        { status: 400 }
      )
    }

    // Генерація номера замовлення
    const orderNumber = generateOrderNumber()

    // Визначення статусу оплати
    let paymentStatus = 'not_paid'
    if (paymentMethod === 'online') {
      paymentStatus = 'paid'
    } else if (paymentMethod === 'partial') {
      paymentStatus = 'partial'
    }

    // Створення замовлення в Sanity
    const order = await client.create({
      _type: 'order',
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      items: items.map((item: any) => ({
        _type: 'object',
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      paymentStatus,
      deliveryMethod: deliveryMethod || '',
      deliveryAddress: deliveryAddress || '',
      orderDate: new Date().toISOString(),
      notes: notes || '',
    })

    // Відправка email (якщо налаштовано)
    try {
      const notificationEmail = process.env.NOTIFICATION_EMAIL || 'knitt.lyelya531@gmail.com'

      await fetch(`${request.nextUrl.origin}/api/send-order-email`, {
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
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Не блокуємо створення замовлення через помилку email
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: order._id,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Помилка створення замовлення' },
      { status: 500 }
    )
  }
}
