'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-8 text-center">
          {t('about.title')}
        </h1>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="h-96 rounded-2xl bg-secondary"></div>

          {/* Text */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-heading font-semibold mb-4">
              {t('about.ourStory')}
            </h2>
            <p className="text-gray-700 mb-4">
              {t('about.story1')}
            </p>
            <p className="text-gray-700 mb-4">
              {t('about.story2')}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-semibold mb-8 text-center">
            {t('about.values')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold">
                1
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">
                {t('about.value1.title')}
              </h3>
              <p className="text-gray-600">
                {t('about.value1.text')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold">
                2
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">
                {t('about.value2.title')}
              </h3>
              <p className="text-gray-600">
                {t('about.value2.text')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold">
                3
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">
                {t('about.value3.title')}
              </h3>
              <p className="text-gray-600">
                {t('about.value3.text')}
              </p>
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-semibold mb-8 text-center">
            {t('about.process')}
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{t('about.process1.title')}</h3>
                <p className="text-gray-600">
                  {t('about.process1.text')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{t('about.process2.title')}</h3>
                <p className="text-gray-600">
                  {t('about.process2.text')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{t('about.process3.title')}</h3>
                <p className="text-gray-600">
                  {t('about.process3.text')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{t('about.process4.title')}</h3>
                <p className="text-gray-600">
                  {t('about.process4.text')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-cream rounded-2xl p-12">
          <h2 className="text-3xl font-heading font-semibold mb-4">
            {t('about.cta.title')}
          </h2>
          <p className="text-gray-700 mb-8">
            {t('about.cta.subtitle')}
          </p>
          <Link
            href="/catalog/ethno"
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
