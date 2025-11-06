'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

interface Props {
  propertyId: string
  propertyDocPath: string
  actionDescription?: string
  actionContactPhone?: string
  actionContactWhatsApp?: string
  actionContactSocial?: string
  actionContactEmail?: string
}

export async function propertyUpdateActionCard({
  propertyId,
  propertyDocPath = '',
  actionDescription = '',
  actionContactPhone = '',
  actionContactWhatsApp = '',
  actionContactSocial = '',
  actionContactEmail = '',
}: Props) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user?.id || !propertyDocPath) {
    throw new Error('Não autorizado')
  }

  if (
    actionDescription?.trim() ||
    actionContactPhone?.trim() ||
    actionContactWhatsApp?.trim() ||
    actionContactSocial?.trim() ||
    actionContactEmail?.trim()
  ) {
    try {
      const propertyRef = db.doc(propertyDocPath)

      await propertyRef.update({
        actionDescription,
        actionContactPhone,
        actionContactWhatsApp,
        actionContactSocial,
        actionContactEmail,
        updatedAt: Timestamp.now().toMillis(),
      })

      return { success: true }
    } catch (error) {
      console.error('Erro ao atualizar dados', error)

      return null
    }
  }

  throw new Error('Parâmetros ausentes')
}
