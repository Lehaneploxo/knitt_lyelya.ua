'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'ua' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  ua: {
    // Header
    'nav.ethno': 'Етно',
    'nav.basic': 'Базові',
    'nav.home': 'Дім',
    'nav.about': 'Про бренд',
    'nav.contacts': 'Контакти',

    // Common
    'common.addToCart': 'Додати в кошик',
    'common.cart': 'Кошик',
    'common.viewCatalog': 'Переглянути каталог',
    'common.viewAll': 'Дивитись все',
    'common.continueShopping': 'Продовжити покупки',
    'common.checkout': 'Оформити замовлення',

    // Home page
    'home.hero.title': 'Авторські сумки ручної роботи',
    'home.hero.subtitle': 'Поєднання етнічних мотивів та сучасного дизайну',
    'home.newArrivals': 'Нові надходження',
    'home.bestsellers': 'Хіти продажів',
    'home.collections': 'Наші колекції',
  },
  en: {
    // Header
    'nav.ethno': 'Ethno',
    'nav.basic': 'Basic',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.contacts': 'Contacts',

    // Common
    'common.addToCart': 'Add to Cart',
    'common.cart': 'Cart',
    'common.viewCatalog': 'View Catalog',
    'common.viewAll': 'View All',
    'common.continueShopping': 'Continue Shopping',
    'common.checkout': 'Checkout',

    // Home page
    'home.hero.title': 'Handmade Designer Bags',
    'home.hero.subtitle': 'Merging ethnic motifs with modern design',
    'home.newArrivals': 'New Arrivals',
    'home.bestsellers': 'Bestsellers',
    'home.collections': 'Our Collections',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ua')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load language from localStorage
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'ua' || saved === 'en')) {
      setLanguageState(saved)
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
