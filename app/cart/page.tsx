'use client'

import Link from 'next/link'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()
  const { t } = useLanguage()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-heading font-semibold mb-4">
            {t('cart.empty.title')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('cart.empty.description')}
          </p>
          <Link
            href="/catalog/ethno"
            className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            {t('cart.empty.button')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-8">
        {t('cart.title')}
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
                        {t('cart.color')}: {item.color}
                      </p>
                    )}
                    <p className="text-primary font-semibold">
                      {item.price} {t('common.currency')}
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
                      {item.price * item.quantity} {t('common.currency')}
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
            ← {t('common.continueShopping')}
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-heading font-semibold mb-6">
              {t('cart.total')}
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>{t('cart.subtotal')}</span>
                <span className="font-medium">{getTotalPrice()} {t('common.currency')}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>{t('cart.delivery')}</span>
                <span className="text-sm">{t('cart.deliveryCalculated')}</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{t('cart.totalToPay')}</span>
                <span className="text-2xl font-bold text-primary">
                  {getTotalPrice()} {t('common.currency')}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full py-3 bg-primary text-white text-center rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              {t('common.checkout')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
