'use client'

import { useState } from 'react'
import { Mail, Phone, Instagram, Send, MapPin } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Заповніть всі поля')
      return
    }

    // Simulate sending
    toast.success('Повідомлення надіслано! Ми зв\'яжемось з вами найближчим часом.')
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
          Контакти
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center">
          Зв'яжіться з нами будь-яким зручним способом
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-heading font-semibold mb-6">
              Напишіть нам
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ім'я *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ваше ім'я"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Повідомлення *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ваше повідомлення..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Надіслати повідомлення
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-heading font-semibold mb-6">
              Контактна інформація
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Телефон</h3>
                  <p className="text-gray-600">+380 XX XXX XX XX</p>
                  <p className="text-sm text-gray-500">Пн-Пт: 10:00 - 18:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600">info@knitt-lyelya.ua</p>
                  <p className="text-sm text-gray-500">Відповімо протягом 24 годин</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Адреса</h3>
                  <p className="text-gray-600">м. Київ, Україна</p>
                  <p className="text-sm text-gray-500">Доставка по всій Україні</p>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">Соціальні мережі</h3>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="https://t.me"
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
              <h3 className="font-semibold mb-2">Графік роботи</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Понеділок - П'ятниця: 10:00 - 18:00</p>
                <p>Субота - Неділя: Вихідний</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
