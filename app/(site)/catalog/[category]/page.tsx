'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CatalogPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = use(params)
  const { t } = useLanguage()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products?category=${category}`)
        const data = await response.json()
        if (data.success) {
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error loading products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category])

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
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 sm:mb-8">
        <Link href="/" className="hover:text-primary touch-manipulation">
          {t('common.home')}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/catalog/ethno" className="hover:text-primary touch-manipulation">
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
        <p className="text-lg text-gray-700 max-w-2xl text-justify">
          {categoryDescription}
        </p>
      </div>

      {/* Product Count */}
      <div className="flex justify-end mb-8">
        <div className="text-sm text-gray-600">
          {t('catalog.productsFound')}: {products.length}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">Завантаження...</p>
        </div>
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg text-justify">
            {t('catalog.noProducts')}
          </p>
        </div>
      )}
    </div>
  )
}
