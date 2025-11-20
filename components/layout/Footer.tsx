import Link from 'next/link'
import { Instagram, Facebook, Send } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-white mb-4">
              knitt_lyelya.ua
            </h3>
            <p className="text-sm">
              Авторські сумки ручної роботи. Поєднання етнічних мотивів та сучасного дизайну.
            </p>
          </div>

          {/* Column 2: Contacts */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-white mb-4">
              Контакти
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+380954440531" className="hover:text-primary transition-colors">
                  Телефон: +38095 444 0531
                </a>
              </li>
              <li>
                <a href="mailto:knitt.lyelya@gmail.com" className="hover:text-primary transition-colors">
                  Email: knitt.lyelya@gmail.com
                </a>
              </li>
              <li>Пн-Пт: 10:00 - 18:00</li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-white mb-4">
              Соціальні мережі
            </h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/knitt_lyelya.ua?igsh=YXNxYmFycHNoam9k" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://t.me/+380954440531" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
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
