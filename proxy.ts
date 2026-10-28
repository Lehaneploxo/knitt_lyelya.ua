import { NextRequest, NextResponse } from 'next/server'

const MAIN_SITE_URL = 'https://www.knittlyelyaua.com'

// Піддомен лендингу -> сторінка в app/(landing)
const LANDING_SUBDOMAINS: Record<string, string> = {
  olyana: '/olyana',
}

export function proxy(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase()
  const subdomain = host.split('.')[0]
  const landingPath = LANDING_SUBDOMAINS[subdomain]

  if (!landingPath || !host.includes('knittlyelyaua.com')) {
    return NextResponse.next()
  }

  const { pathname, search } = request.nextUrl

  if (pathname === '/') {
    return NextResponse.rewrite(new URL(landingPath + search, request.url))
  }

  if (pathname === landingPath || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Кошик, каталог, товари — на основному домені: кошик зберігається
  // в localStorage, який у кожного домену свій.
  return NextResponse.redirect(MAIN_SITE_URL + pathname + search, 307)
}

export const config = {
  // Статика (_next, файли з розширенням) обробляється без proxy
  matcher: ['/((?!_next/|.*\\.[^/]+$).*)'],
}
