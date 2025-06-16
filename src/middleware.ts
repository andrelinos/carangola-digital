// middleware.ts
import { blockedPaths } from '@/assets/data/blocked-paths'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { allowedUserAgents } from './assets/data/allowed-user-agents'
import { fakeContent } from './assets/data/content-fake'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/sitemap.xml') {
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

  // Se o caminho da URL iniciar com algum dos padrões bloqueados, retorna 404 ou redireciona para uma página segura.
  if (blockedPaths.some(blocked => pathname.startsWith(blocked))) {
    return new NextResponse(fakeContent, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    })
  }
  return NextResponse.next()
}

// Configura o matcher para que o middleware seja executado para todas as rotas (exceto as da API, se preferir)
export const config = {
  matcher: '/:path*',
}
