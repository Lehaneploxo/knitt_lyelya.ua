import { NextRequest, NextResponse } from 'next/server'
import { writeClient, getSettings } from '@/lib/sanity'

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
    const orderNumber = generateOrderNumber()

    // Визначення статусу оплати
    let paymentStatus = 'not_paid'
    if (paymentMethod === 'card_online') {
      paymentStatus = 'not_paid' // Буде змінено на 'paid' після успішної оплати через webhook
    } else if (paymentMethod === 'cash_on_delivery') {
      paymentStatus = 'not_paid' // Наложений платіж
    }

    // Створення замовлення в Sanity
    console.log('[Orders API] Creating order in Sanity, orderNumber:', orderNumber)
    const order = await writeClient.create({
      _type: 'order',
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      items: items.map((item: any) => {
        // Обробка name - якщо об'єкт, беремо українську версію, інакше як є
        const itemName = typeof item.name === 'object' && item.name !== null
          ? (item.name.ua || item.name.en || JSON.stringify(item.name))
          : String(item.name || 'Товар без назви')

        return {
          _type: 'object',
          productId: item.id || '',
          name: itemName,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
        }
      }),
      totalAmount: Number(totalAmount) || 0,
      paymentStatus,
      deliveryMethod: deliveryMethod || '',
      deliveryAddress: deliveryAddress || '',
      orderDate: new Date().toISOString(),
      notes: notes || '',
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

    console.log('[Orders API] Order created successfully:', order._id)

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
