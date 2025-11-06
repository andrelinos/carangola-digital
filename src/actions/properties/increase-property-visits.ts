'use server'

import { FieldValue } from 'firebase-admin/firestore'

import { db } from '@/lib/firebase'

export async function increasePropertyVisits({
  docPath,
}: { docPath?: string }) {
  if (!docPath) return null

  try {
    const propertyRef = db.doc(docPath)

    await propertyRef.update({
      totalVisits: FieldValue.increment(1),
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao incrementar visitas:', docPath, error)
    return null
  }
}
