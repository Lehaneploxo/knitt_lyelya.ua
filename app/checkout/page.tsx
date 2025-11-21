'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    deliveryMethod: 'ukrposhta',
    city: '',
    address: '',
    paymentMethod: 'cash_on_delivery',
    comment: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Базовая валидация
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
      toast.error(t('checkout.errorRequired'))
      setIsSubmitting(false)
      return
    }

    // Симуляция отправки заказа
    try {
      // Здесь будет API call для создания заказа
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Очистка корзины
      clearCart()

      toast.success(t('checkout.success'))

      // Редирект на страницу успеха
      router.push('/order/success')
    } catch (error) {
      toast.error(t('checkout.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-8">
        {t('checkout.title')}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-heading font-semibold mb-6">
                {t('checkout.contactInfo')}
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.firstName')} *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.lastName')} *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.phone')} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+380"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-heading font-semibold mb-6">
                {t('checkout.delivery')}
              </h2>

              <div className="space-y-4 mb-6">
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="ukrposhta"
                    checked={formData.deliveryMethod === 'ukrposhta'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{t('checkout.deliveryUkrposhta')}</div>
                    <div className="text-sm text-gray-600">{t('checkout.deliveryUkrposhtaTime')}</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="novaposhta"
                    checked={formData.deliveryMethod === 'novaposhta'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{t('checkout.deliveryNovaposhta')}</div>
                    <div className="text-sm text-gray-600">{t('checkout.deliveryNovaposhtaTime')}</div>
                  </div>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.city')} *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.address')} *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-heading font-semibold mb-6">
                {t('checkout.payment')}
              </h2>

              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={formData.paymentMethod === 'cash_on_delivery'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{t('checkout.paymentCash')}</div>
                    <div className="text-sm text-gray-600">{t('checkout.paymentCashDescription')}</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card_online"
                    checked={formData.paymentMethod === 'card_online'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{t('checkout.paymentCard')}</div>
                    <div className="text-sm text-gray-600">{t('checkout.paymentCardDescription')}</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Comment */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-heading font-semibold mb-6">
                {t('checkout.comment')}
              </h2>

              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                rows={4}
                placeholder={t('checkout.commentPlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-heading font-semibold mb-6">
                {t('checkout.yourOrder')}
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.color}-${item.size}`}
                    className="flex gap-3"
                  >
                    <div className="w-16 h-16 bg-secondary rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × {item.price} {t('common.currency')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 border-t pt-4">
                <div className="flex justify-between text-gray-700">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-medium">{getTotalPrice()} {t('common.currency')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{t('cart.delivery')}</span>
                  <span className="text-sm">{t('checkout.deliveryFrom')}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{t('checkout.total')}</span>
                  <span className="text-2xl font-bold text-primary">
                    {getTotalPrice()} {t('common.currency')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('checkout.submitting') : t('checkout.submit')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
