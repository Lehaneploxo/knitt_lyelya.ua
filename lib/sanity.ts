import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Клієнт для читання (публічний доступ, з CDN)
export const client = createClient({
  projectId: 'alskls9k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

// Клієнт для запису (з токеном, без CDN)
export const writeClient = createClient({
  projectId: 'alskls9k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
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

// Home Page
export async function getHomePage() {
  return client.fetch(`
    *[_type == "homePage"][0] {
      _id,
      banner1,
      banner2,
      instagramPostUrl
    }
  `)
}

// About Brand
export async function getAboutBrand() {
  return client.fetch(`
    *[_type == "aboutBrand"][0] {
      _id,
      content_ua,
      content_en
    }
  `)
}

// Orders
export async function getOrders() {
  return client.fetch(`
    *[_type == "order"] | order(orderDate desc) {
      _id,
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      items,
      totalAmount,
      paymentStatus,
      deliveryMethod,
      deliveryAddress,
      orderDate,
      notes
    }
  `)
}

export async function getOrderById(id: string) {
  return client.fetch(
    `
    *[_type == "order" && _id == $id][0] {
      _id,
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      items,
      totalAmount,
      paymentStatus,
      deliveryMethod,
      deliveryAddress,
      orderDate,
      notes
    }
  `,
    { id }
  )
}

// Settings
export async function getSettings() {
  return client.fetch(`
    *[_type == "settings"][0] {
      _id,
      notificationEmail,
      adminLogin,
      adminPassword
    }
  `)
}
