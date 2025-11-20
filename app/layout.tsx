import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'sonner'
import { LanguageProvider } from '@/contexts/LanguageContext'

export const metadata: Metadata = {
  title: 'knitt_lyelya.ua | Авторські сумки ручної роботи',
  description: 'Авторські сумки ручної роботи від knitt_lyelya. Поєднання етнічних мотивів та сучасного дизайну.',
  keywords: 'сумки, ручна робота, в\'язані сумки, етно, базові, аксесуари, knitt lyelya',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body>
        <LanguageProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" richColors />
        </LanguageProvider>
      </body>
    </html>
  )
}
