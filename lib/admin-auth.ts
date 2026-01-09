// Простая система аутентификації без Sanity
// Дані зберігаються локально

export interface AdminSettings {
  email: string
  login: string
  password: string
}

// Дефолтні налаштування
const DEFAULT_SETTINGS: AdminSettings = {
  email: 'admin@example.com',
  login: 'admin',
  password: 'admin123',
}

// Отримати налаштування (з localStorage на клієнті, з файлу на сервері)
export function getAdminSettings(): AdminSettings {
  if (typeof window !== 'undefined') {
    // На клієнті
    const stored = localStorage.getItem('admin_settings')
    if (stored) {
      return JSON.parse(stored)
    }
  }

  return DEFAULT_SETTINGS
}

// Зберегти налаштування
export function saveAdminSettings(settings: AdminSettings): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_settings', JSON.stringify(settings))
  }
}

// Перевірка логіну та паролю
export function checkCredentials(login: string, password: string): boolean {
  const settings = getAdminSettings()
  return settings.login === login && settings.password === password
}
