import { type NextRequest, NextResponse } from 'next/server'

import { allowedUserAgents } from '@/configs/allowed-user-agents'
import { blockedPaths } from '@/configs/blocked-paths'

import { fakeContent } from './assets/data/content-fake'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction && pathname === '/sitemap.xml') {
    const userAgent = request.headers.get('user-agent') || ''
    const isAllowedUserAgent = allowedUserAgents.some(agent =>
      userAgent.includes(agent)
    )

    if (!isAllowedUserAgent) {
      return new NextResponse(fakeContent, {
        status: 200,
        headers: { 'content-type': 'text/html' },
      })
    }
  }

  if (blockedPaths.some(blocked => pathname.startsWith(blocked))) {
    return new NextResponse(fakeContent, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    })
  }
  return NextResponse.next()
}

export const config = {
  /*
   * Corresponde a todos os caminhos de solicitação, exceto aqueles que começam com:
   * - api (rotas de API)
   * - _next/static (arquivos estáticos)
   * - _next/image (arquivos de otimização de imagem)
   * - favicon.ico (arquivo de favicon)
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
