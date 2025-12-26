import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Queries
export async function getProducts() {
  return client.fetch(`
    *[_type == "product"] | order(_createdAt desc) {
      _id,
      name_ua,
      name_en,
      slug,
      sku,
      price,
      discount,
      category,
      description_ua,
      description_en,
      images,
      materials,
      colors,
      dimensions,
      inStock,
      isNew,
      isBestseller
    }
  `)
}

export async function getProductBySlug(slug: string) {
  return client.fetch(
    `
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      name_ua,
      name_en,
      slug,
      sku,
      price,
      discount,
      category,
      description_ua,
      description_en,
      images,
      materials,
      colors,
      dimensions,
      inStock,
      isNew,
      isBestseller
    }
  `,
    { slug }
  )
}

export async function getProductsByCategory(category: string) {
  return client.fetch(
    `
    *[_type == "product" && category == $category] | order(_createdAt desc) {
      _id,
      name_ua,
      name_en,
      slug,
      sku,
      price,
      discount,
      category,
      images,
      inStock,
      isNew,
      isBestseller
    }
  `,
    { category }
  )
}
