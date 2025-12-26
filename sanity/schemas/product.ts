import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Товари / Products',
  type: 'document',
  fields: [
    defineField({
      name: 'name_ua',
      title: 'Назва (українською)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name_en',
      title: 'Name (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      options: {
        source: 'name_en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'Артикул / SKU',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Ціна / Price (грн)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'discount',
      title: 'Знижка / Discount (%)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'category',
      title: 'Категорія / Category',
      type: 'string',
      options: {
        list: [
          { title: 'Етно / Ethno', value: 'ethno' },
          { title: 'Базові / Basic', value: 'basic' },
          { title: 'Дім / Home', value: 'home' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description_ua',
      title: 'Опис (українською)',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'description_en',
      title: 'Description (English)',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'images',
      title: 'Фото / Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'materials',
      title: 'Матеріали / Materials',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Джут / Jute', value: 'джут' },
          { title: 'Бавовняний шнур / Cotton cord', value: 'бавовняний шнур' },
          { title: 'Шкіра / Leather', value: 'шкіра' },
          { title: 'Шкіряний шнур / Leather cord', value: 'шкіряний шнур' },
          { title: 'Дерево / Wood', value: 'дерево' },
        ],
      },
    }),
    defineField({
      name: 'colors',
      title: 'Кольори / Colors',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Натуральний / Natural', value: 'натуральний' },
          { title: 'Чорний / Black', value: 'чорний' },
          { title: 'Білий / White', value: 'білий' },
          { title: 'Молочний / Cream', value: 'молочний' },
          { title: 'Бежевий / Beige', value: 'бежевий' },
          { title: 'Коричневий / Brown', value: 'коричневий' },
          { title: 'Мокко / Mocha', value: 'мокко' },
          { title: 'Капучіно / Cappuccino', value: 'капучіно' },
        ],
      },
    }),
    defineField({
      name: 'dimensions',
      title: 'Розміри / Dimensions',
      type: 'object',
      fields: [
        { name: 'height', title: 'Висота / Height (см)', type: 'number' },
        { name: 'width', title: 'Ширина / Width (см)', type: 'number' },
        { name: 'depth', title: 'Глибина / Depth (см)', type: 'number' },
      ],
    }),
    defineField({
      name: 'inStock',
      title: 'В наявності / In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'isNew',
      title: 'Новинка / New',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isBestseller',
      title: 'Хіт продажів / Bestseller',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name_ua',
      subtitle: 'sku',
      media: 'images.0',
    },
  },
})
