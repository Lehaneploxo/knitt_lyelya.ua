'use client'

import { useState, useEffect, useRef, TouchEvent } from 'react'

const banners = [
  '/images/hero-banner.jpg',
  '/images/hero-banner2.jpg'
]

export default function HeroBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsSwiping(true)

    // Prevent any scroll when touching banner area
    e.preventDefault()

    // Pause auto-rotation during swipe
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const onTouchMove = (e: TouchEvent) => {
    // Always prevent default to block page scroll completely
    e.preventDefault()

    if (!touchStart) return

    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsSwiping(false)
      startAutoRotate() // Resume auto-rotation
      return
    }

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      // Swipe left - next image
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    } else if (isRightSwipe) {
      // Swipe right - previous image
      setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length)
    }

    setIsSwiping(false)
    setTouchStart(null)
    setTouchEnd(null)

    // Resume auto-rotation after swipe
    startAutoRotate()
  }

  return (
    <div
      className="relative w-full overflow-hidden touch-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
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
