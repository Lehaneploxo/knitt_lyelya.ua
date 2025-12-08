'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useLanguage } from '@/contexts/LanguageContext'
import { getAllProducts, getFeaturedProducts } from '@/lib/products'
import { useEffect } from 'react'

// Declare Instagram embed type
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void
      }
    }
  }
}

const allProducts = getAllProducts()
const featuredProducts = getFeaturedProducts()

export default function HomePage() {
  const { t } = useLanguage()

  useEffect(() => {
    // Load and process Instagram embeds
    const loadInstagramEmbed = () => {
      // Check if Instagram embed script is already loaded
      if (window.instgrm) {
        // Script already loaded, just process the embeds
        window.instgrm.Embeds.process()
      } else {
        // Load the script for the first time
        const script = document.createElement('script')
        script.src = 'https://www.instagram.com/embed.js'
        script.async = true
        script.onload = () => {
          // Process embeds after script loads
          if (window.instgrm) {
            window.instgrm.Embeds.process()
          }
        }
        document.body.appendChild(script)
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadInstagramEmbed, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-cream">
        {/* Background Image - Full Width */}
        <div className="relative w-full">
          <img
            src="/images/hero-banner.jpg"
            alt="Hero Banner"
            className="w-full h-auto object-contain"
          />
          {/* Overlay with gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30"></div>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-white mb-6 drop-shadow-2xl">
              {t('home.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-white mb-8 drop-shadow-2xl">
              {t('home.hero.subtitle')}
            </p>
            <Link
              href="/catalog/home"
              className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-xl hover:shadow-2xl transform hover:scale-105 transition-transform"
            >
              {t('common.viewCatalog')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        {/* Instagram Post Embed */}
        <div className="max-w-xl mx-auto">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink="https://www.instagram.com/p/DR4VRdDDCo6/?utm_source=ig_embed&amp;utm_campaign=loading"
            data-instgrm-version="14"
            style={{
              background: '#FFF',
              border: '0',
              borderRadius: '3px',
              boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
              margin: '1px',
              maxWidth: '540px',
              minWidth: '326px',
              padding: '0',
              width: 'calc(100% - 2px)'
            }}
          >
            <div style={{ padding: '16px' }}>
              <a
                href="https://www.instagram.com/p/DR4VRdDDCo6/?utm_source=ig_embed&amp;utm_campaign=loading"
                style={{
                  background: '#FFFFFF',
                  lineHeight: '0',
                  padding: '0 0',
                  textAlign: 'center',
                  textDecoration: 'none',
                  width: '100%'
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                View this post on Instagram
              </a>
            </div>
          </blockquote>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="relative w-full overflow-hidden rounded-2xl bg-cream">
          {/* Background Image */}
          <div className="relative w-full">
            <img
              src="/images/hero-banner2.jpg"
              alt="Collection Banner"
              className="w-full h-auto object-contain"
            />
            {/* Overlay with gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-white mb-4 drop-shadow-2xl">
                {t('home.banner.banner')}
              </h2>
              <p className="text-lg md:text-xl text-white drop-shadow-2xl">
                {t('home.banner.text')}
              </p>
            </div>
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
        <div className="grid md:grid-cols-3 gap-8">
          {/* Ethno Collection */}
          <Link
            href="/catalog/ethno"
            className="group relative h-[500px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
          >
            <img
              src="/images/products/10ethno.solomia1.JPG"
              alt={t('home.collection.ethno.title')}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-3xl font-heading font-semibold mb-2">
                {t('home.collection.ethno.title')}
              </h3>
              <p className="text-sm mb-4 opacity-90">{t('home.collection.ethno.description')}</p>
              <span className="inline-flex items-center text-white group-hover:translate-x-2 transition-transform">
                {t('home.collection.viewMore')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </div>
          </Link>

          {/* Basic Collection */}
          <Link
            href="/catalog/basic"
            className="group relative h-[500px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
          >
            <img
              src="/images/products/10basic.lyka1.JPG"
              alt={t('home.collection.basic.title')}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-3xl font-heading font-semibold mb-2">
                {t('home.collection.basic.title')}
              </h3>
              <p className="text-sm mb-4 opacity-90">{t('home.collection.basic.description')}</p>
              <span className="inline-flex items-center text-white group-hover:translate-x-2 transition-transform">
                {t('home.collection.viewMore')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </div>
          </Link>

          {/* Home Collection */}
          <Link
            href="/catalog/home"
            className="group relative h-[500px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
          >
            <img
              src="/images/products/10home.placemat1.JPG"
              alt={t('home.collection.home.title')}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-3xl font-heading font-semibold mb-2">
                {t('home.collection.home.title')}
              </h3>
              <p className="text-sm mb-4 opacity-90">{t('home.collection.home.description')}</p>
              <span className="inline-flex items-center text-white group-hover:translate-x-2 transition-transform">
                {t('home.collection.viewMore')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
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
