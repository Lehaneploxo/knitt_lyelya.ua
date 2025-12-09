'use client'

import { useState, useEffect, useRef } from 'react'

const banners = [
  '/images/hero-banner.jpg',
  '/images/hero-banner2.jpg'
]

export default function HeroBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in px) to trigger a slide change
  const minSwipeDistance = 50

  // Auto-rotate banners
  const startAutoRotate = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }, 3000)
  }

  useEffect(() => {
    startAutoRotate()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Use native event listeners with passive: false to properly prevent scrolling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      setTouchEnd(null)
      setTouchStart(e.touches[0].clientX)

      // Pause auto-rotation during swipe
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (!touchStart) return
      setTouchEnd(e.touches[0].clientX)
    }

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) {
        startAutoRotate()
        return
      }

      const distance = touchStart - touchEnd
      const isLeftSwipe = distance > minSwipeDistance
      const isRightSwipe = distance < -minSwipeDistance

      if (isLeftSwipe) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
      } else if (isRightSwipe) {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length)
      }

      setTouchStart(null)
      setTouchEnd(null)
      startAutoRotate()
    }

    // Add event listeners with passive: false
    container.addEventListener('touchstart', handleTouchStart as any, { passive: false })
    container.addEventListener('touchmove', handleTouchMove as any, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart as any)
      container.removeEventListener('touchmove', handleTouchMove as any)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [touchStart, touchEnd])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden touch-none"
      style={{ touchAction: 'none' }}
    >
      {banners.map((banner, index) => (
        <img
          key={banner}
          src={banner}
          alt={`Hero Banner ${index + 1}`}
          draggable={false}
          className={`w-full h-auto object-contain transition-opacity duration-1000 select-none ${
            index === 0 ? 'relative' : 'absolute inset-0'
          } ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              startAutoRotate()
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
