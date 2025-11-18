'use client'

import Link from 'next/link'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-heading font-semibold mb-4">
            Ваш кошик порожній
          </h1>
          <p className="text-gray-600 mb-8">
            Додайте товари до кошика, щоб продовжити покупки
          </p>
          <Link
            href="/catalog/ethno"
            className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Повернутись до покупок
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-8">
        Кошик
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.color}-${item.size}`}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 bg-secondary rounded-lg flex-shrink-0"></div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-semibold mb-1">
                      {item.name}
                    </h3>
                    {item.color && (
                      <p className="text-sm text-gray-600 mb-2">
                        Колір: {item.color}
                      </p>
                    )}
                    <p className="text-primary font-semibold">
                      {item.price} грн
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex flex-col items-end gap-4">
                    <button
                      onClick={() => removeItem(item.id, item.color, item.size)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center border-2 border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1,
                            item.color,
                            item.size
                          )
                        }
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-1 font-medium min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1,
                            item.color,
                            item.size
                          )
                        }
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="font-semibold">
                      {item.price * item.quantity} грн
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/catalog/ethno"
            className="inline-block mt-6 text-primary hover:text-primary-dark font-medium"
          >
            ← Продовжити покупки
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-heading font-semibold mb-6">
              Разом
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Сума товарів:</span>
                <span className="font-medium">{getTotalPrice()} грн</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Доставка:</span>
                <span className="text-sm">Розраховується при оформленні</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Всього до оплати:</span>
                <span className="text-2xl font-bold text-primary">
                  {getTotalPrice()} грн
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full py-3 bg-primary text-white text-center rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Оформити замовлення
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
