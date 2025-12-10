import { ProductCard } from './ProductCard'
import { Product } from '@/lib/products'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => {
        // Проверяем что у продукта есть ID и images
        if (!product || !product.id || !product.images || product.images.length === 0) {
          console.warn('Invalid product data:', product)
          return null
        }

        return <ProductCard key={product.id} product={product} />
      })}
    </div>
  )
}
