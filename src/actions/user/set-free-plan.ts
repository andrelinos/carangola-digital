'use server'

import { getServerSession } from 'next-auth/next'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
// Importe a instância do banco de dados do seu Firebase Admin SDK.
// O caminho exato pode variar dependendo de como você nomeou o arquivo e a exportação.


export async function setFreePlanAction() {
  const session = await getServerSession(authOptions)

  // Segurança primária via NextAuth garantida
  if (!session?.user?.id) {
    return { error: 'Usuário não autenticado' }
  }

  try {
    // No Firebase Admin, a sintaxe muda para .collection().doc().update()
    const userRef = db.collection('users').doc(session.user.id)

    // Atualiza apenas a categoria de perfis (business) para o plano grátis
    // A notação de ponto (dot notation) funciona perfeitamente aqui também
    await userRef.update({
      'planActive.profiles': {
        expiresAt: null,
        type: 'free',
        status: 'active',
        planDetails: {
          name: 'free',
          period: 'indeterminado',
          price: 0
        },
      }
    })

    revalidatePath('/dashboard/assinatura')
    revalidatePath('/dashboard/business')

    return { success: true }
  } catch (error) {
    console.error('Erro ao configurar plano grátis:', error)
    return { error: 'Ocorreu um erro ao atualizar seu plano. Tente novamente.' }
  }
}