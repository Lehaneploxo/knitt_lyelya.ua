import Link from 'next/link'
import { Instagram, Facebook, Send } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-white mb-4">
              knitt_lyelya.ua
            </h3>
            <p className="text-sm">
              Авторські сумки ручної роботи. Поєднання етнічних мотивів та сучасного дизайну.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-white mb-4">
              Навігація
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog/ethno" className="text-sm hover:text-primary transition-colors">
                  Етно
                </Link>
              </li>
              <li>
                <Link href="/catalog/basic" className="text-sm hover:text-primary transition-colors">
                  Базові
                </Link>
              </li>
              <li>
                <Link href="/catalog/home" className="text-sm hover:text-primary transition-colors">
                  Для дому
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-primary transition-colors">
                  Про бренд
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contacts */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-white mb-4">
              Контакти
            </h3>
            <ul className="space-y-2 text-sm">
              <li>Телефон: +380 XX XXX XX XX</li>
              <li>Email: info@designerbags.ua</li>
              <li>Пн-Пт: 10:00 - 18:00</li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-white mb-4">
              Соціальні мережі
            </h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Send className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2025 knitt_lyelya.ua. Всі права захищені.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Політика конфіденційності
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Договір оферти
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
