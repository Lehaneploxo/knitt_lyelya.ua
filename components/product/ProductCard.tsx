'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useLanguage } from '@/contexts/LanguageContext'
import { toast } from 'sonner'
import { Product } from '@/lib/products'
import { ImageZoom } from '@/components/ui/ImageZoom'
import { SwipeableImageCarousel } from '@/components/ui/SwipeableImageCarousel'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const addItem = useCartStore((state) => state.addItem)
  const { language, t } = useLanguage()

  const productName = language === 'ua' ? product.name.ua : product.name.en
  const productDescription = language === 'ua' ? product.description.ua : product.description.en
  const images = product.images || []

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0] || '',
    })

    toast.success(t('common.addedToCart'))
  }

  const handleImageClick = () => {
    setIsZoomOpen(true)
  }

  return (
    <>
      <Link href={`/product/${product.id}`}>
        <div className="group relative bg-white rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
          {/* Image Carousel */}
          <SwipeableImageCarousel
            images={images}
            alt={productName}
            aspectRatio="aspect-[3/4]"
            className="bg-secondary cursor-zoom-in"
            onImageClick={handleImageClick}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            currentIndex={currentImageIndex}
            onIndexChange={setCurrentImageIndex}
          />

        {/* Info */}
        <div className="p-4">
          <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {productName}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {productDescription}
          </p>
          <div className="mb-4">
            <p className="text-xl font-semibold text-primary">
              {product.price} {t('common.currency')}
            </p>
            {product.priceEUR && (
              <p className="text-sm text-gray-600">
                {product.priceEUR} €
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t('common.addToCart')}
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
