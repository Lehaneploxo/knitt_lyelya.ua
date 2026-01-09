import { NextRequest, NextResponse } from 'next/server'

// Використовуємо простий файловий підхід для налаштувань
const DEFAULT_CREDENTIALS = {
  login: 'admin',
  password: 'admin123',
  email: 'admin@example.com'
}

// В production можна зберігати в базі даних або environment variables
function getStoredCredentials() {
  // Тут можна додати логіку читання з файлу або БД
  // Поки використовуємо дефолтні + можливість зміни через API
  if (typeof global !== 'undefined' && (global as any).adminCredentials) {
    return (global as any).adminCredentials
  }
  return DEFAULT_CREDENTIALS
}

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json()

    const credentials = getStoredCredentials()

    // Перевірка логіну та паролю
    if (login === credentials.login && password === credentials.password) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: 'Невірний логін або пароль' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Помилка автентифікації' },
      { status: 500 }
    )
  }
}
