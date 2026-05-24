'use server'

import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { db } from '@/lib/firebase'

export async function registerWhatsappLead({
  profileId,
  ownerId,
}: {
  profileId: string
  ownerId?: string | null
}) {
  if (!profileId) return

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
