'use server'

import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { headers } from 'next/headers'
import { db } from '@/lib/firebase'
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000,
})

export async function registerWhatsappLead({
  profileId,
  ownerId,
}: {
  profileId: string
  ownerId?: string | null
}) {
  if (!profileId) return

  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1'

    // Limita a 5 requisições por IP a cada 1 minuto
    await limiter.check(5, ip)
  } catch (error) {
    console.warn('Rate limit bloqueou clique no WhatsApp para o IP:', error)
    return
  }

  try {
    const profileRef = db.collection('profiles').doc(profileId)

    // Incrementa os cliques de WhatsApp no perfil
    await profileRef.update({
      whatsappClicks: FieldValue.increment(1),
    })

    // Se o perfil tiver um dono, criamos um registro de Lead para ele
    if (ownerId) {
      const leadRef = db.collection('leads').doc()
      await leadRef.set({
        profileId,
        ownerId,
        type: 'whatsapp_click',
        createdAt: Timestamp.now().toDate(),
      })
    }
  } catch (error) {
    console.error('Erro ao registrar clique/lead de WhatsApp:', error)
  }
}
