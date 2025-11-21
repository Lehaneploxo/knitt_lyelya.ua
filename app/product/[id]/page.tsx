'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Minus, Plus, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useLanguage } from '@/contexts/LanguageContext'
import { toast } from 'sonner'
import { getProductById } from '@/lib/products'
import { ImageZoom } from '@/components/ui/ImageZoom'

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const product = getProductById(id)
  const { language, t } = useLanguage()

  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'delivery'>('description')

  const addItem = useCartStore((state) => state.addItem)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-heading font-semibold mb-4">{t('product.notFound')}</h1>
        <Link href="/catalog/home" className="text-primary hover:underline">
          {t('product.returnToCatalog')}
        </Link>
      </div>
    )
  }

  const productName = language === 'ua' ? product.name.ua : product.name.en
  const productDescription = language === 'ua' ? product.description.ua : product.description.en
  const images = product.images || []
  const colors = product.colors || []

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: productName,
      price: product.price,
      image: images[0] || '',
    })

    toast.success(`${quantity} ${t('product.addedToCart')}`)
  }

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const incrementQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleImageClick = () => {
    setIsZoomOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-primary">{t('common.home')}</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/catalog/${product.category}`} className="hover:text-primary">
          {t('common.catalog')}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">{productName}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Images */}
        <div>
          {/* Main Image */}
          <div
            className="aspect-[3/4] bg-secondary rounded-2xl mb-4 relative overflow-hidden cursor-zoom-in group"
            onClick={handleImageClick}
          >
            {images.length > 0 && (
              <Image
                src={images[currentImageIndex]}
                alt={productName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevImage()
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-900" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNextImage()
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRightIcon className="h-6 w-6 text-gray-900" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square bg-secondary rounded-lg cursor-pointer hover:opacity-75 transition-opacity relative overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${productName} - ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
            {productName}
          </h1>

          <p className="text-sm text-gray-600 mb-6">
            {t('product.sku')}: {product.sku || product.id.toUpperCase()}
          </p>

          <div className="text-4xl font-semibold text-primary mb-6">
            {product.price} {t('common.currency')}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">{t('product.description')}</h3>
            <p className="text-gray-700 text-base leading-relaxed">
              {productDescription}
            </p>
          </div>

          {/* Color Selection - only if colors exist */}
          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">{t('product.color')}</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color: string) => (
                  <span
                    key={color}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">{t('product.quantity')}</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border-2 border-gray-300 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 py-2 font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-lg mb-4"
          >
            {t('common.addToCart')}
          </button>

          {/* Stock Status */}
          {product.inStock ? (
            <p className="text-sm text-green-600 mb-8">✓ {t('product.inStock')}</p>
          ) : (
            <p className="text-sm text-red-600 mb-8">{t('product.outOfStock')}</p>
          )}

          {/* Tabs */}
          <div className="border-t pt-8">
            <div className="flex space-x-6 border-b mb-6">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-3 font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {t('product.tab.description')}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 font-medium transition-colors ${
                  activeTab === 'specs'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {t('product.tab.specifications')}
              </button>
              <button
                onClick={() => setActiveTab('delivery')}
                className={`pb-3 font-medium transition-colors ${
                  activeTab === 'delivery'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {t('product.tab.delivery')}
              </button>
            </div>

            {activeTab === 'description' && (
              <div className="text-gray-700">
                <p>{productDescription}</p>
                <p className="mt-4">
                  {t('product.handmade.text')}
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-3">
                {product.materials && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{t('product.materials.label')}:</span>
                    <span className="font-medium">{product.materials.join(', ')}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{t('product.dimensions.label')}:</span>
                    <span className="font-medium">
                      {product.dimensions.diameter
                        ? `Ø ${product.dimensions.diameter} ${product.dimensions.unit}`
                        : `${product.dimensions.width} x ${product.dimensions.height} ${product.dimensions.unit}`}
                    </span>
                  </div>
                )}
                {product.quantity && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{t('product.quantity.set')}:</span>
                    <span className="font-medium">{product.quantity} {t('product.quantity.pcs')}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-medium mb-2">{t('product.delivery.ukrposhta.title')}</h4>
                  <p className="text-sm">{t('product.delivery.ukrposhta.text')}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t('product.delivery.novaposhta.title')}</h4>
                  <p className="text-sm">{t('product.delivery.novaposhta.text')}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t('product.delivery.payment.title')}</h4>
                  <p className="text-sm">
                    {t('product.delivery.payment.text')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {isZoomOpen && (
        <ImageZoom
          images={images}
          currentIndex={currentImageIndex}
          onClose={() => setIsZoomOpen(false)}
          alt={productName}
        />
      )}
    </div>
  )
}
