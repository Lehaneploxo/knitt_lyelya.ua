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

    // First update the index
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))

    // Then allow transitions again after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 400)
  }

  const handleNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)

    // First update the index
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))

    // Then allow transitions again after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 400)
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

  // Calculate swipe progress as percentage (-1 to 1)
  const containerWidth = containerRef.current?.offsetWidth || 0
  const swipeProgress = containerWidth > 0 ? touchOffset / containerWidth : 0

  // Determine which images to show during swipe
  const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
  const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1

  return (
    <div
      ref={containerRef}
      className={`${aspectRatio} relative overflow-hidden ${className} select-none`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onImageClick}
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* All images stacked with opacity transitions */}
      {images.map((image, index) => {
        // Calculate opacity based on whether this is the current, prev, or next image
        let opacity = 0

        if (index === currentIndex) {
          // Current image - fade out when swiping
          opacity = 1 - Math.abs(swipeProgress)
        } else if (swipeProgress > 0.05 && index === prevIndex) {
          // Previous image - fade in when swiping left
          opacity = swipeProgress
        } else if (swipeProgress < -0.05 && index === nextIndex) {
          // Next image - fade in when swiping right
          opacity = Math.abs(swipeProgress)
        }

        // Clamp opacity between 0 and 1
        opacity = Math.max(0, Math.min(1, opacity))

        // Only load current image, others are lazy
        const shouldLoad = index === currentIndex

        return (
          <div
            key={`${image}-${index}`}
            className="absolute inset-0"
            style={{
              opacity: isDragging ? opacity : (index === currentIndex ? 1 : 0),
              transition: isDragging ? 'none' : 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: index === currentIndex ? 'auto' : 'none',
              willChange: 'opacity',
              zIndex: index === currentIndex ? 2 : 1,
            }}
          >
            <Image
              src={image}
              alt={`${alt} - ${index + 1}`}
              fill
              className="object-cover"
              sizes={sizes}
              priority={priority && index === 0}
              draggable={false}
              loading={shouldLoad || (priority && index === 0) ? 'eager' : 'lazy'}
              quality={85}
              unoptimized={false}
              onError={(e) => {
                console.error('Image failed to load:', image)
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )
      })}

      {/* Стрелки навигации */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
            disabled={isTransitioning}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7 text-gray-900" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            disabled={isTransitioning}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7 text-gray-900" />
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
