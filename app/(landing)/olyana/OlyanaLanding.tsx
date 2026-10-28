'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Gem,
  Gift,
  HandHeart,
  Instagram,
  Leaf,
  Play,
  Send,
  ShieldCheck,
  Truck,
  Wallet,
  X,
  ZoomIn,
} from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'

const PRODUCT = {
  id: 'ethno_018',
  name: 'Сумка Оляна',
  price: 2600,
  category: 'ethno',
}

const BUY_HREF = `/cart?add=${PRODUCT.id}`
const CATALOG_HREF = '/catalog/ethno'
const ASSETS = '/landing/olyana'

type Media = { type: 'video'; src: string; poster: string } | { type: 'image'; src: string }

const MEDIA: Media[] = [
  { type: 'video', src: `${ASSETS}/olyana.mp4`, poster: `${ASSETS}/olyana-poster.jpg` },
  { type: 'image', src: `${ASSETS}/olyana-1-v2.jpg` },
  { type: 'image', src: `${ASSETS}/olyana-2-v2.jpg` },
  { type: 'image', src: `${ASSETS}/olyana-3-v2.jpg` },
]

const HOOKS = [
  'Шукаєте подарунок для подруги, мами, колеги?',
  'Любите яскраві акценти?',
  'Захоплюєтесь етнічними мотивами?',
  'Цінуєте якість і натуральні матеріали?',
]

const SPECS = [
  ['Матеріал', 'джут'],
  ['Колір', 'натуральний джут, червоний, чорний'],
  ['Розміри', '35/38–47/9,5 см'],
  ['Тип', 'шопер'],
  ['Колекція', 'Етно'],
]

const BENEFITS = [
  { icon: Gem, title: 'Якість', text: 'Ретельна робота над кожною деталлю' },
  { icon: Leaf, title: 'Натуральний матеріал', text: 'Джут — екологічне рослинне волокно' },
  { icon: HandHeart, title: 'Ручна робота', text: "Кожну сумку в'яжемо вручну" },
  { icon: Gift, title: 'Гарна ідея для подарунка', text: 'Для подруги, мами чи колеги' },
]

const SERVICE = [
  { icon: Truck, title: 'Доставка Новою поштою', text: 'По всій Україні' },
  { icon: Wallet, title: 'Післяплата', text: 'Оплата при отриманні' },
  { icon: CreditCard, title: 'Оплата онлайн', text: 'Карткою на сайті' },
  { icon: ShieldCheck, title: 'Гарантія якості', text: 'Відповідаємо за кожен виріб' },
]

const OTHER_BAGS = [
  { id: 'ethno_026', name: 'Сумка Мавка', image: `${ASSETS}/mavka.jpg` },
  { id: 'ethno_016', name: 'Сумка Лада', image: `${ASSETS}/lada.jpg` },
  { id: 'ethno_017', name: 'Сумка Рада', image: `${ASSETS}/rada.jpg` },
  { id: 'ethno_019', name: 'Сумка Килина', image: `${ASSETS}/kylyna.jpg` },
]

// Скріншоти реальних відгуків з Instagram (public/landing/olyana/reviews/).
// Порожній масив — блок відгуків не показується.
const REVIEWS: { src: string; alt: string }[] = [
  { src: `${ASSETS}/reviews/otzyv-6.jpg`, alt: 'Відгук: сумочка неймовірна, я в захваті, чудовий подарунок собі на день народження' },
  { src: `${ASSETS}/reviews/otzyv-4.jpg`, alt: 'Відгук: забрала посилочку, сумочка неймовірна, покажу в Європі' },
  { src: `${ASSETS}/reviews/otzyv-3.jpg`, alt: 'Відгук: це не сумка, а суцільне задоволення від якості та фасону' },
  { src: `${ASSETS}/reviews/otzyv-2.jpg`, alt: 'Відгук: отримала сумку, вона дуже гарна і зручна' },
  { src: `${ASSETS}/reviews/otzyv-1.jpg`, alt: 'Відгук: дякую за таку чудову сумку, вона дуже зручна' },
  { src: `${ASSETS}/reviews/otzyv-5.jpg`, alt: 'Відгук: дякую за роботу, бажаю творчого натхнення' },
]
const REVIEW_SIZE = { width: 900, height: 1599 }

// Інлайн, бо globals.css перефарбовує .font-heading у коричневий
const PRICE_COLOR = '#B88A5E'

