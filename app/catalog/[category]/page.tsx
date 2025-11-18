import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ProductGrid } from '@/components/product/ProductGrid'

// Временные данные
const productsData = {
  ethno: [
    { id: 'prod_001', name: "Сумка 'Польовий квіт'", price: 1500, image: '/images/placeholder-bag-1.jpg', category: 'ethno' },
    { id: 'prod_003', name: "Сумка 'Етно шик'", price: 2200, image: '/images/placeholder-bag-3.jpg', category: 'ethno' },
    { id: 'prod_005', name: "Сумка 'Вишиванка'", price: 1900, image: '/images/placeholder-bag-5.jpg', category: 'ethno' },
    { id: 'prod_007', name: "Сумка 'Традиція'", price: 1700, image: '/images/placeholder-bag-7.jpg', category: 'ethno' },
  ],
  basic: [
    { id: 'prod_002', name: "Сумка 'Класика'", price: 1800, image: '/images/placeholder-bag-2.jpg', category: 'basic' },
    { id: 'prod_004', name: "Сумка 'Мінімал'", price: 1600, image: '/images/placeholder-bag-4.jpg', category: 'basic' },
    { id: 'prod_006', name: "Сумка 'Елеганс'", price: 2000, image: '/images/placeholder-bag-6.jpg', category: 'basic' },
  ],
  home: [
    { id: 'prod_008', name: "Кошик 'Затишок'", price: 800, image: '/images/placeholder-home-1.jpg', category: 'home' },
    { id: 'prod_009', name: "Органайзер 'Порядок'", price: 600, image: '/images/placeholder-home-2.jpg', category: 'home' },
  ],
}

const categoryInfo: Record<string, { title: string; description: string }> = {
  ethno: {
    title: 'Етно колекція',
    description: 'Традиційні українські орнаменти у сучасному виконанні. Кожна сумка - це поєднання етнічних мотивів та сучасного стилю.',
  },
  basic: {
    title: 'Базова колекція',
    description: 'Класичні моделі для щоденного використання. Елегантність та практичність в кожній деталі.',
  },
  home: {
    title: 'Для дому',
    description: 'Стильні та функціональні аксесуари, які додадуть затишку вашому простору.',
  },
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const products = productsData[category as keyof typeof productsData] || []
  const info = categoryInfo[category] || { title: 'Каталог', description: '' }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-primary">
          Головна
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/catalog/ethno" className="hover:text-primary">
          Каталог
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">{info.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-4">
          {info.title}
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl">
          {info.description}
        </p>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium">
            Всі
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:border-primary font-medium">
            Ціна: низька - висока
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:border-primary font-medium">
            Нові
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Знайдено товарів: {products.length}
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">
            В цій категорії поки немає товарів
          </p>
        </div>
      )}
    </div>
  )
}
