import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

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
    {
      name: 'images',
      title: 'Фото / Images',
      type: 'array',
      of: [{type: 'image'}],
    },
  ],
}

export default defineConfig({
  name: 'default',
  title: 'Designer Bags UA Admin',
  projectId: 'alskls9k',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [productSchema],
  },
})
