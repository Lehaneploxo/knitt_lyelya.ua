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

export function getAllProducts(): Product[] {
  return productsData as Product[]
}

export function getProductsByCategory(category: string): Product[] {
  return productsData.filter((product) => product.category === category) as Product[]
}

export function getProductById(id: string): Product | undefined {
  return productsData.find((product) => product.id === id) as Product | undefined
}

export function getFeaturedProducts(): Product[] {
  return productsData.filter((product) => product.featured) as Product[]
}

export function getNewProducts(): Product[] {
  return productsData.filter((product) => product.new).slice(0, 4) as Product[]
}

export function getProductsInStock(): Product[] {
  return productsData.filter((product) => product.inStock) as Product[]
}
