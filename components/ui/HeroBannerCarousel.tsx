'use client'

import { useState, useEffect } from 'react'

const banners = [
  '/images/hero-banner.jpg',
  '/images/hero-banner2.jpg'
]

export default function HeroBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
        setIsTransitioning(false)
      }, 500) // Half of transition duration for crossfade effect
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full overflow-hidden">
      {banners.map((banner, index) => (
        <img
          key={banner}
          src={banner}
          alt={`Hero Banner ${index + 1}`}
          className={`w-full h-auto object-contain transition-opacity duration-1000 ${
            index === 0 ? 'relative' : 'absolute inset-0'
          } ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
