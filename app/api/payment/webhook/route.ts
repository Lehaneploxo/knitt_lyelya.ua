import { NextRequest, NextResponse } from 'next/server'
import { getOrderByNumber, updateOrderPaymentStatus } from '@/lib/supabase'
import crypto from 'crypto'

// Функція для верифікації підпису webhook (якщо Monobank надає підпис)
function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  const hash = crypto.createHmac('sha256', secret).update(body).digest('base64')
  return hash === signature
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const webhookData = JSON.parse(body)

    console.log('Received webhook from Monobank:', webhookData)

    // Верифікація підпису (опціонально, якщо Monobank надає)
    // const signature = request.headers.get('x-sign')
    // if (signature && !verifyWebhookSignature(body, signature, process.env.MONOBANK_TOKEN!)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    const { invoiceId, status, amount, ccy, reference } = webhookData

    if (!invoiceId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Оновлення статусу платежу в Supabase
    if (reference) {
      // Reference - це orderNumber з нашої системи
      const orderNumber = reference

      // Визначаємо новий статус оплати
      let paymentStatus = 'not_paid'
      if (status === 'success') {
        paymentStatus = 'paid'
      } else if (status === 'failure') {
        paymentStatus = 'failed'
      } else if (status === 'processing') {
        paymentStatus = 'processing'
      }

      try {
        // Знаходимо та оновлюємо замовлення
        const order = await getOrderByNumber(orderNumber)

        if (order) {
          // Оновлюємо статус оплати
          await updateOrderPaymentStatus(orderNumber, paymentStatus)

          console.log(`Order ${orderNumber} payment status updated to ${paymentStatus}`)

          // Відправка email клієнту після успішної оплати
          if (status === 'success' && order.customer_email) {
            try {
              const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.knittlyelyaua.com'

              await fetch(`${baseUrl}/api/send-payment-confirmation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  customerEmail: order.customer_email,
                  customerName: order.customer_name,
                  orderNumber: order.order_number,
                  totalAmount: order.total_amount,
                  items: order.items,
                  deliveryMethod: order.delivery_method,
                  deliveryAddress: order.delivery_address,
                }),
              })

              console.log(`Payment confirmation email sent to ${order.customer_email}`)
            } catch (emailError) {
              console.error('Failed to send payment confirmation email:', emailError)
              // Не блокуємо обробку webhook через помилку email
            }
          }
        } else {
          console.error(`Order ${orderNumber} not found`)
        }
      } catch (orderError) {
        console.error('Failed to update order:', orderError)
      }
    }

    // Логуємо webhook для відлагодження
    console.log('Webhook processed successfully:', { invoiceId, status, reference })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Дозволяємо GET запити для тестування
export async function GET() {
  return NextResponse.json({
    message: 'Monobank webhook endpoint is active',
    timestamp: new Date().toISOString(),
  })
}
