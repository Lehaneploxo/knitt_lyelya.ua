import { NextRequest, NextResponse } from 'next/server'

const NP_API_URL = 'https://api.novaposhta.ua/v2.0/json/'

export async function POST(request: NextRequest) {
  const apiKey = process.env.NOVA_POSHTA_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Nova Poshta API key not configured' }, { status: 500 })
  }

  const { action, query, cityRef, page = 1 } = await request.json()

  let body: object

  if (action === 'searchCities') {
    body = {
      apiKey,
      modelName: 'Address',
      calledMethod: 'searchSettlements',
      methodProperties: {
        CityName: query || '',
        Limit: 20,
        Page: page,
      },
    }
  } else if (action === 'getWarehouses') {
    body = {
      apiKey,
      modelName: 'AddressGeneral',
      calledMethod: 'getWarehouses',
      methodProperties: {
        CityRef: cityRef || '',
        FindByString: query || '',
        Limit: 100,
        Page: page,
      },
    }
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  try {
    const response = await fetch(NP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch from Nova Poshta API' }, { status: 500 })
  }
}
