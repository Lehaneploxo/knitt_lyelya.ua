import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { notificationEmail, adminLogin, adminPassword } = await request.json()

    if (!notificationEmail || !adminLogin || !adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Всі поля обов\'язкові' },
        { status: 400 }
      )
    }

    if (adminPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Пароль має містити мінімум 6 символів' },
        { status: 400 }
      )
    }

    // Зберігаємо в global (в production можна використовувати БД або файл)
    if (typeof global !== 'undefined') {
      (global as any).adminCredentials = {
        email: notificationEmail,
        login: adminLogin,
        password: adminPassword,
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
