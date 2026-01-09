import productsData from '@/data/products.json'

export interface Product {
  id: string
  category: string
  name: {
    ua: string
    en: string
  }
  description: {
    ua: string
    en: string
  }
  price: number
  currency: string
  priceEUR?: number
  images: string[]
  colors?: string[]
  sizes?: string[]
  materials?: string[]
  dimensions?: {
    width?: number
    height?: number
    depth?: number
    diameter?: number
    unit: string
  }
  weight?: number
  quantity?: number
  inStock: boolean
  featured: boolean
  new: boolean
  sku: string
}

// Використовуємо статичний імпорт для всіх даних
function getProductsFromFile(): Product[] {
  return productsData as Product[]
}

export function getAllProducts(): Product[] {
  return getProductsFromFile()
}

export function getProductsByCategory(category: string): Product[] {
  return getProductsFromFile().filter((product) => product.category === category)
}

export function getProductById(id: string): Product | undefined {
  return getProductsFromFile().find((product) => product.id === id)
}

export function getFeaturedProducts(): Product[] {
  return getProductsFromFile().filter((product) => product.featured)
}

export function getNewProducts(): Product[] {
  return getProductsFromFile().filter((product) => product.new).slice(0, 4)
}

export function getProductsInStock(): Product[] {
  return getProductsFromFile().filter((product) => product.inStock)
}
