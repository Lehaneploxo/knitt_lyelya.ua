'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useLanguage } from '@/contexts/LanguageContext'
import { getAllProducts, getNewProducts, getFeaturedProducts } from '@/lib/products'

const allProducts = getAllProducts()
const newProducts = getNewProducts()
const featuredProducts = getFeaturedProducts()

export default function HomePage() {
  const { t } = useLanguage()
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-secondary to-cream flex items-center justify-center">
        <div className="text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-gray-900 mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            {t('home.hero.subtitle')}
          </p>
          <Link
            href="/catalog/home"
            className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            {t('common.viewCatalog')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold">
            {t('home.newArrivals')}
          </h2>
          <Link
            href="/catalog/home"
            className="text-primary hover:text-primary-dark font-medium flex items-center"
          >
            {t('common.viewAll')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <ProductGrid products={newProducts} />
      </section>

      {/* Banner */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="relative h-64 md:h-96 bg-gradient-to-br from-secondary to-cream rounded-2xl overflow-hidden flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-gray-900 mb-4">
              {t('home.banner.banner')}
            </h2>
            <p className="text-lg md:text-xl text-gray-700">
              {t('home.banner.text')}
            </p>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 px-4 max-w-7xl mx-auto bg-white rounded-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold">
            {t('home.bestsellers')}
          </h2>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      {/* Collections Preview */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-center mb-12">
          {t('home.collections')}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Home Collection */}
          <Link
            href="/catalog/home"
            className="group relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-accent to-primary"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-4xl font-heading font-semibold mb-4">
                  {t('home.collection.home.title')}
                </h3>
                <p className="text-lg mb-4">{t('home.collection.home.description')}</p>
                <span className="inline-flex items-center text-white group-hover:translate-x-2 transition-transform">
                  {t('home.collection.viewCollection')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Coming Soon Collection */}
          <div className="group relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 opacity-50 cursor-not-allowed">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-4xl font-heading font-semibold mb-4">
                  {t('home.collection.comingSoon.title')}
                </h3>
                <p className="text-lg mb-4">{t('home.collection.comingSoon.text')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Designer */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="h-96 rounded-2xl bg-secondary"></div>
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6">
              {t('home.about.title')}
            </h2>
            <p className="text-gray-700 mb-4">
              {t('home.about.text')}
            </p>
            <p className="text-gray-700 mb-8">
              {t('home.about.text2')}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
            >
              {t('home.about.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
