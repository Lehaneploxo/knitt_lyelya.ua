import { NextResponse } from 'next/server'

// API для автоматичної ініціалізації налаштувань при першому вході
export async function POST() {
  try {
    // Завжди повертаємо дефолтні налаштування
    return NextResponse.json({
      success: true,
      message: 'Using default settings',
      needsInit: false,
      credentials: {
        login: 'admin',
        password: 'admin123',
      },
    })
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initialize' },
      { status: 500 }
    )
  }
}