// Нерозривні пробіли: ціна не переноситься на вузьких екранах
const formatPrice = (value: number) =>
  `${value.toLocaleString('uk-UA').replace(/\s/g, ' ')} грн`

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

function pushEcommerce(event: string) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event,
    ecommerce: {
      currency: 'UAH',
      value: PRODUCT.price,
      items: [
        {
          item_id: PRODUCT.id,
          item_name: PRODUCT.name,
          item_category: PRODUCT.category,
          price: PRODUCT.price,
          quantity: 1,
        },
      ],
    },
  })
}

// Переносимо utm-мітки реклами на сайт, щоб замовлення прив'язувалось до кампанії
function withUtm(event: MouseEvent<HTMLAnchorElement>) {
  const link = event.currentTarget
  const url = new URL(link.href)
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (key.startsWith('utm_') || key === 'fbclid' || key === 'gclid') {
      url.searchParams.set(key, value)
    }
  })
  link.href = url.toString()
}

function BuyButton({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  return (
    <a
      href={BUY_HREF}
      onClick={(e) => {
        withUtm(e)
        pushEcommerce('add_to_cart')
      }}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-dark font-semibold uppercase text-white ${
        compact ? 'px-4 py-3 text-base tracking-[0.12em] min-[360px]:px-6' : 'px-8 py-4 text-lg tracking-[0.2em]'
      } shadow-lg shadow-primary-dark/30 transition-colors hover:bg-[#9C7148] active:scale-[0.99] ${className}`}
    >
      Купити
      <ArrowRight className="h-5 w-5" />
    </a>
  )
}

// Тонкий орнамент у кольорах сумки — розділювач між блоками
function Ornament() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-3 py-2">
      <span className="h-px w-16 bg-gray-300" />
      <svg width="64" height="12" viewBox="0 0 64 12">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={6 + i * 13}
            y={2}
            width={6}
            height={6}
            transform={`rotate(45 ${9 + i * 13} 5)`}
            fill={i % 2 === 0 ? '#A3302A' : '#3E2723'}
          />
        ))}
      </svg>
      <span className="h-px w-16 bg-gray-300" />
    </div>
  )
}

