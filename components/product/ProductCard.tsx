'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useLanguage } from '@/contexts/LanguageContext'
import { toast } from 'sonner'
import { Product } from '@/lib/products'
import { ImageZoom } from '@/components/ui/ImageZoom'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { language } = useLanguage()

  const productName = language === 'ua' ? product.name.ua : product.name.en
  const productDescription = language === 'ua' ? product.description.ua : product.description.en
  const images = product.images || []

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      id: product.id,
      name: productName,
      price: product.price,
      image: images[0] || '',
    })

    toast.success('Товар додано в кошик')
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsZoomOpen(true)
  }

  return (
    <>
      <Link href={`/product/${product.id}`}>
        <div className="group relative bg-white rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
          {/* Image */}
          <div
            className="aspect-[3/4] bg-secondary relative overflow-hidden cursor-zoom-in"
            onClick={handleImageClick}
          >
            {images.length > 0 && (
              <Image
                src={images[currentImageIndex]}
                alt={productName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            )}

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-5 w-5 text-gray-900" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-5 w-5 text-gray-900" />
              </button>

              {/* Image indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {productName}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {productDescription}
          </p>
          <p className="text-xl font-semibold text-primary mb-4">
            {product.price} грн
          </p>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Додати в кошик
          </button>
        </div>
      </div>
    </Link>

    {/* Image Zoom Modal */}
    {isZoomOpen && (
      <ImageZoom
        images={images}
        currentIndex={currentImageIndex}
        onClose={() => setIsZoomOpen(false)}
        alt={productName}
      />
    )}
  </>
  )
}
