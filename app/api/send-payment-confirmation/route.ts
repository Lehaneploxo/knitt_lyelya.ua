import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const {
      customerEmail,
      customerName,
      orderNumber,
      totalAmount,
      items,
      deliveryMethod,
      deliveryAddress
    } = await request.json()

    const gmailUser = process.env.GMAIL_USER
    const gmailPassword = process.env.GMAIL_APP_PASSWORD

    if (!gmailUser || !gmailPassword) {
      console.error('Gmail credentials не налаштовано')
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
      return `<li style="padding: 10px 0; border-bottom: 1px solid #eee;">${name} - ${item.quantity} шт. × ${item.price} грн = ${item.quantity * item.price} грн</li>`
    }).join('')

    const deliveryMethodText = deliveryMethod === 'meest' ? 'Meest' : 'Нова Пошта'

    // Відправка email клієнту
    const result = await transporter.sendMail({
      from: `"knitt_lyelya.ua" <${gmailUser}>`,
      to: customerEmail,
      subject: `✅ Оплата підтверджена - Замовлення #${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #28a745; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">✅ Оплата успішна!</h1>
            <p style="color: white; margin: 5px 0 0 0;">knitt_lyelya.ua</p>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333; margin-top: 0;">Дякуємо за замовлення, ${customerName}!</h2>

            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #155724; font-size: 16px;">
                <strong>Ваш платіж успішно оброблено!</strong><br>
                Номер замовлення: <strong>#${orderNumber}</strong><br>
                Сума оплати: <strong>${totalAmount} грн</strong>
              </p>
            </div>

            <h3 style="color: #D4A574; border-bottom: 2px solid #D4A574; padding-bottom: 10px; margin-top: 30px;">Деталі замовлення</h3>
            <ul style="list-style: none; padding: 0;">
              ${itemsList}
            </ul>
            <p style="font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; color: #28a745;">
              Загальна сума: ${totalAmount} грн
            </p>

            <h3 style="color: #D4A574; border-bottom: 2px solid #D4A574; padding-bottom: 10px; margin-top: 30px;">Доставка</h3>
            <p><strong>Спосіб доставки:</strong> ${deliveryMethodText}</p>
            <p><strong>Адреса:</strong> ${deliveryAddress}</p>

            <div style="margin-top: 40px; padding: 20px; background-color: #f0f0f0; border-radius: 8px;">
              <h3 style="color: #D4A574; margin-top: 0;">Що далі?</h3>
              <p style="margin: 5px 0; color: #666;">
                ✓ Ми отримали ваше замовлення<br>
                ✓ Ваш платіж підтверджено<br>
                ✓ Ми обробимо замовлення найближчим часом<br>
                ✓ Ви отримаєте SMS з номером для відстеження
              </p>
            </div>

            <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 8px;">
              <p style="margin: 0; color: #856404;">
                📞 Якщо у вас є запитання, зв'яжіться з нами:<br>
                <a href="tel:+380954440531" style="color: #D4A574; font-weight: bold;">+38095 444 0531</a><br>
                <span style="font-size: 14px;">
                  <a href="https://t.me/+380954440531" style="color: #0088cc; text-decoration: none;">Telegram</a> ·
                  <a href="https://wa.me/380954440531" style="color: #25D366; text-decoration: none;">WhatsApp</a>
                </span>
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2025 knitt_lyelya.ua - Авторські сумки ручної роботи</p>
            <p>Це автоматичний лист. Будь ласка, не відповідайте на нього.</p>
          </div>
        </div>
      `,
    })

    console.log('Email підтвердження оплати відправлено клієнту:', result.messageId)

    return NextResponse.json({ success: true, messageId: result.messageId })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
