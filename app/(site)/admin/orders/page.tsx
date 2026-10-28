'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Order {
  _id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: Array<{
    productId: string
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  paymentStatus: 'not_paid' | 'paid' | 'partial'
  deliveryMethod: string
  deliveryAddress: string
  orderDate: string
  notes?: string
}

export default function OrdersPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

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
      fetchOrders()
    }
  }, [isAuthed])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      toast.error('Помилка завантаження замовлень')
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/update-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, paymentStatus: newStatus }),
      })

      if (response.ok) {
        toast.success('Статус оновлено!')
        fetchOrders()
      } else {
        toast.error('Помилка оновлення статусу')
      }
    } catch (error) {
      toast.error('Помилка з\'єднання')
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'partial':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Оплачено'
      case 'partial':
        return 'Часткова оплата'
      default:
        return 'Не оплачено'
    }
  }

  if (!isAuthed) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p>Перевірка доступу...</p>
    </div>
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
              <Link href="/admin/orders" className="text-primary font-medium border-b-2 border-primary">
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Замовлення</h2>

        {loading ? (
          <div className="text-center py-12">Завантаження...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-500">Замовлень ще немає</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Замовлення #{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString('uk-UA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(order.paymentStatus)}`}>
                    {getStatusText(order.paymentStatus)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Покупець</p>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm">{order.customerEmail}</p>
                    <p className="text-sm">{order.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Доставка</p>
                    <p className="font-medium">{order.deliveryMethod || 'Не вказано'}</p>
                    <p className="text-sm">{order.deliveryAddress}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">Товари:</p>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-medium">{item.price * item.quantity} грн</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                    <span>Всього:</span>
                    <span>{order.totalAmount} грн</span>
                  </div>
                </div>

                {order.notes && (
                  <div className="border-t mt-4 pt-4">
                    <p className="text-sm text-gray-500">Примітки:</p>
                    <p className="text-sm">{order.notes}</p>
                  </div>
                )}

                <div className="border-t mt-4 pt-4">
                  <label className="text-sm text-gray-500">Статус оплати:</label>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                    className="ml-2 px-3 py-1 border rounded-lg text-sm"
                  >
                    <option value="not_paid">Не оплачено</option>
                    <option value="partial">Часткова оплата</option>
                    <option value="paid">Оплачено</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
