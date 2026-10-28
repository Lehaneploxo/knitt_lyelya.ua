'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SettingsPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const authed = localStorage.getItem('admin_authed')
    if (authed === 'true') {
      setIsAuthed(true)
    } else {
      window.location.href = '/admin'
    }
  }, [])

  useEffect(() => {
    if (isAuthed) {
      fetchSettings()
    }
  }, [isAuthed])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      if (data.success && data.settings) {
        setEmail(data.settings.notificationEmail || '')
        setLogin(data.settings.adminLogin || '')
        setPassword(data.settings.adminPassword || '')
      }
    } catch (error) {
      toast.error('Помилка завантаження налаштувань')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!email || !login || !password) {
      toast.error('Заповніть всі поля')
      return
    }

    if (password.length < 6) {
      toast.error('Пароль має містити мінімум 6 символів')
      return
    }

    try {
      setSaving(true)

      const response = await fetch('/api/admin/update-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationEmail: email,
          adminLogin: login,
          adminPassword: password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Налаштування збережено!')

        // Якщо змінили логін або пароль, виходимо
        toast.info('Увійдіть знову з новими даними', { duration: 3000 })
        setTimeout(() => {
          localStorage.removeItem('admin_authed')
          window.location.href = '/admin'
        }, 3000)
      } else {
        toast.error(data.error || 'Помилка збереження')
      }
    } catch (error) {
      toast.error('Помилка з\'єднання')
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthed || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Завантаження...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Адмін-панель</h1>
            <div className="flex gap-4">
              <Link href="/admin" className="text-gray-700 hover:text-primary font-medium">
                Товари
              </Link>
              <Link href="/admin/orders" className="text-gray-700 hover:text-primary font-medium">
                Замовлення
              </Link>
              <Link href="/admin/home" className="text-gray-700 hover:text-primary font-medium">
                Головна
              </Link>
              <Link href="/admin/settings" className="text-primary font-medium border-b-2 border-primary">
                Налаштування
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('admin_authed')
                  window.location.href = '/admin'
                }}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Вийти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Налаштування</h2>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Email для сповіщень */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email для сповіщень про замовлення
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              На цей email будуть надходити повідомлення про нові замовлення
            </p>
          </div>

          {/* Логін адміністратора */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Логін адміністратора
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="admin"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Пароль адміністратора */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пароль адміністратора
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg"
              minLength={6}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Мінімум 6 символів
            </p>
          </div>

          {/* Кнопка збереження */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50"
            >
              {saving ? 'Збереження...' : 'Зберегти налаштування'}
            </button>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold text-yellow-900 mb-2">⚠️ Важливо!</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Після зміни логіну або паролю вам потрібно буде увійти знову</li>
            <li>• Запам'ятайте новий пароль, відновити його можна тільки через Sanity</li>
            <li>• Email використовується для отримання сповіщень про замовлення</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
