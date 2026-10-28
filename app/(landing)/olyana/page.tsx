import type { Metadata } from 'next'
import OlyanaLanding from './OlyanaLanding'

const title = 'Сумка Оляна — в\'язаний шопер з джуту ручної роботи | knitt_lyelya.ua'
const description =
  'Сумка Оляна з колекції Етно: натуральний джут, етнічний орнамент, ручна робота. 2600 грн. Доставка Новою поштою, післяплата або оплата онлайн.'

export const metadata: Metadata = {
  metadataBase: new URL('https://olyana.knittlyelyaua.com'),
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    siteName: 'knitt_lyelya.ua',
    url: '/',
    title: 'Сумка Оляна — ручна робота з натурального джуту',
    description,
    images: [{ url: '/landing/olyana/og.jpg', width: 1200, height: 630, alt: 'Сумка Оляна' }],
  },
}

export default function OlyanaPage() {
  return <OlyanaLanding />
}
