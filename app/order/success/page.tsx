import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function OrderSuccessPage() {
  // В реальном приложении orderId будет из query params или state
  const orderId = 'ORD-' + Date.now()

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center">
        <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />

        <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
          Дякуємо за замовлення!
        </h1>

        <p className="text-lg text-gray-700 mb-2">
          Ваше замовлення <span className="font-semibold">#{orderId}</span> успішно оформлено
        </p>

        <p className="text-gray-600 mb-8">
          Ми надіслали підтвердження на вказану електронну адресу
        </p>

        <div className="bg-cream rounded-lg p-6 mb-8 text-left">
          <h2 className="font-heading text-xl font-semibold mb-4">
            Що далі?
          </h2>

          <div className="space-y-3 text-gray-700">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </span>
              <p>Наш менеджер зв'яжеться з вами протягом 1-2 годин для підтвердження замовлення</p>
            </div>

            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </span>
              <p>Ми відправимо ваше замовлення обраною службою доставки</p>
            </div>

            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </span>
              <p>Ви отримаєте номер для відстеження посилки</p>
            </div>

            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                4
              </span>
              <p>Очікуйте доставку протягом 1-7 днів (в залежності від служби доставки)</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Повернутись на головну
          </Link>

          <Link
            href="/catalog/ethno"
            className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
          >
            Продовжити покупки
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-gray-600">
            Якщо у вас виникли питання, зв'яжіться з нами:
          </p>
          <p className="text-gray-900 font-medium mt-2">
            📞 +380 XX XXX XX XX | ✉️ info@knitt-lyelya.ua
          </p>
        </div>
      </div>
    </div>
  )
}
