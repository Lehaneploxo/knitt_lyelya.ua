import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Замовлення / Orders',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Номер замовлення / Order Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'customerName',
      title: 'Ім\'я покупця / Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerEmail',
      title: 'Email покупця / Customer Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'customerPhone',
      title: 'Телефон покупця / Customer Phone',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Товари / Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productId', title: 'ID товару', type: 'string' },
            { name: 'name', title: 'Назва', type: 'string' },
            { name: 'quantity', title: 'Кількість', type: 'number' },
            { name: 'price', title: 'Ціна', type: 'number' },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'totalAmount',
      title: 'Загальна сума / Total Amount (грн)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Статус оплати / Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Не оплачено / Not Paid', value: 'not_paid' },
          { title: 'Оплачено / Paid', value: 'paid' },
          { title: 'Часткова оплата / Partial Payment', value: 'partial' },
          { title: 'Обробка / Processing', value: 'processing' },
          { title: 'Помилка / Failed', value: 'failed' },
        ],
      },
      initialValue: 'not_paid',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'monobankInvoiceId',
      title: 'Monobank Invoice ID',
      type: 'string',
      description: 'ID рахунку Monobank',
    }),
    defineField({
      name: 'monobankStatus',
      title: 'Monobank Status',
      type: 'string',
      description: 'Статус платежу від Monobank',
    }),
    defineField({
      name: 'paymentDate',
      title: 'Дата оплати / Payment Date',
      type: 'datetime',
      description: 'Дата успішної оплати',
    }),
    defineField({
      name: 'paymentAmount',
      title: 'Сума оплати / Payment Amount',
      type: 'number',
      description: 'Фактична сума оплати в грн',
    }),
    defineField({
      name: 'paymentCurrency',
      title: 'Валюта оплати / Payment Currency',
      type: 'string',
      description: 'Валюта оплати (UAH)',
    }),
    defineField({
      name: 'deliveryMethod',
      title: 'Спосіб доставки / Delivery Method',
      type: 'string',
    }),
    defineField({
      name: 'deliveryAddress',
      title: 'Адреса доставки / Delivery Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'orderDate',
      title: 'Дата замовлення / Order Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'notes',
      title: 'Примітки / Notes',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      orderNumber: 'orderNumber',
      customerName: 'customerName',
      totalAmount: 'totalAmount',
      paymentStatus: 'paymentStatus',
    },
    prepare({ orderNumber, customerName, totalAmount, paymentStatus }) {
      return {
        title: `Замовлення #${orderNumber}`,
        subtitle: `${customerName} - ${totalAmount} грн - ${
          paymentStatus === 'paid' ? 'Оплачено' : 'Не оплачено'
        }`,
      }
    },
  },
})
