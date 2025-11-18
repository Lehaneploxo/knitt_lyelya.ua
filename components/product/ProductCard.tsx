'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })

    toast.success('Товар додано в кошик')
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group relative bg-white rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
        {/* Image */}
        <div className="aspect-[3/4] bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-accent opacity-60"></div>
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <span className="text-sm">Фото товару</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
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
  )
}
