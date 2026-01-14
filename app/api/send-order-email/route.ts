import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    console.log('[Email API] Received email send request')
    const { to, orderNumber, customerName, customerEmail, customerPhone, totalAmount, items, deliveryMethod, deliveryAddress, paymentMethod } = await request.json()

    console.log('[Email API] Sending to:', to)
    console.log('[Email API] Order number:', orderNumber)

    const gmailUser = process.env.GMAIL_USER
    const gmailPassword = process.env.GMAIL_APP_PASSWORD

    console.log('[Email API] Gmail user:', gmailUser ? `${gmailUser.substring(0, 5)}***` : 'NOT SET')
    console.log('[Email API] Gmail password:', gmailPassword ? 'SET' : 'NOT SET')

    if (!gmailUser || !gmailPassword) {
      console.error('[Email API] Gmail credentials не налаштовано')
      return NextResponse.json({ success: false, error: 'Email service not configured' }, { status: 500 })
    }

    // Створення транспортера для Gmail
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

    console.log('[Email API] Attempting to send email...')

    // Відправка email
    const result = await transporter.sendMail({
      from: `"knitt_lyelya.ua" <${gmailUser}>`,
      to: to,
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

    console.log('[Email API] Email відправлено успішно! Message ID:', result.messageId)

    return NextResponse.json({ success: true, messageId: result.messageId })
  } catch (error) {
    console.error('[Email API] Email error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
