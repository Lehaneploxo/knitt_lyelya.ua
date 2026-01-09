import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Головна сторінка / Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'banner1',
      title: 'Баннер 1 / Banner 1',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'banner2',
      title: 'Баннер 2 / Banner 2',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'instagramPostUrl',
      title: 'Посилання на Instagram-пост / Instagram Post URL',
      type: 'url',
      description: 'Вставте повне посилання на Instagram-пост',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Налаштування головної сторінки',
      }
    },
  },
})
