import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-8 text-center">
          Про бренд knitt_lyelya
        </h1>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="h-96 rounded-2xl bg-secondary"></div>

          {/* Text */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-heading font-semibold mb-4">
              Наша історія
            </h2>
            <p className="text-gray-700 mb-4">
              Кожна сумка — це історія, створена вручну з любов'ю до деталей.
              Ми поєднуємо традиційні українські орнаменти з сучасними трендами,
              щоб ви могли виразити свою індивідуальність та підтримати вітчизняного виробника.
            </p>
            <p className="text-gray-700 mb-4">
              Наші вироби створюються з якісних матеріалів, які забезпечують довговічність
              та зручність у використанні. Кожна деталь продумана до дрібниць.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-semibold mb-8 text-center">
            Наші цінності
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold">
                1
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">
                Якість
              </h3>
              <p className="text-gray-600">
                Використовуємо тільки найкращі матеріали та перевірені технології виробництва
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold">
                2
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">
                Унікальність
              </h3>
              <p className="text-gray-600">
                Кожна сумка - авторська робота з унікальним дизайном та етнічними мотивами
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold">
                3
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">
                Традиції
              </h3>
              <p className="text-gray-600">
                Підтримуємо та розвиваємо українську культуру через сучасний дизайн
              </p>
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-semibold mb-8 text-center">
            Процес створення
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Дизайн</h3>
                <p className="text-gray-600">
                  Розробка унікального дизайну з урахуванням сучасних трендів та етнічних мотивів
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Вибір матеріалів</h3>
                <p className="text-gray-600">
                  Підбір якісної натуральної шкіри, тканин та фурнітури
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Ручна робота</h3>
                <p className="text-gray-600">
                  Кожна сумка виконується вручну майстрами з багаторічним досвідом
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Контроль якості</h3>
                <p className="text-gray-600">
                  Перевірка кожної деталі перед відправкою клієнту
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-cream rounded-2xl p-12">
          <h2 className="text-3xl font-heading font-semibold mb-4">
            Готові обрати свою сумку?
          </h2>
          <p className="text-gray-700 mb-8">
            Перегляньте нашу колекцію авторських сумок ручної роботи
          </p>
          <Link
            href="/catalog/ethno"
            className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Переглянути колекції
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
