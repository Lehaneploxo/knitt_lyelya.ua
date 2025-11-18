import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductGrid } from '@/components/product/ProductGrid'

// Временные данные для прототипа
const newProducts = [
  {
    id: 'prod_001',
    name: "Сумка 'Польовий квіт'",
    price: 1500,
    image: '/images/placeholder-bag-1.jpg',
    category: 'ethno',
  },
  {
    id: 'prod_002',
    name: "Сумка 'Класика'",
    price: 1800,
    image: '/images/placeholder-bag-2.jpg',
    category: 'basic',
  },
  {
    id: 'prod_003',
    name: "Сумка 'Етно шик'",
    price: 2200,
    image: '/images/placeholder-bag-3.jpg',
    category: 'ethno',
  },
  {
    id: 'prod_004',
    name: "Сумка 'Мінімал'",
    price: 1600,
    image: '/images/placeholder-bag-4.jpg',
    category: 'basic',
  },
]

const bestsellers = newProducts.slice(0, 6)

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-secondary to-cream flex items-center justify-center">
        <div className="text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-gray-900 mb-6">
            Авторські сумки ручної роботи
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Поєднання етнічних мотивів та сучасного дизайну
          </p>
          <Link
            href="/catalog/ethno"
            className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Переглянути каталог
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold">
            Нові надходження
          </h2>
          <Link
            href="/catalog/ethno"
            className="text-primary hover:text-primary-dark font-medium flex items-center"
          >
            Дивитись все
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <ProductGrid products={newProducts} />
      </section>

      {/* Bestsellers */}
      <section className="py-16 px-4 max-w-7xl mx-auto bg-white rounded-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold">
            Хіти продажів
          </h2>
        </div>
        <ProductGrid products={bestsellers} />
      </section>

      {/* Collections Preview */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-center mb-12">
          Наші колекції
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Ethno Collection */}
          <Link
            href="/catalog/ethno"
            className="group relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-accent to-primary"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-4xl font-heading font-semibold mb-4">
                  Етно
                </h3>
                <p className="text-lg mb-4">Традиційні мотиви у сучасному виконанні</p>
                <span className="inline-flex items-center text-white group-hover:translate-x-2 transition-transform">
                  Переглянути колекцію
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Basic Collection */}
          <Link
            href="/catalog/basic"
            className="group relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-4xl font-heading font-semibold mb-4">
                  Базові
                </h3>
                <p className="text-lg mb-4">Класичні моделі на кожен день</p>
                <span className="inline-flex items-center text-white group-hover:translate-x-2 transition-transform">
                  Переглянути колекцію
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* About Designer */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="h-96 rounded-2xl bg-secondary"></div>
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6">
              Про дизайнера
            </h2>
            <p className="text-gray-700 mb-4">
              Кожна сумка — це історія, створена вручну з любов'ю до деталей.
              Ми поєднуємо традиційні українські орнаменти з сучасними трендами,
              щоб ви могли виразити свою індивідуальність та підтримати вітчизняного виробника.
            </p>
            <p className="text-gray-700 mb-8">
              Наші вироби створюються з якісних матеріалів, які забезпечують довговічність
              та зручність у використанні. Кожна деталь продумана до дрібниць.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
            >
              Дізнатись більше
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
