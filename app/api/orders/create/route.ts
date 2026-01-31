import { NextRequest, NextResponse } from 'next/server'
import { createOrder, type OrderItem, supabaseAdmin } from '@/lib/supabase'
import nodemailer from 'nodemailer'

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

    // Відправка email напряму через nodemailer (без fetch)
    try {
      const notificationEmail = process.env.NOTIFICATION_EMAIL || 'knitt.lyelya531@gmail.com'
      const gmailUser = process.env.GMAIL_USER
      const gmailPassword = process.env.GMAIL_APP_PASSWORD

      console.log('[Orders API] Sending email directly to:', notificationEmail)
      console.log('[Orders API] Gmail user:', gmailUser ? `${gmailUser.substring(0, 5)}***` : 'NOT SET')
      console.log('[Orders API] Gmail password:', gmailPassword ? 'SET' : 'NOT SET')

      if (!gmailUser || !gmailPassword) {
        console.error('[Orders API] Gmail credentials not configured')
      } else {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailPassword,
          },
        })

        // Формуємо список товарів
        const itemsList = items.map((item: any) => {
          const name = typeof item.name === 'object' ? item.name.ua : item.name
          const sku = item.id || item.sku || 'N/A'
          const image = item.image || ''

          return `
            <li style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 15px;">
                ${image ? `<img src="${image}" alt="${name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;" />` : ''}
                <div style="flex: 1;">
                  <p style="margin: 0; font-weight: bold; font-size: 16px; color: #333;">${name}</p>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Артикул: ${sku}</p>
                  <p style="margin: 5px 0 0 0; color: #D4A574; font-size: 14px;">
                    ${item.quantity} шт. × ${item.price} грн = <strong>${item.quantity * item.price} грн</strong>
                  </p>
                </div>
              </div>
            </li>
          `
        }).join('')

        const paymentMethodText = paymentMethod === 'card_online' ? 'Картою онлайн (Monobank)' : 'Оплата при отриманні'

        // Формуємо блок коментаря
        const notesBlock = notes && notes.trim() ? `
          <h3 style="color: #D4A574; border-bottom: 2px solid #D4A574; padding-bottom: 10px; margin-top: 30px;">Коментар до замовлення</h3>
          <p style="background-color: #fff8e1; padding: 15px; border-radius: 8px; border-left: 4px solid #D4A574;">${notes}</p>
        ` : ''

        console.log('[Orders API] Notes value:', notes)
        console.log('[Orders API] Notes block:', notesBlock ? 'ADDED' : 'EMPTY')

        const result = await transporter.sendMail({
          from: `"knitt_lyelya.ua" <${gmailUser}>`,
          to: notificationEmail,
          subject: `🛍️ Нове замовлення #${orderNumber}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
              <div style="background-color: #D4A574; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">knitt_lyelya.ua</h1>
                <p style="color: white; margin: 5px 0 0 0;">Нове замовлення</p>
              </div>

              <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
                <h2 style="color: #333; margin-top: 0;">Замовлення #${orderNumber}</h2>

                <h3 style="color: #D4A574; border-bottom: 2px solid #D4A574; padding-bottom: 10px;">Інформація про покупця</h3>
                <p><strong>Ім'я:</strong> ${customerName}</p>
                <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
                <p><strong>Телефон:</strong> <a href="tel:${customerPhone}">${customerPhone}</a></p>

                <h3 style="color: #D4A574; border-bottom: 2px solid #D4A574; padding-bottom: 10px; margin-top: 30px;">Товари</h3>
                <ul style="list-style: none; padding: 0;">
                  ${itemsList}
                </ul>
                <p style="font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px;">
                  Загальна сума: ${totalAmount} грн
                </p>

                <h3 style="color: #D4A574; border-bottom: 2px solid #D4A574; padding-bottom: 10px; margin-top: 30px;">Доставка</h3>
                <p><strong>Спосіб доставки:</strong> ${deliveryMethod === 'meest' ? 'Meest' : 'Нова Пошта'}</p>
                <p><strong>Адреса:</strong> ${deliveryAddress}</p>

                <h3 style="color: #D4A574; border-bottom: 2px solid #D4A574; padding-bottom: 10px; margin-top: 30px;">Оплата</h3>
                <p><strong>Спосіб оплати:</strong> ${paymentMethodText}</p>

                ${notesBlock}

                <div style="margin-top: 40px; padding: 20px; background-color: #f0f0f0; border-radius: 8px; text-align: center;">
                  <p style="margin: 0; color: #666;">
                    Перевірте замовлення в
                    <a href="https://www.knittlyelyaua.com/studio" style="color: #D4A574; text-decoration: none; font-weight: bold;">
                      Sanity Studio
                    </a>
                  </p>
                </div>
              </div>

              <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                <p>© 2025 knitt_lyelya.ua - Авторські сумки ручної роботи</p>
              </div>
            </div>
          `,
        })

        console.log('[Orders API] Email sent successfully! Message ID:', result.messageId)
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
