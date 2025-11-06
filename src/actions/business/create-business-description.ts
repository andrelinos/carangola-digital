'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { authorizeProfileUpdate } from '../_helpers/business.helper'

export async function updateBusinessDescription(formData: FormData) {
  try {
    const profileId = formData.get('profileId') as string

    const { profileRef, error } = await authorizeProfileUpdate(profileId)
    if (error) return error

    const businessDescription = formData.get('businessDescription') as string

    await profileRef.update({
      businessDescription,
      updatedAt: Timestamp.now().toMillis(),
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar descrição:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}
