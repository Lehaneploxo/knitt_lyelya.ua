'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePageManagement() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [homeData, setHomeData] = useState<any>(null)
  const [banner1File, setBanner1File] = useState<File | null>(null)
  const [banner2File, setBanner2File] = useState<File | null>(null)
  const [instagramUrl, setInstagramUrl] = useState('')
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
      fetchHomeData()
    }
  }, [isAuthed])

  const fetchHomeData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/home-page')
      const data = await response.json()
      if (data.success && data.homePage) {
        setHomeData(data.homePage)
        setInstagramUrl(data.homePage.instagramPostUrl || '')
      }
    } catch (error) {
      toast.error('Помилка завантаження даних')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      const formData = new FormData()
      if (banner1File) formData.append('banner1', banner1File)
      if (banner2File) formData.append('banner2', banner2File)
      formData.append('instagramPostUrl', instagramUrl)

      const response = await fetch('/api/admin/update-home-page', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Зміни збережено!')
        fetchHomeData()
        setBanner1File(null)
        setBanner2File(null)
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
              <Link href="/admin/home" className="text-primary font-medium border-b-2 border-primary">
                Головна
              </Link>
              <Link href="/admin/settings" className="text-gray-700 hover:text-primary font-medium">
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Управління головною сторінкою</h2>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Баннер 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Баннер 1
            </label>
            {homeData?.banner1 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Поточне зображення:</p>
                <div className="relative w-full h-48 bg-gray-100 rounded">
                  <Image
                    src={homeData.banner1}
                    alt="Banner 1"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBanner1File(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {banner1File && (
              <p className="text-sm text-green-600 mt-2">
                Вибрано: {banner1File.name}
              </p>
            )}
          </div>

          {/* Баннер 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Баннер 2
            </label>
            {homeData?.banner2 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Поточне зображення:</p>
                <div className="relative w-full h-48 bg-gray-100 rounded">
                  <Image
                    src={homeData.banner2}
                    alt="Banner 2"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBanner2File(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {banner2File && (
              <p className="text-sm text-green-600 mt-2">
                Вибрано: {banner2File.name}
              </p>
            )}
          </div>

          {/* Instagram URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Посилання на Instagram-пост
            </label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/..."
              className="w-full px-4 py-2 border rounded-lg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Вставте повне посилання на Instagram-пост
            </p>
          </div>

          {/* Кнопка збереження */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50"
            >
              {saving ? 'Збереження...' : 'Зберегти зміни'}
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">💡 Підказка</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Рекомендований розмір баннерів: 1920x1080 пікселів</li>
            <li>• Підтримувані формати: JPG, PNG, WebP</li>
            <li>• Зміни відображаються на сайті миттєво</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
