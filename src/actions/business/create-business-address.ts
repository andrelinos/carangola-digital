'use server'

import { Timestamp } from 'firebase-admin/firestore'

import type { BusinessAddressProps } from '@/_types/profile-data'
import { authorizeProfileUpdate } from '../_helpers/business.helper'

export async function createBusinessAddress(formData: FormData) {
  try {
    const profileId = formData.get('profileId') as string

    const { profileRef, error } = await authorizeProfileUpdate(profileId)
    if (error) return error

    const addressesData = formData.get('addresses') as string
    const businessAddresses = JSON.parse(
      addressesData
    ) as BusinessAddressProps[]

    await profileRef.update({
      businessAddresses,
      updatedAt: Timestamp.now().toMillis(),
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}
