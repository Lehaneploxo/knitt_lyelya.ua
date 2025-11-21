'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'
import { toast } from 'sonner'
import { useLanguage } from '@/contexts/LanguageContext'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const totalItems = useCartStore((state) => state.getTotalItems())

  const navigation = [
    { name: t('nav.ethno'), href: '/catalog/ethno' },
    { name: t('nav.basic'), href: '/catalog/basic' },
    { name: t('nav.home'), href: '/catalog/home' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contacts'), href: '/contacts' },
  ]

  const handleLanguageChange = () => {
    const newLang = language === 'ua' ? 'en' : 'ua'
    setLanguage(newLang)
    toast.info(t(newLang === 'ua' ? 'header.languageChanged.ua' : 'header.languageChanged.en'))
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-heading font-semibold text-primary">
              knitt_lyelya.ua
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side: Language & Cart */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLanguageChange}
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              {language === 'ua' ? 'UA | EN' : 'EN | UA'}
            </button>

            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-primary transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base font-medium text-gray-700 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
