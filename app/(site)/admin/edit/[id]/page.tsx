'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = Array.isArray(params.id) ? params.id[0] : (params.id as string)

  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [nameUa, setNameUa] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [price, setPrice] = useState('')
  const [descriptionUa, setDescriptionUa] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [category, setCategory] = useState('')
  const [inStock, setInStock] = useState(true)

  useEffect(() => {
    const authed = localStorage.getItem('admin_authed')
    if (authed === 'true') {
      setIsAuthed(true)
    } else {
      window.location.href = '/admin'
    }
  }, [])

  useEffect(() => {
    if (isAuthed && productId) {
      fetchProduct()
    }
  }, [isAuthed, productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/product/${productId}`)
      const data = await response.json()

      if (data.success && data.product) {
        const p = data.product
        setNameUa(p.name_ua || '')
        setNameEn(p.name_en || '')
        setPrice(p.price?.toString() || '')
        setDescriptionUa(p.description_ua || '')
        setDescriptionEn(p.description_en || '')
        setCategory(p.category || '')
        setInStock(p.inStock !== false)
      } else {
        toast.error('Товар не знайдено')
        router.push('/admin')
      }
    } catch (error) {
      toast.error('Помилка завантаження товару')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!nameUa || !price) {
      toast.error('Заповніть обов\'язкові поля (Назва та Ціна)')
      return
    }

    try {
      setSaving(true)

      const response = await fetch(`/api/admin/update-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          name_ua: nameUa,
          name_en: nameEn,
          price: parseFloat(price),
          description_ua: descriptionUa,
          description_en: descriptionEn,
          category,
          inStock,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Товар оновлено!')
        setTimeout(() => router.push('/admin'), 1500)
      } else {
        toast.error(data.error || 'Помилка оновлення')
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
              <Link href="/admin" className="text-primary font-medium">
                Товари
              </Link>
              <Link href="/admin/orders" className="text-gray-700 hover:text-primary font-medium">
                Замовлення
              </Link>
              <Link href="/admin/home" className="text-gray-700 hover:text-primary font-medium">
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
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="text-gray-600 hover:text-primary"
          >
            ← Назад до списку
          </Link>
          <h2 className="text-3xl font-bold">Редагування товару</h2>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Назва українською */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Назва (українською) *
            </label>
            <input
              type="text"
              value={nameUa}
              onChange={(e) => setNameUa(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Назва англійською */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Назва (англійською)
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Ціна */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ціна (грн) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Категорія */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Категорія
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Оберіть категорію</option>
              <option value="ethno">Етно</option>
              <option value="basic">Базові</option>
              <option value="home">Дім</option>
            </select>
          </div>

          {/* Опис українською */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Опис (українською)
            </label>
            <textarea
              value={descriptionUa}
              onChange={(e) => setDescriptionUa(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Опис англійською */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Опис (англійською)
            </label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* В наявності */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="inStock"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-5 h-5"
            />
            <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
              Товар в наявності
            </label>
          </div>

          {/* Кнопки */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50 flex-1"
            >
              {saving ? 'Збереження...' : 'Зберегти зміни'}
            </button>
            <Link
              href="/admin"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium text-center"
            >
              Скасувати
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">💡 Підказка</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Можна змінити тільки ціну, не змінюючи інші поля</li>
            <li>• Можна змінити тільки опис, не змінюючи ціну</li>
            <li>• Зміни відобразяться на сайті після збереження</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
