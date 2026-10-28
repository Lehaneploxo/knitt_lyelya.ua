import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Основний сайт: шапка + футер. Лендинги в app/(landing) живуть без них.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
