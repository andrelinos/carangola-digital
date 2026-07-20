'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { authorizeProfileUpdate } from '../_helpers/business.helper'

/**
 * Persists which address indexes are beacon-active for a given profile.
 *
 * @param profileId  - Firestore document ID of the profile
 * @param activeIndexes - Array of address indexes that should be beacon-active
 */
export async function updateBeaconState(
  profileId: string,
  activeIndexes: number[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const { profileRef, error } = await authorizeProfileUpdate(profileId)
    if (error) return error

    await profileRef.update({
      beaconActiveIndexes: activeIndexes,
      // Keep legacy flag in sync: true when at least one address is active
      isBeaconActive: activeIndexes.length > 0,
      updatedAt: Timestamp.now().toMillis(),
    })

    return { success: true }
  } catch (_err) {
    return { success: false, error: 'Erro interno ao salvar destaque no mapa.' }
  }
}
