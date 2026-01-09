// Скрипт для створення початкових налаштувань в Sanity

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'alskls9k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skFevW9cg8AArRkqRJZBothK14NbuEa8nAHLIwZUsBql7nzEu3EBXAtsmNXYChIVqKBY6CRkkIFzLHGo8OtMKlAtyoMZRQeYsGxkqfqebYDpiOKAMUaO00Ls2OcyOEMe6Cupdwm6uYb6WyTM3NfbDi6TTmW9uyxny45suJoaEJ16zIuN16Pw',
  useCdn: false,
})

async function createInitialSettings() {
  try {
    // Перевіряємо чи існують налаштування
    const existingSettings = await client.fetch('*[_type == "settings"][0]')

    if (existingSettings) {
      console.log('✓ Налаштування вже існують')
      console.log('  Email:', existingSettings.notificationEmail)
      console.log('  Логін:', existingSettings.adminLogin)
      return
    }

    // Створюємо налаштування
    console.log('Створюємо початкові налаштування...')

    const settings = await client.create({
      _type: 'settings',
      notificationEmail: 'admin@designerbags.ua',
      adminLogin: 'admin',
      adminPassword: 'admin123',
    })

    console.log('✓ Налаштування створено!')
    console.log('  Email для сповіщень:', settings.notificationEmail)
    console.log('  Логін:', settings.adminLogin)
    console.log('  Пароль:', settings.adminPassword)
    console.log('')
    console.log('Тепер ви можете увійти в адмін-панель:')
    console.log('  URL: http://localhost:3000/admin')
    console.log('  Логін: admin')
    console.log('  Пароль: admin123')

  } catch (error) {
    console.error('Помилка:', error.message)
  }
}

createInitialSettings()
