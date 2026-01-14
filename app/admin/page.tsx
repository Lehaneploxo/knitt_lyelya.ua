'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

type Category = 'ethno' | 'basic' | 'home'

export default function AdminPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthed, setIsAuthed] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<Category>('ethno')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Спочатку спробуємо увійти
      let response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      })

      let data = await response.json()

      // Якщо налаштувань немає, створюємо їх автоматично
      if (!data.success && data.error?.includes('не знайдено')) {
        toast.info('Створення початкових налаштувань...')

        const initResponse = await fetch('/api/admin/init', { method: 'POST' })
        const initData = await initResponse.json()

        if (initData.success && initData.needsInit) {
          toast.success('Використайте логін: admin, пароль: admin123')
          // Автоматично підставляємо дані
          setLogin('admin')
          setPassword('admin123')
          return
        }

        // Пробуємо увійти ще раз після ініціалізації
        response = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login, password }),
        })
        data = await response.json()
      }

      if (data.success) {
        setIsAuthed(true)
        localStorage.setItem('admin_authed', 'true')
        toast.success('Успішний вхід!')
      } else {
        toast.error(data.error || 'Невірний логін або пароль!')
      }
    } catch (error) {
      toast.error('Помилка з\'єднання')
    }
  }

  useEffect(() => {
    const authed = localStorage.getItem('admin_authed')
    if (authed === 'true') {
      setIsAuthed(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthed) {
      fetchProducts()
    }
  }, [isAuthed])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      toast.error('Помилка завантаження товарів')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити цей товар?')) return

    try {
      const response = await fetch(`/api/admin/delete-product`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        toast.success('Товар видалено!')
        fetchProducts()
      } else {
        toast.error('Помилка видалення')
      }
    } catch (error) {
      toast.error('Помилка з\'єднання')
    }
  }

  const handleImport = async () => {
    if (!confirm('Імпортувати всі товари з JSON в Sanity? Це може зайняти 1-2 хвилини.')) return

    try {
      toast.info('Починаю імпорт товарів...')
      const response = await fetch('/api/admin/import-products', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Імпортовано ${data.imported} товарів! Пропущено: ${data.skipped}`)
        fetchProducts()
      } else {
        toast.error(data.error || 'Помилка імпорту')
      }
    } catch (error) {
      toast.error('Помилка з\'єднання')
    }
  }

  const getCategoryName = (cat: Category) => {
    switch(cat) {
      case 'ethno': return 'Етно'
      case 'basic': return 'Базові'
      case 'home': return 'Дім'
    }
  }

  const filteredProducts = products.filter(p => p.category === activeCategory)

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Адмін-панель</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Логін"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
            >
              Увійти
            </button>
          </form>
        </div>
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
              <Link href="/admin" className="text-primary font-medium border-b-2 border-primary">
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
                  setIsAuthed(false)
                }}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Вийти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Керування товарами ({products.length})</h2>
          <div className="flex gap-3">
            <button
              onClick={handleImport}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              📥 Імпортувати товари в Sanity
            </button>
            <Link
              href="/admin/add"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-medium"
            >
              + Додати товар
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Завантаження...</div>
        ) : products.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-500 mb-4">Товарів ще немає</p>
            <Link
              href="/admin/add"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
            >
              Додати перший товар
            </Link>
          </div>
        ) : (
          <>
            {/* Вкладки категорій */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="flex border-b">
                {(['ethno', 'basic', 'home'] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-1 px-6 py-4 text-center font-semibold text-lg transition-colors ${
                      activeCategory === cat
                        ? 'text-primary border-b-2 border-primary bg-primary/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {getCategoryName(cat)} ({products.filter(p => p.category === cat).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Сітка товарів */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 mb-4">В категорії "{getCategoryName(activeCategory)}" поки немає товарів</p>
                <Link
                  href="/admin/add"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-medium"
                >
                  Додати товар
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Фото товару */}
                    <div className="relative h-64 bg-gray-200">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name_ua}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          Немає фото
                        </div>
                      )}
                      {/* Бейдж наявності */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full shadow-md ${
                            product.inStock
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {product.inStock ? 'В наявності' : 'Немає'}
                        </span>
                      </div>
                    </div>

                    {/* Інформація про товар */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[56px]">{product.name_ua}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[40px]">{product.description_ua}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-primary">{product.price} грн</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.sku}</span>
                      </div>

                      {/* Дії */}
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/edit/${product._id}`}
                          className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-center transition-colors"
                        >
                          Редагувати
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium transition-colors"
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
