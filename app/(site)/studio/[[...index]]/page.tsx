'use client'

import dynamic from 'next/dynamic'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

// Динамічний імпорт NextStudio
const NextStudio = dynamic(() => import('next-sanity/studio').then(mod => mod.NextStudio), {
  ssr: false,
  loading: () => <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '24px'
  }}>Завантаження Sanity Studio...</div>
})

// Проста схема продукту
const productSchema = {
  name: 'product',
  title: 'Товари / Products',
  type: 'document',
  fields: [
    {
      name: 'name_ua',
      title: 'Назва (українською)',
      type: 'string',
    },
    {
      name: 'name_en',
      title: 'Name (English)',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Ціна / Price (грн)',
      type: 'number',
    },
  ],
}

// Конфігурація Sanity
const config = defineConfig({
  name: 'default',
  title: 'Designer Bags UA Admin',
  projectId: 'alskls9k',
  dataset: 'production',
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [productSchema],
  },
})

export default function StudioPage() {
  return <NextStudio config={config} />
}
