'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SwipeableImageCarouselProps {
  images: string[]
  alt: string
  aspectRatio?: string
  className?: string
  showArrows?: boolean
  showIndicators?: boolean
  onImageClick?: () => void
  priority?: boolean
  sizes?: string
  currentIndex?: number
  onIndexChange?: (index: number) => void
}

export function SwipeableImageCarousel({
  images,
  alt,
  aspectRatio = 'aspect-[3/4]',
  className = '',
  showArrows = true,
  showIndicators = true,
  onImageClick,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  currentIndex: externalIndex,
  onIndexChange
}: SwipeableImageCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0)

  // Используем внешний индекс если предоставлен, иначе внутренний
  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex

  const setCurrentIndex = (index: number | ((prev: number) => number)) => {
    const newIndex = typeof index === 'function' ? index(currentIndex) : index
    if (onIndexChange) {
      onIndexChange(newIndex)
    } else {
      setInternalIndex(newIndex)
    }
  }
  const [touchStart, setTouchStart] = useState(0)
  const [touchStartTime, setTouchStartTime] = useState(0)
  const [touchOffset, setTouchOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePrev = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setTimeout(() => setIsTransitioning(false), 350)
  }

  const handleNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsTransitioning(false), 350)
  }

  // State for tracking swipe direction
  const [touchStartY, setTouchStartY] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'horizontal' | 'vertical' | null>(null)

  // Native touch event handlers with smart scroll prevention
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStartNative = (e: TouchEvent) => {
      setTouchStart(e.touches[0].clientX)
      setTouchStartY(e.touches[0].clientY)
      setTouchStartTime(Date.now())
      setSwipeDirection(null)
      setIsDragging(true)
    }

    const handleTouchMoveNative = (e: TouchEvent) => {
      if (!isDragging && touchStart === 0) return

      const currentTouchX = e.touches[0].clientX
      const currentTouchY = e.touches[0].clientY
      const diffX = Math.abs(currentTouchX - touchStart)
      const diffY = Math.abs(currentTouchY - touchStartY)

      // Determine swipe direction on first significant movement
      if (swipeDirection === null && (diffX > 10 || diffY > 10)) {
        if (diffX > diffY) {
          // Horizontal swipe detected
          setSwipeDirection('horizontal')
        } else {
          // Vertical swipe detected
          setSwipeDirection('vertical')
        }
      }

      // If horizontal swipe - prevent page scroll and change images
      if (swipeDirection === 'horizontal') {
        e.preventDefault()
        const diff = currentTouchX - touchStart
        setTouchOffset(diff)
      }
      // If vertical swipe - allow page scroll, don't change images
      else if (swipeDirection === 'vertical') {
        // Don't prevent default - allow page scroll
        setTouchOffset(0)
      }
    }

    const handleTouchEndNative = () => {
      if (!isDragging && touchStart === 0) return
      setIsDragging(false)

      // Only change images if it was a horizontal swipe
      if (swipeDirection === 'horizontal') {
        // Динамічний threshold - 25% від ширини контейнера (більш чутливий)
        const containerWidth = container?.offsetWidth || 0
        const threshold = containerWidth * 0.25

        // Velocity detection - швидкість свайпу (пікселі/мс)
        const timeDiff = Date.now() - touchStartTime
        const velocity = Math.abs(touchOffset) / timeDiff

        // Мінімальна дистанція для velocity-based switch - 40px (більш чутливий)
        const minSwipeDistance = 40

        // Швидкий свайп: velocity > 0.4 AND дистанція > 40px (більш чутливий)
        const isFastSwipe = velocity > 0.4 && Math.abs(touchOffset) > minSwipeDistance

        // Звичайний свайп: дистанція > threshold
        const isNormalSwipe = Math.abs(touchOffset) > threshold

        if (isFastSwipe || isNormalSwipe) {
          if (touchOffset > 0) {
            handlePrev()
          } else {
            handleNext()
          }
        }
      }

      setTouchOffset(0)
      setSwipeDirection(null)
    }

    // Add event listeners with passive: false to allow preventDefault
    container.addEventListener('touchstart', handleTouchStartNative, { passive: false })
    container.addEventListener('touchmove', handleTouchMoveNative, { passive: false })
    container.addEventListener('touchend', handleTouchEndNative)

    return () => {
      container.removeEventListener('touchstart', handleTouchStartNative)
      container.removeEventListener('touchmove', handleTouchMoveNative)
      container.removeEventListener('touchend', handleTouchEndNative)
    }
  }, [isDragging, touchStart, touchStartY, touchOffset, touchStartTime, swipeDirection])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setTouchStart(e.clientX)
    setTouchStartTime(Date.now())
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const diff = e.clientX - touchStart
    setTouchOffset(diff)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)

    // Динамічний threshold - 25% від ширини контейнера (більш чутливий)
    const containerWidth = containerRef.current?.offsetWidth || 0
    const threshold = containerWidth * 0.25

    // Velocity detection - швидкість свайпу (пікселі/мс)
    const timeDiff = Date.now() - touchStartTime
    const velocity = Math.abs(touchOffset) / timeDiff

    // Мінімальна дистанція для velocity-based switch - 40px (більш чутливий)
    const minSwipeDistance = 40

    // Швидкий свайп: velocity > 0.4 AND дистанція > 40px (більш чутливий)
    const isFastSwipe = velocity > 0.4 && Math.abs(touchOffset) > minSwipeDistance

    // Звичайний свайп: дистанція > threshold
    const isNormalSwipe = Math.abs(touchOffset) > threshold

    if (isFastSwipe || isNormalSwipe) {
      if (touchOffset > 0) {
        handlePrev()
      } else {
        handleNext()
      }
    }

    setTouchOffset(0)
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp()
    }
  }

  // Вычисляем индексы соседних изображений
  const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
  const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1

  // Calculate base offset - always show 3 images in a row (prev, current, next)
  const containerWidth = containerRef.current?.offsetWidth || 0
  const baseOffset = -containerWidth // Start at -100% to show current image

  return (
    <div
      ref={containerRef}
      className={`${aspectRatio} relative overflow-hidden ${className} select-none`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onImageClick}
    >
      {/* Контейнер для изображений - всегда 3 изображения в ряд */}
      <div
        className="absolute inset-0 flex will-change-transform"
        style={{
          transform: `translateX(${baseOffset + touchOffset}px)`,
          transition: isDragging
            ? 'none'
            : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          width: '300%',
        }}
      >
        {/* Предыдущее изображение */}
        <div className="w-1/3 h-full flex-shrink-0 relative">
          {images.length > 1 && (
            <Image
              src={images[prevIndex]}
              alt={`${alt} - ${prevIndex + 1}`}
              fill
              className="object-cover"
              sizes={sizes}
              draggable={false}
              loading="eager"
            />
          )}
        </div>

        {/* Текущее изображение */}
        <div className="w-1/3 h-full flex-shrink-0 relative">
          {images.length > 0 && (
            <Image
              src={images[currentIndex]}
              alt={`${alt} - ${currentIndex + 1}`}
              fill
              className="object-cover"
              sizes={sizes}
              priority={priority}
              draggable={false}
              loading="eager"
            />
          )}
        </div>

        {/* Следующее изображение */}
        <div className="w-1/3 h-full flex-shrink-0 relative">
          {images.length > 1 && (
            <Image
              src={images[nextIndex]}
              alt={`${alt} - ${nextIndex + 1}`}
              fill
              className="object-cover"
              sizes={sizes}
              draggable={false}
              loading="eager"
            />
          )}
        </div>
      </div>

      {/* Стрелки навигации */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="h-5 w-5 text-gray-900" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="h-5 w-5 text-gray-900" />
          </button>
        </>
      )}

      {/* Индикаторы */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
