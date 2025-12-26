'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthed, setIsAuthed] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAuthed(true)
      localStorage.setItem('admin_authed', 'true')
      toast.success('Успішний вхід!')
    } else {
      toast.error('Невірний пароль!')
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

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Адмін-панель</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Керування товарами</h1>
          <Link
            href="/admin/add"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-medium"
          >
            + Додати товар
          </Link>
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
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Назва</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ціна</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Категорія</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Наявність</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name_ua}</div>
                      <div className="text-sm text-gray-500">{product.name_en}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price} грн
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'В наявності' : 'Немає'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/edit/${product._id}`}
                        className="text-primary hover:text-primary/80 mr-4"
                      >
                        Редагувати
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Видалити
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
