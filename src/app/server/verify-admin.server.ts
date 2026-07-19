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
  const adminEmailsStr = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL

  if (!adminEmailsStr) {
    // Falha fechada: sem configuração, ninguém passa
    throw new Error(
      '[requireAdmin] Variável de ambiente ADMIN_EMAILS ou ADMIN_EMAIL não configurada.'
    )
  }

  const session = await getServerSession(authOptions)
  const userEmail = session?.user?.email ?? ''

  let adminEmails: string[] = []
  
  try {
    // Tenta fazer o parse caso seja um array JSON como '["email1@a.com", "email2@b.com"]'
    if (adminEmailsStr.trim().startsWith('[')) {
      adminEmails = JSON.parse(adminEmailsStr)
    } else {
      // Caso contrário, assume que é separado por vírgulas
      adminEmails = adminEmailsStr.split(',').map(e => e.trim())
    }
  } catch {
    adminEmails = adminEmailsStr.split(',').map(e => e.trim())
  }

  // Verifica se o email do usuário está na lista de admins
  const isAuthorized = adminEmails.some(adminEmail => 
    safeEmailCompare(userEmail, adminEmail)
  )

  if (!isAuthorized) {
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
