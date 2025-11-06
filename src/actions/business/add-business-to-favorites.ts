'use server'

import { FieldValue } from 'firebase-admin/firestore'

import { db } from '@/lib/firebase'

export async function toggleBusinessFavorite(
  userId: string,
  profileId: string
) {
  const userRef = db.collection('users').doc(userId)

  const profileRef = db.collection('profiles').doc(profileId)

  await db.runTransaction(async transaction => {
    const userDoc = await transaction.get(userRef)
    const profileDoc = await transaction.get(profileRef)

    if (!profileDoc.exists) {
      throw new Error('Perfil não encontrado.')
    }

    let userFavorites: string[] = []
    if (userDoc.exists) {
      const userData = userDoc.data()
      userFavorites = Array.isArray(userData?.favorites)
        ? userData.favorites
        : []
    }

    if (userFavorites.includes(profileId)) {
      if (userDoc.exists) {
        transaction.update(userRef, {
          favorites: FieldValue.arrayRemove(profileId),
        })
      }
      transaction.update(profileRef, {
        favorites: FieldValue.increment(-1),
      })
    } else {
      if (userDoc.exists) {
        transaction.update(userRef, {
          favorites: FieldValue.arrayUnion(profileId),
        })
      } else {
        transaction.set(userRef, { favorites: [profileId] })
      }
      transaction.update(profileRef, {
        favorites: FieldValue.increment(1),
      })
    }
  })
}
