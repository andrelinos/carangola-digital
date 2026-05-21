import 'server-only'

import { timingSafeEqual } from 'node:crypto'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'

/**
 * Compara dois emails de forma timing-safe para evitar timing attacks.
 * Mesmo que os tamanhos difiram, executa a comparação para não vazar
 * informação via diferença de tempo.
 */
function safeEmailCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)

  if (bufA.length !== bufB.length) {
    // Executa a comparação contra si mesmo para manter tempo constante
    timingSafeEqual(bufA, bufA)
    return false
  }

  return timingSafeEqual(bufA, bufB)
}

/**
 * Guard estrito: lança exceção se o usuário NÃO for o admin.
 * Use em Server Actions e Route Handlers onde o acesso deve ser bloqueado.
 */
export async function requireAdmin(): Promise<true> {
  const adminEmail = process.env.ADMIN_EMAIL

  if (!adminEmail) {
    // Falha fechada: sem configuração, ninguém passa
    throw new Error('[requireAdmin] Variável de ambiente ADMIN_EMAIL não configurada.')
  }

  const session = await getServerSession(authOptions)
  const userEmail = session?.user?.email ?? ''

  if (!safeEmailCompare(userEmail, adminEmail)) {
    throw new Error('Unauthorized')
  }

  return true
}

/**
 * Guard condicional: retorna booleano para uso em renderização condicional.
 * Use em Server Components onde você só quer mostrar/esconder UI de admin.
 */
export async function verifyAdmin(): Promise<boolean> {
  try {
    await requireAdmin()
    return true
  } catch {
    return false
  }
}
