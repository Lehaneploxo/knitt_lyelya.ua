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
      {products.map((product, index) => {
        // Проверяем что у продукта есть ID и images
        if (!product || !product.id || !product.images || product.images.length === 0) {
          console.warn('Invalid product data:', product)
          return null
        }

        // Only first 4 products get priority loading (above the fold)
        const priority = index < 4

        return <ProductCard key={product.id} product={product} priority={priority} />
      })}
    </div>
  )
}
