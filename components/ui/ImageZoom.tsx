'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { SwipeableImageCarousel } from './SwipeableImageCarousel'

interface ImageZoomProps {
  images: string[]
  currentIndex: number
  onClose: () => void
  alt: string
}

export function ImageZoom({ images, currentIndex, onClose, alt }: ImageZoomProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex)

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Swipeable Image Carousel */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center">
        <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
          <SwipeableImageCarousel
            images={images}
            alt={alt}
            aspectRatio="w-full h-full"
            className=""
            currentIndex={activeIndex}
            onIndexChange={setActiveIndex}
            priority
            sizes="100vw"
            showIndicators={false}
          />
        </div>
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-full text-sm z-10">
          {activeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
