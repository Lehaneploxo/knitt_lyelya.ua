import { NextRequest, NextResponse } from 'next/server'

const MEEST_API = 'https://api.meest.com/v3.0/openAPI'
const MEEST_LOGIN = process.env.MEEST_LOGIN
const MEEST_PASSWORD = process.env.MEEST_PASSWORD

function transliterate(text: string): string {
  const map: Record<string, string> = {
    '\u0410': 'A', '\u0430': 'a',
    '\u0411': 'B', '\u0431': 'b',
    '\u0412': 'V', '\u0432': 'v',
    '\u0413': 'H', '\u0433': 'h',
    '\u0490': 'G', '\u0491': 'g',
    '\u0414': 'D', '\u0434': 'd',
    '\u0415': 'E', '\u0435': 'e',
    '\u0404': 'Ye', '\u0454': 'ye',
    '\u0416': 'Zh', '\u0436': 'zh',
    '\u0417': 'Z', '\u0437': 'z',
    '\u0418': 'Y', '\u0438': 'y',
    '\u0406': 'I', '\u0456': 'i',
    '\u0407': 'I', '\u0457': 'i',
    '\u0419': 'I', '\u0439': 'i',
    '\u041a': 'K', '\u043a': 'k',
    '\u041b': 'L', '\u043b': 'l',
    '\u041c': 'M', '\u043c': 'm',
    '\u041d': 'N', '\u043d': 'n',
    '\u041e': 'O', '\u043e': 'o',
    '\u041f': 'P', '\u043f': 'p',
    '\u0420': 'R', '\u0440': 'r',
    '\u0421': 'S', '\u0441': 's',
    '\u0422': 'T', '\u0442': 't',
    '\u0423': 'U', '\u0443': 'u',
    '\u0424': 'F', '\u0444': 'f',
    '\u0425': 'Kh', '\u0445': 'kh',
    '\u0426': 'Ts', '\u0446': 'ts',
    '\u0427': 'Ch', '\u0447': 'ch',
    '\u0428': 'Sh', '\u0448': 'sh',
    '\u0429': 'Shch', '\u0449': 'shch',
    '\u042c': '', '\u044c': '',
    '\u042e': 'Yu', '\u044e': 'yu',
    '\u042f': 'Ya', '\u044f': 'ya',
  }
  return text.split('').map((ch) => (map[ch] !== undefined ? map[ch] : ch)).join('')
}

// Токен Meest живе 24 години (expiresIn) - кешуємо в пам'яті процесу,
// щоб не логінитись заново на кожен запит користувача
let cachedToken: { token: string; expiresAt: number } | null = null

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  const res = await fetch(`${MEEST_API}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: MEEST_LOGIN?.trim(), password: MEEST_PASSWORD?.trim() }),
  })
  const data = await res.json()
  if (data.status !== 'OK') throw new Error(`Meest auth failed: ${JSON.stringify(data)}`)

  const expiresInSec = Number(data.result.expiresIn) || 3600
  cachedToken = {
    token: data.result.token,
    expiresAt: Date.now() + Math.max(expiresInSec - 300, 60) * 1000,
  }
  return cachedToken.token
}

// Виконує запит до Meest; якщо кешований токен раптом виявився недійсним
// (Meest міг відкликати його достроково), скидає кеш і пробує ще раз з новим
async function meestFetch(path: string, body: unknown): Promise<Record<string, unknown>> {
  const token = await getToken()
  const res = await fetch(`${MEEST_API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', token },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (data.status !== 'OK' && cachedToken) {
    cachedToken = null
    const retryToken = await getToken()
    const retryRes = await fetch(`${MEEST_API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token: retryToken },
      body: JSON.stringify(body),
    })
    return retryRes.json()
  }
  return data
}

export async function POST(request: NextRequest) {
  if (!MEEST_LOGIN || !MEEST_PASSWORD) {
    return NextResponse.json({ error: 'Meest credentials not configured' }, { status: 500 })
  }

  const { action, query, cityId } = await request.json()

  try {
    if (action === 'searchCities') {
      const searchQuery = transliterate(query || '') + '%'

      const data = await meestFetch('/citySearch', {
        isDirectory: true,
        filters: { cityDescr: searchQuery },
      })
      const cities = ((data.result as Record<string, unknown>[]) || []).map((c) => ({
        cityID: c.cityID,
        name: (c.cityDescr as Record<string, string>)?.descrUA || (c.cityDescr as Record<string, string>)?.descrLoc || '',
        region: (c.regionDescr as Record<string, string>)?.descrUA || '',
      }))
      return NextResponse.json({ cities })
    }

    if (action === 'getBranches') {
      const data = await meestFetch('/branchSearch', {
        filters: { cityID: cityId },
      })
      const branches = ((data.result as Record<string, unknown>[]) || []).map((b) => ({
        branchID: b.branchID,
        num: b.branchNumber || b.branchNo,
        address: b.ShortName || (b.branchDescr as Record<string, string>)?.descrUA || '',
        schedule: b.workingHours || '',
      }))
      return NextResponse.json({ branches })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('Meest API error:', msg)
    return NextResponse.json({ error: 'Failed to fetch from Meest API' }, { status: 500 })
  }
}
