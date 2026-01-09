import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Налаштування / Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'notificationEmail',
      title: 'Email для сповіщень / Notification Email',
      type: 'string',
      description: 'На цей email будуть надходити повідомлення про нові замовлення',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'adminLogin',
      title: 'Логін адміністратора / Admin Login',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'adminPassword',
      title: 'Пароль адміністратора / Admin Password',
      type: 'string',
      description: 'ВАЖЛИВО: Змініть стандартний пароль після першого входу!',
      validation: (Rule) => Rule.required().min(6),
    }),
  ],
  preview: {
    select: {
      email: 'notificationEmail',
    },
    prepare({ email }) {
      return {
        title: 'Налаштування системи',
        subtitle: `Email: ${email}`,
      }
    },
  },
})
