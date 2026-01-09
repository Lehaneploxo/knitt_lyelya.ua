import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, orderId, customerEmail } = body

    if (!amount || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Amount and orderId are required' },
        { status: 400 }
      )
    }

    const monobankToken = process.env.MONOBANK_TOKEN
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    if (!monobankToken) {
      return NextResponse.json(
        { success: false, error: 'Monobank token not configured' },
        { status: 500 }
      )
    }

    const shopName = process.env.SHOP_NAME || 'Knitt Lyelya'

    // Створення invoice в Monobank
    const invoiceData = {
      amount: Math.round(amount * 100), // Конвертуємо в копійки
      ccy: 980, // UAH код валюти
      merchantPaymInfo: {
        reference: orderId,
        destination: `Оплата замовлення в магазині ${shopName}`,
        comment: customerEmail || '',
      },
      redirectUrl: `${baseUrl}/order/success?orderId=${orderId}`,
      webHookUrl: `${baseUrl}/api/payment/webhook`,
      validity: 3600, // 1 година
      paymentType: 'debit',
    }

    const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Token': monobankToken,
      },
      body: JSON.stringify(invoiceData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Monobank API error:', errorData)
      return NextResponse.json(
        { success: false, error: 'Failed to create invoice', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      invoiceId: data.invoiceId,
      pageUrl: data.pageUrl,
    })
  } catch (error) {
    console.error('Error creating Monobank invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
