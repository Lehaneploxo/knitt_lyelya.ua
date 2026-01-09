import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutBrand',
  title: 'Про бренд / About Brand',
  type: 'document',
  fields: [
    defineField({
      name: 'content_ua',
      title: 'Текст (українською) / Content (Ukrainian)',
      type: 'text',
      rows: 10,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content_en',
      title: 'Text (English)',
      type: 'text',
      rows: 10,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Контент "Про бренд"',
      }
    },
  },
})
