import { type NextRequest, NextResponse } from 'next/server'

import { blockedPaths } from '@/configs/blocked-paths'
import { fakeContent } from './assets/data/content-fake'

const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/perfil',
  '/minha-conta',
  '/reivindicar-empresa',
]

const authRoute = '/acesso'

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProduction = process.env.NODE_ENV === 'production'

  // 1. CSP Dinâmico: Remove unsafe-eval em produção
  const scriptSrc = isProduction
    ? "'self' 'unsafe-inline' https://*.googletagmanager.com https://*.google-analytics.com https://www.google-analytics.com https://www.google.com https://upload-widget.cloudinary.com https://static.cloudflareinsights.com"
    : "'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://*.google-analytics.com https://www.google-analytics.com https://www.google.com https://upload-widget.cloudinary.com https://static.cloudflareinsights.com"

  const securityHeaders = {
    'Content-Security-Policy': [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://*.google-analytics.com https://www.google-analytics.com https://*.googletagmanager.com https://www.google.com https://*.carangoladigital.com.br https://carangoladigital.com.br https://storage.googleapis.com https://firebasestorage.googleapis.com https://*.cloudinary.com https://res.cloudinary.com https://*.tile.openstreetmap.org https://ui-avatars.com https://lh3.googleusercontent.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      // ATENÇÃO: Adicione aqui as APIs externas que seu frontend consome (Firebase, Supabase, APIs de pagamento, etc)
      "connect-src 'self' https://*.google-analytics.com https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.google.com https://*.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://cloudflareinsights.com https://static.cloudflareinsights.com https://upload-widget.cloudinary.com https://*.cloudinary.com",
      'frame-src https://upload-widget.cloudinary.com',
      'worker-src blob:',
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      'upgrade-insecure-requests',
    ].join('; '),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy':
      'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  }

  // O restante da sua lógica de redirecionamento e honeypot permanece igual e excelente.
  const sessionToken =
    request.cookies.get('__session')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value

  // Evitando falha do startsWith (garantindo que bata a rota exata ou o inicio com barra logo após)
  const isProtectedRoute = protectedRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isProtectedRoute && !sessionToken) {
    const url = request.nextUrl.clone()
    url.pathname = authRoute
    if (pathname === authRoute) return NextResponse.next()
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  if (blockedPaths.some(blocked => pathname.startsWith(blocked))) {
    return new NextResponse(fakeContent, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    })
  }

  const response = NextResponse.next()

  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
