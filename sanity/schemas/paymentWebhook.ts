import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'paymentWebhook',
  title: 'Payment Webhooks',
  type: 'document',
  fields: [
    defineField({
      name: 'invoiceId',
      title: 'Invoice ID',
      type: 'string',
      description: 'Monobank Invoice ID',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Payment status from webhook',
    }),
    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'number',
      description: 'Payment amount in UAH',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      description: 'Payment currency',
    }),
    defineField({
      name: 'reference',
      title: 'Reference',
      type: 'string',
      description: 'Order reference/number',
    }),
    defineField({
      name: 'receivedAt',
      title: 'Received At',
      type: 'datetime',
      description: 'When webhook was received',
    }),
    defineField({
      name: 'rawData',
      title: 'Raw Data',
      type: 'object',
      description: 'Complete webhook payload',
      fields: [],
    }),
  ],
  preview: {
    select: {
      invoiceId: 'invoiceId',
      status: 'status',
      amount: 'amount',
      receivedAt: 'receivedAt',
    },
    prepare({ invoiceId, status, amount, receivedAt }) {
      return {
        title: `Webhook ${invoiceId || 'Unknown'}`,
        subtitle: `${status} - ${amount || 0} UAH - ${new Date(receivedAt).toLocaleString()}`,
      }
    },
  },
})
