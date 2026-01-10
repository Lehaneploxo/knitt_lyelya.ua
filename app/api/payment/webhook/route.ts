import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/lib/sanity'
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

    // Оновлення статусу платежу в Sanity
    if (reference) {
      // Reference - це orderId з нашої системи
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

      // Знаходимо замовлення за номером
      const orders = await client.fetch(
        `*[_type == "order" && orderNumber == $orderNumber][0]`,
        { orderNumber }
      )

      if (orders) {
        // Оновлюємо статус оплати
        await writeClient
          .patch(orders._id)
          .set({
            paymentStatus,
            monobankInvoiceId: invoiceId,
            monobankStatus: status,
            paymentAmount: amount ? amount / 100 : undefined,
            paymentCurrency: ccy === 980 ? 'UAH' : String(ccy),
            paymentDate: status === 'success' ? new Date().toISOString() : undefined,
          })
          .commit()

        console.log(`Order ${orderNumber} payment status updated to ${paymentStatus}`)

        // Відправка email клієнту після успішної оплати
        if (status === 'success' && orders.customerEmail) {
          try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.knittlyelyaua.com'

            await fetch(`${baseUrl}/api/send-payment-confirmation`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customerEmail: orders.customerEmail,
                customerName: orders.customerName,
                orderNumber: orders.orderNumber,
                totalAmount: orders.totalAmount,
                items: orders.items,
                deliveryMethod: orders.deliveryMethod,
                deliveryAddress: orders.deliveryAddress,
              }),
            })

            console.log(`Payment confirmation email sent to ${orders.customerEmail}`)
          } catch (emailError) {
            console.error('Failed to send payment confirmation email:', emailError)
            // Не блокуємо обробку webhook через помилку email
          }
        }
      }
    }

    // Зберігаємо webhook лог для відлагодження
    await writeClient.create({
      _type: 'paymentWebhook',
      invoiceId,
      status,
      amount: amount ? amount / 100 : null,
      currency: ccy === 980 ? 'UAH' : String(ccy),
      reference,
      receivedAt: new Date().toISOString(),
      rawData: webhookData,
    })

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
