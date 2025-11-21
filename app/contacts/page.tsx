'use client'

import { useState } from 'react'
import { Mail, Phone, Instagram, Send, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ContactsPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error(t('contacts.errorFillAll'))
      return
    }

    // Simulate sending
    toast.success(t('contacts.success'))
    setFormData({ name: '', email: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-4 text-center">
          {t('contacts.title')}
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center">
          {t('contacts.subtitle')}
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-heading font-semibold mb-6">
              {t('contacts.writeUs')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contacts.name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={t('contacts.namePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contacts.email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={t('contacts.emailPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contacts.message')} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={t('contacts.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                {t('contacts.send')}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-heading font-semibold mb-6">
              {t('contacts.info')}
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('contacts.phone')}</h3>
                  <a href="tel:+380954440531" className="text-gray-600 hover:text-primary">
                    +38095 444 0531
                  </a>
                  <p className="text-sm text-gray-500">{t('contacts.phoneAlso')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('contacts.emailTitle')}</h3>
                  <a href="mailto:knitt.lyelya@gmail.com" className="text-gray-600 hover:text-primary">
                    knitt.lyelya@gmail.com
                  </a>
                  <p className="text-sm text-gray-500">{t('contacts.emailResponse')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('contacts.address')}</h3>
                  <p className="text-gray-600">{t('contacts.addressCity')}</p>
                  <p className="text-sm text-gray-500">{t('contacts.addressDelivery')}</p>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">{t('contacts.social')}</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/knitt_lyelya.ua?igsh=YXNxYmFycHNoam9k"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="https://t.me/+380954440531"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-cream rounded-lg">
              <h3 className="font-semibold mb-2">{t('contacts.schedule')}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{t('contacts.scheduleWeekdays')}</p>
                <p>{t('contacts.scheduleWeekend')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
