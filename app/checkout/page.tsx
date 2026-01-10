'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'
import { useLanguage } from '@/contexts/LanguageContext'
import ContractModal from '@/components/ui/ContractModal'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { t, language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)
  const [isContractAccepted, setIsContractAccepted] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    deliveryMethod: 'meest',
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

    // Проверка принятия договора
    if (!isContractAccepted) {
      setIsContractModalOpen(true)
      toast.error(t('contract.error'))
      return
    }

    setIsSubmitting(true)

    // Базовая валидация
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
      toast.error(t('checkout.errorRequired'))
      setIsSubmitting(false)
      return
    }

    try {
      // Создаем заказ в базе данных
      console.log('Creating order with data:', {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        items: items.length,
      })

      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
          totalAmount: getTotalPrice(),
          deliveryMethod: formData.deliveryMethod,
          deliveryAddress: `${formData.city}, ${formData.address}`,
          paymentMethod: formData.paymentMethod,
          notes: formData.comment,
        }),
      })

      console.log('Order response status:', orderResponse.status)
      const orderData = await orderResponse.json()
      console.log('Order response data:', orderData)

      if (!orderData.success) {
        console.error('Order creation failed:', orderData.error)
        throw new Error(orderData.error || 'Failed to create order')
      }

      const { orderNumber } = orderData

      // Если выбрана онлайн оплата - создаем Monobank invoice
      if (formData.paymentMethod === 'card_online') {
        console.log('Creating Monobank invoice for order:', orderNumber)

        const paymentResponse = await fetch('/api/payment/create-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: getTotalPrice(),
            orderId: orderNumber,
            customerEmail: formData.email,
          }),
        })

        console.log('Payment response status:', paymentResponse.status)
        const paymentData = await paymentResponse.json()
        console.log('Payment response data:', paymentData)

        if (!paymentData.success || !paymentData.pageUrl) {
          console.error('Payment invoice creation failed:', paymentData)
          throw new Error('Failed to create payment invoice')
        }

        console.log('Redirecting to Monobank:', paymentData.pageUrl)

        // Очищаем корзину
        clearCart()

        // Перенаправляем на страницу оплаты Monobank
        window.location.href = paymentData.pageUrl
        return
      }

      // Для оплаты при получении - просто очищаем корзину и перенаправляем
      clearCart()
      toast.success(t('checkout.success'))
      router.push(`/order/success?orderNumber=${orderNumber}`)
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(t('checkout.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContractAccept = () => {
    setIsContractAccepted(true)
    setIsContractModalOpen(false)
    toast.success(t('contract.accepted'))
  }

  const handleContractDecline = () => {
    setIsContractAccepted(false)
    setIsContractModalOpen(false)
    toast.info(t('contract.declined'))
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
                    value="meest"
                    checked={formData.deliveryMethod === 'meest'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{t('checkout.deliveryMeest')}</div>
                    <div className="text-sm text-gray-600">{t('checkout.deliveryMeestTime')}</div>
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
                    <div className="w-16 h-16 bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={language === 'ua' ? item.name.ua : item.name.en}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">
                        {language === 'ua' ? item.name.ua : item.name.en}
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

              {/* Договір (оферта) */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isContractAccepted}
                    onChange={(e) => setIsContractAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {t('contract.checkbox')}{' '}
                    <button
                      type="button"
                      onClick={() => setIsContractModalOpen(true)}
                      className="text-primary hover:text-primary-dark underline font-medium"
                    >
                      {t('contract.link')}
                    </button>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isContractAccepted}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('checkout.submitting') : t('checkout.submit')}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Модальне вікно договору */}
      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        onAccept={handleContractAccept}
        onDecline={handleContractDecline}
      />
    </div>
  )
}