// Стрічка відгуків: свайп/стрілки, крапки-індикатори, перегляд на весь екран
function ReviewsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [opened, setOpened] = useState<number | null>(null)
  const touchX = useRef<number | null>(null)

  const onScroll = () => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[0] as HTMLElement | undefined
    const step = card ? card.offsetWidth + 16 : track.clientWidth
    const end = track.scrollLeft + track.clientWidth > track.scrollWidth - 8
    setCurrent(end ? REVIEWS.length - 1 : Math.round(track.scrollLeft / step))
    setAtStart(track.scrollLeft < 8)
    setAtEnd(end)
  }

  useEffect(() => {
    onScroll()
    window.addEventListener('resize', onScroll)
    return () => window.removeEventListener('resize', onScroll)
  }, [])

  const scrollToCard = (index: number) => {
    const card = trackRef.current?.children[index] as HTMLElement | undefined
    if (!card || !trackRef.current) return
    trackRef.current.scrollTo({ left: card.offsetLeft - trackRef.current.offsetLeft, behavior: 'smooth' })
  }

  const scrollByPage = (dir: 1 | -1) => {
    const track = trackRef.current
    if (track) track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' })
  }

  const step = (dir: 1 | -1) =>
    setOpened((i) => (i === null ? i : (i + dir + REVIEWS.length) % REVIEWS.length))

  // Клавіатура та блокування прокрутки сторінки під час перегляду
  useEffect(() => {
    if (opened === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpened(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [opened])

  const arrowClass =
    'absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-primary-dark shadow-lg ring-1 ring-gray-200 transition hover:bg-primary-dark hover:text-white disabled:pointer-events-none disabled:opacity-0 md:flex'

  return (
    <>
      <div className="relative mt-8">
        <button type="button" onClick={() => scrollByPage(-1)} disabled={atStart} aria-label="Попередні відгуки" className={arrowClass} style={{ left: -12 }}>
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:scroll-px-0 md:px-0"
        >
          {REVIEWS.map((review, i) => (
            <button
              key={review.src}
              type="button"
              onClick={() => {
                setOpened(i)
                window.dataLayer?.push({ event: 'landing_review_open', review_index: i + 1 })
              }}
              aria-label={`Відкрити відгук ${i + 1} з ${REVIEWS.length}`}
              className="group relative w-[68%] shrink-0 snap-start overflow-hidden rounded-2xl border border-gray-200 bg-secondary shadow-card transition-shadow hover:shadow-lg sm:w-[42%] md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]"
            >
              <img
                src={review.src}
                alt={review.alt}
                {...REVIEW_SIZE}
                loading="lazy"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary-dark shadow-md transition group-hover:bg-primary-dark group-hover:text-white">
                <ZoomIn className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
        <button type="button" onClick={() => scrollByPage(1)} disabled={atEnd} aria-label="Наступні відгуки" className={arrowClass} style={{ right: -12 }}>
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {REVIEWS.map((review, i) => (
          <button
            key={review.src}
            type="button"
            onClick={() => scrollToCard(i)}
            aria-label={`Відгук ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === current ? 'w-6 bg-primary-dark' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
          />
        ))}
      </div>
      <p className="mt-3 text-center text-sm text-gray-500">
        Гортайте, щоб побачити всі {REVIEWS.length} відгуків · натисніть, щоб збільшити
      </p>

      {opened !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Перегляд відгуку"
          onClick={() => setOpened(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
            touchX.current = null
          }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        >
          <img
            key={REVIEWS[opened].src}
            src={REVIEWS[opened].src}
            alt={REVIEWS[opened].alt}
            {...REVIEW_SIZE}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[calc(100dvh-6rem)] w-auto max-w-full rounded-xl object-contain shadow-2xl"
          />
          <span className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
            {opened + 1} / {REVIEWS.length}
          </span>
          <button type="button" onClick={() => setOpened(null)} aria-label="Закрити" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25">
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              step(-1)
            }}
            aria-label="Попередній відгук"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 md:left-6 md:h-14 md:w-14"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              step(1)
            }}
            aria-label="Наступний відгук"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 md:right-6 md:h-14 md:w-14"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      )}
    </>
  )
}

export default function OlyanaLanding() {
  const [active, setActive] = useState(0)
  const [showSticky, setShowSticky] = useState(false)
  const heroCtaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    pushEcommerce('view_item')
  }, [])

  // Плаваюча кнопка на мобільному, коли основна кнопка не в полі зору
  useEffect(() => {
    const target = heroCtaRef.current
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting))
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const media = MEDIA[active]

  return (
    <div className="bg-cream">
      {/* Логотип без навігації — у лендингу одна ціль */}
      <header className="border-b border-gray-200/70 bg-white/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="font-heading text-xl text-primary">knitt_lyelya.ua</span>
          <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Ручна робота</span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-6 md:grid-cols-2 md:gap-12 md:py-8">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary shadow-lg md:aspect-auto md:h-[min(68vh,620px)]">
            {media.type === 'video' ? (
              <video
                key={media.src}
                src={media.src}
                poster={media.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="h-full w-full object-cover"
                aria-label="Відео: сумка Оляна"
              />
            ) : (
              <Image
                src={media.src}
                alt="Сумка Оляна"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-3 md:mx-auto md:max-w-sm">
            {MEDIA.map((item, index) => (
              <button
                key={item.src}
                onClick={() => setActive(index)}
                aria-label={item.type === 'video' ? 'Відео' : `Фото ${index}`}
                className={`relative aspect-square overflow-hidden rounded-lg bg-secondary transition-opacity ${
                  index === active ? 'ring-2 ring-primary-dark ring-offset-2 ring-offset-cream' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={item.type === 'video' ? item.poster : item.src}
                  alt=""
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
                {item.type === 'video' && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="h-6 w-6 fill-white text-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <ul className="space-y-2 md:space-y-1.5">
            {HOOKS.map((hook) => (
              <li key={hook} className="flex items-start gap-3 text-base text-gray-700">
                <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-[#A3302A]" />
                {hook}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-gray-500">Пропонуємо:</p>
          <h1 className="mt-1 font-heading text-4xl md:text-5xl">{PRODUCT.name}</h1>
          <p className="mt-2 text-gray-600">
            В&apos;язаний шопер з натурального джуту з етнічним орнаментом. Ручна робота.
          </p>
          <p className="mt-3 font-heading text-4xl" style={{ color: PRICE_COLOR }}>{formatPrice(PRODUCT.price)}</p>

          <dl className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
            {SPECS.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-2 text-sm md:text-base">
                <dt className="text-gray-500">{label}</dt>
                <dd className="text-right text-gray-800">{value}</dd>
              </div>
            ))}
          </dl>

          <div ref={heroCtaRef} className="mt-6">
            <BuyButton className="w-full" />
            <p className="mt-3 text-center text-sm text-gray-500">
              Доставка Новою поштою · Післяплата або оплата онлайн
            </p>
          </div>
        </div>
      </section>

      <Ornament />

      {/* Переваги */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-center font-heading text-3xl md:text-4xl">Чому обирають цю сумку</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-white p-5 text-center shadow-card md:p-6">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Icon className="h-6 w-6 text-primary-dark" />
              </span>
              <h3 className="mt-4 font-heading text-lg md:text-xl">{title}</h3>
              <p className="mt-1 text-sm text-gray-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Доставка та оплата */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 className="text-center font-heading text-3xl md:text-4xl">Доставка та оплата</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {SERVICE.map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <Icon className="mx-auto h-8 w-8 text-primary-dark" strokeWidth={1.5} />
                <h3 className="mt-3 font-heading text-lg">{title}</h3>
                <p className="mt-1 text-sm text-gray-500">{text}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 flex max-w-md flex-col items-center rounded-2xl bg-cream p-6 text-center">
            <p className="font-heading text-2xl">{PRODUCT.name}</p>
            <p className="mt-1 font-heading text-3xl" style={{ color: PRICE_COLOR }}>{formatPrice(PRODUCT.price)}</p>
            <BuyButton className="mt-4 w-full" />
          </div>
        </div>
      </section>

      {/* Інші моделі */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-center font-heading text-3xl md:text-4xl">Інші сумки колекції Етно</h2>
        <p className="mt-2 text-center text-gray-500">Кожна — з власним орнаментом</p>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {OTHER_BAGS.map((bag) => (
            <a
              key={bag.id}
              href={`/product/${bag.id}`}
              onClick={(e) => {
                withUtm(e)
                window.dataLayer?.push({ event: 'landing_other_bag', item_id: bag.id })
              }}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary shadow-card">
                <Image
                  src={bag.image}
                  alt={bag.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 text-center text-gray-700 group-hover:text-primary-dark">{bag.name}</p>
            </a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href={CATALOG_HREF}
            onClick={(e) => {
              withUtm(e)
              window.dataLayer?.push({ event: 'landing_catalog_click' })
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary-dark px-8 py-4 text-base uppercase tracking-[0.15em] text-primary-dark transition-colors hover:bg-primary-dark hover:text-white"
          >
            Обрати інші варіанти
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Відгуки */}
      {REVIEWS.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <h2 className="text-center font-heading text-3xl md:text-4xl">Відгуки наших клієнтів</h2>
            <ReviewsCarousel />
          </div>
        </section>
      )}

      <footer className="bg-gray-900 text-gray-300">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 pb-28 pt-10 text-center text-sm md:pb-10">
          <span className="font-heading text-xl text-white">knitt_lyelya.ua</span>
          <a href="tel:+380954440531" className="hover:text-primary">+38095 444 0531</a>
          <div className="flex gap-5">
            <a href="https://www.instagram.com/knitt_lyelya.ua" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="https://t.me/+380954440531" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="hover:text-primary">
              <Send className="h-6 w-6" />
            </a>
            <a href="https://wa.me/380954440531" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-primary">
              <WhatsAppIcon className="h-6 w-6" />
            </a>
          </div>
          <a href="https://www.knittlyelyaua.com" className="text-gray-400 underline-offset-4 hover:text-primary hover:underline">
            Перейти на сайт
          </a>
          <p className="text-gray-500">&copy; {new Date().getFullYear()} knitt_lyelya.ua</p>
        </div>
      </footer>

      {/* Плаваюча кнопка для мобільних */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur transition-transform duration-300 md:hidden ${
          showSticky ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-base">{PRODUCT.name}</p>
            <p className="whitespace-nowrap font-heading text-lg" style={{ color: PRICE_COLOR }}>{formatPrice(PRODUCT.price)}</p>
          </div>
          <BuyButton compact className="shrink-0" />
        </div>
      </div>
    </div>
  )
}
