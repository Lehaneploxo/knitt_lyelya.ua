'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-heading font-semibold mb-12 text-center uppercase break-words">
          {t('about.title')}
        </h1>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/about-banner.jpg"
              alt="About knitt_lyelya.ua"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-heading font-semibold mb-4 uppercase break-words">
              {t('about.ourStory')}
            </h2>
            <p className="text-gray-700 text-lg mb-4">
              {t('about.story1')}
            </p>
            <p className="text-gray-700 text-lg mb-4">
              {t('about.story2')}
            </p>
            <p className="text-gray-700 text-lg mb-4">
              {t('about.story3')}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-4xl font-heading font-semibold mb-8 text-center uppercase break-words">
            {t('about.values')}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold">
                1
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-2 uppercase break-words">
                {t('about.value1.title')}
              </h3>
              <p className="text-gray-600 text-lg">
                {t('about.value1.text')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold">
                2
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-2 uppercase break-words">
                {t('about.value2.title')}
              </h3>
              <p className="text-gray-600 text-lg">
                {t('about.value2.text')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold">
                3
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-2 uppercase break-words">
                {t('about.value3.title')}
              </h3>
              <p className="text-gray-600 text-lg">
                {t('about.value3.text')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold">
                4
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-2 uppercase break-words">
                {t('about.value4.title')}
              </h3>
              <p className="text-gray-600 text-lg">
                {t('about.value4.text')}
              </p>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="mb-16 bg-cream rounded-2xl p-12">
          <h2 className="text-4xl font-heading font-semibold mb-6 text-center uppercase break-words">
            {t('about.mission')}
          </h2>
          <p className="text-gray-700 text-xl text-center max-w-3xl mx-auto">
            {t('about.missionText')}
          </p>
        </div>

        {/* CTA */}
        <div className="text-center bg-cream rounded-2xl p-12">
          <h2 className="text-3xl font-heading font-semibold mb-4">
            {t('about.cta.title')}
          </h2>
          <p className="text-gray-700 text-lg mb-8">
            {t('about.cta.subtitle')}
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            {t('about.cta.button')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
