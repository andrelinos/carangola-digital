'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { authorizeProfileUpdate } from '../_helpers/business.helper'

interface OpeningHours {
  opening: string
  closing: string
  closed: boolean
}

export interface DataProps {
  openingHours: OpeningHours
  description: string
}

export async function createBusinessOpeningHours(formData: FormData) {
  try {
    const profileId = formData.get('profileId') as string

    const { profileRef, error } = await authorizeProfileUpdate(profileId)
    if (error) return error

    const openingHoursData = formData.get('openingHours') as string

    const openingHours = JSON.parse(openingHoursData) as OpeningHours[]

    await profileRef.update({
      openingHours,
      updatedAt: Timestamp.now().toMillis(),
    })

    return true
  } catch (error) {
    return false
  }
}
