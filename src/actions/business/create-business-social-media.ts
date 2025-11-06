'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { authorizeProfileUpdate } from '../_helpers/business.helper'

export async function createBusinessSocialMedia(formData: FormData) {
  try {
    const profileId = formData.get('profileId') as string

    const { profileRef, error } = await authorizeProfileUpdate(profileId)
    if (error) return error

    const socialMedias = formData.get('socialMedias') as string
    const data = JSON.parse(socialMedias) as {
      name: string
      url: string
    }

    await profileRef.update({
      socialMedias: data,
      updatedAt: Timestamp.now().toMillis(),
    })

    return true
  } catch (error) {
    return false
  }
}
