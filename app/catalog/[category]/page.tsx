import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { getProductsByCategory } from '@/lib/products'

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
  const products = getProductsByCategory(category)
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
