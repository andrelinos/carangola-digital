// middleware.ts
import { blockedPaths } from '@/assets/data/blocked-paths'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Se o caminho da URL iniciar com algum dos padrões bloqueados, retorna 404 ou redireciona para uma página segura.
  if (blockedPaths.some(blocked => pathname.startsWith(blocked))) {
    const fakeContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ops! Página não encontrada</title>
          <style>
            body {
              font-family: sans-serif;
              background-color: #fdfdfd;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              text-align: center;
              border: 1px solid #eee;
              border-radius: 4px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 {
              font-size: 2rem;
              margin-bottom: 1rem;
            }
            p {
              font-size: 1rem;
              margin-bottom: 1.5rem;
            }
            a {
              text-decoration: none;
              color: #0070f3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Ops! Página não encontrada</h1>
            <p>Desculpe, o recurso que você está procurando não pôde ser localizado.</p>

          </div>
        </body>
      </html>`
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
