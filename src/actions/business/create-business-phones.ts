'use server'

import { Timestamp } from 'firebase-admin/firestore'

import type { BusinessPhoneProps } from '@/_types/profile-data'
import { authorizeProfileUpdate } from '../_helpers/business.helper'

export async function createBusinessPhones(formData: FormData) {
  try {
    const profileId = formData.get('profileId') as string

    const { profileRef, error } = await authorizeProfileUpdate(profileId)
    if (error) return error

    const phones = formData.get('phones') as string
    const businessPhones = JSON.parse(phones) as BusinessPhoneProps[]

    await profileRef.update({
      businessPhones,
      updatedAt: Timestamp.now().toMillis(),
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar telefones:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}
