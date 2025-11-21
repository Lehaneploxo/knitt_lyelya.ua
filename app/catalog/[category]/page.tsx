'use client'

import { use } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { getProductsByCategory } from '@/lib/products'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CatalogPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = use(params)
  const { t } = useLanguage()
  const products = getProductsByCategory(category)

  const getCategoryTitle = (cat: string) => {
    switch(cat) {
      case 'ethno': return t('catalog.ethno.title')
      case 'basic': return t('catalog.basic.title')
      case 'home': return t('catalog.home.title')
      default: return t('common.catalog')
    }
  }

  const getCategoryDescription = (cat: string) => {
    switch(cat) {
      case 'ethno': return t('catalog.ethno.description')
      case 'basic': return t('catalog.basic.description')
      case 'home': return t('catalog.home.description')
      default: return ''
    }
  }

  const categoryTitle = getCategoryTitle(category)
  const categoryDescription = getCategoryDescription(category)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-primary">
          {t('common.home')}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/catalog/ethno" className="hover:text-primary">
          {t('common.catalog')}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">{categoryTitle}</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-4">
          {categoryTitle}
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl">
          {categoryDescription}
        </p>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium">
            {t('catalog.filters.all')}
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:border-primary font-medium">
            {t('catalog.filters.new')}
          </button>
        </div>

        <div className="text-sm text-gray-600">
          {t('catalog.productsFound')}: {products.length}
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">
            {t('catalog.noProducts')}
          </p>
        </div>
      )}
    </div>
  )
}
