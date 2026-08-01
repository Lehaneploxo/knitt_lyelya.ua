import { NextRequest, NextResponse } from 'next/server'
import { getOrderByNumber, updateOrderPaymentStatus } from '@/lib/supabase'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

// Публічний ключ Monobank кешується в пам'яті процесу (він не змінюється на льоту)
let cachedPublicKeyPem: string | null = null

async function getMonobankPublicKeyPem(): Promise<string> {
  if (cachedPublicKeyPem) return cachedPublicKeyPem

  const token = process.env.MONOBANK_TOKEN
  if (!token) {
    throw new Error('MONOBANK_TOKEN is not configured')
  }

  const res = await fetch('https://api.monobank.ua/api/merchant/pubkey', {
    headers: { 'X-Token': token },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch Monobank public key: ${res.status}`)
  }

  const data = await res.json()
  const keyLines = (data.key as string).match(/.{1,64}/g) || []
  cachedPublicKeyPem = `-----BEGIN PUBLIC KEY-----\n${keyLines.join('\n')}\n-----END PUBLIC KEY-----\n`
  return cachedPublicKeyPem
}

// Перевірка підпису webhook офіційним публічним ключем Monobank (ECDSA)
async function verifyWebhookSignature(rawBody: string, signatureBase64: string): Promise<boolean> {
  try {
    const publicKey = await getMonobankPublicKeyPem()
    const verifier = crypto.createVerify('SHA256')
    verifier.update(rawBody)
    verifier.end()
    return verifier.verify(publicKey, signatureBase64, 'base64')
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    // Обов'язкова перевірка підпису - без неї будь-хто може підробити webhook
    // і позначити неоплачене замовлення як оплачене
    const signature = request.headers.get('x-sign')
    if (!signature || !(await verifyWebhookSignature(body, signature))) {
      console.error('Rejected webhook: invalid or missing signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const webhookData = JSON.parse(body)

    console.log('Received webhook from Monobank:', webhookData)

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
          // Перевіряємо, що webhook стосується саме того рахунку,
          // який ми самі створили для цього замовлення
          if (!order.invoice_id || order.invoice_id !== invoiceId) {
            console.error(`Invoice mismatch for order ${orderNumber}: expected ${order.invoice_id}, got ${invoiceId}`)
            return NextResponse.json({ error: 'Invoice mismatch' }, { status: 400 })
          }

          // Перевіряємо суму та валюту, щоб виключити оплату "не тієї" суми
          const expectedAmount = Math.round(Number(order.total_amount) * 100)
          if (status === 'success' && (amount !== expectedAmount || ccy !== 980)) {
            console.error(`Amount mismatch for order ${orderNumber}: expected ${expectedAmount}/980, got ${amount}/${ccy}`)
            return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
          }

          // Оновлюємо статус оплати
          await updateOrderPaymentStatus(orderNumber, paymentStatus)

          console.log(`Order ${orderNumber} payment status updated to ${paymentStatus}`)

          // Відправка email клієнту після успішної оплати напряму через nodemailer
          if (status === 'success' && order.customer_email) {
            try {
              const gmailUser = process.env.GMAIL_USER
              const gmailPassword = process.env.GMAIL_APP_PASSWORD

              if (gmailUser && gmailPassword) {
                const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: gmailUser,
                    pass: gmailPassword,
                  },
                })

                // Формуємо список товарів
                const itemsList = (order.items || []).map((item: any) => {
                  const name = typeof item.name === 'object' ? item.name.ua : item.name
                  return `
                    <tr>
                      <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
                      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price} грн</td>
                    </tr>
                  `
                }).join('')

                await transporter.sendMail({
                  from: `"knitt_lyelya.ua" <${gmailUser}>`,
                  to: order.customer_email,
                  subject: `✅ Оплата підтверджена - Замовлення #${order.order_number}`,
                  html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                      <div style="background-color: #4CAF50; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="color: white; margin: 0;">Оплату отримано!</h1>
                      </div>
                      <div style="background-color: white; padding: 30px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
                        <p>Шановний(а) <strong>${order.customer_name}</strong>,</p>
                        <p>Дякуємо за оплату! Ваше замовлення <strong>#${order.order_number}</strong> успішно оплачено.</p>

                        <h3 style="color: #D4A574; margin-top: 20px;">Деталі замовлення:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                          <thead>
                            <tr style="background-color: #f5f5f5;">
                              <th style="padding: 10px; text-align: left;">Товар</th>
                              <th style="padding: 10px; text-align: center;">К-сть</th>
                              <th style="padding: 10px; text-align: right;">Ціна</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${itemsList}
                          </tbody>
                        </table>
                        <p style="font-size: 18px; font-weight: bold; text-align: right; margin-top: 15px;">
                          Всього: ${order.total_amount} грн
                        </p>

                        <h3 style="color: #D4A574; margin-top: 20px;">Доставка:</h3>
                        <p><strong>Спосіб:</strong> ${order.delivery_method === 'meest' ? 'Meest' : 'Нова Пошта'}</p>
                        <p><strong>Адреса:</strong> ${order.delivery_address}</p>

                        ${order.notes ? `
                        <h3 style="color: #D4A574; margin-top: 20px;">Ваш коментар:</h3>
                        <p style="background-color: #fff8e1; padding: 15px; border-radius: 8px; border-left: 4px solid #D4A574;">${order.notes}</p>
                        ` : ''}

                        <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                          <h4 style="margin-top: 0; color: #333;">Що далі?</h4>
                          <p style="margin-bottom: 0;">Ми підготуємо ваше замовлення та відправимо найближчим часом. Ви отримаєте ТТН для відстеження.</p>
                        </div>

                        <p style="margin-top: 30px; color: #666;">
                          З питаннями звертайтесь:<br>
                          📱 Телефон: +380 (XX) XXX-XX-XX<br>
                          💬 Telegram / WhatsApp
                        </p>
                      </div>
                      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                        <p>© 2025 knitt_lyelya.ua</p>
                      </div>
                    </div>
                  `,
                })

                console.log(`Payment confirmation email sent directly to ${order.customer_email}`)
              } else {
                console.error('Gmail credentials not configured for payment confirmation email')
              }
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
