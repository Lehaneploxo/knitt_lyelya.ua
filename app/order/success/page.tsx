'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function OrderSuccessPage() {
  const { t } = useLanguage()

  // В реальном приложении orderId будет из query params или state
  const orderId = 'ORD-' + Date.now()

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center">
        <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />

        <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
          {t('orderSuccess.title')}
        </h1>

        <p className="text-lg text-gray-700 mb-2">
          {t('orderSuccess.orderNumber')} <span className="font-semibold">#{orderId}</span> {t('orderSuccess.success')}
        </p>

        <p className="text-gray-600 mb-8">
          {t('orderSuccess.emailSent')}
        </p>

        <div className="bg-cream rounded-lg p-6 mb-8 text-left">
          <h2 className="font-heading text-xl font-semibold mb-4">
            {t('orderSuccess.whatNext')}
          </h2>

          <div className="space-y-3 text-gray-700">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </span>
              <p>{t('orderSuccess.step1')}</p>
            </div>

            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </span>
              <p>{t('orderSuccess.step2')}</p>
            </div>

            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </span>
              <p>{t('orderSuccess.step3')}</p>
            </div>

            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                4
              </span>
              <p>{t('orderSuccess.step4')}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            {t('orderSuccess.backHome')}
          </Link>

          <Link
            href="/catalog/ethno"
            className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
          >
            {t('orderSuccess.continueShopping')}
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-gray-600">
            {t('orderSuccess.contactUs')}
          </p>
          <p className="text-gray-900 font-medium mt-2">
            📞 +380 XX XXX XX XX | ✉️ info@knitt-lyelya.ua
          </p>
        </div>
      </div>
    </div>
  )
}
