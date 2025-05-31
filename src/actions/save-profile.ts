'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { randomUUID } from 'node:crypto'

import { generateJsonFile } from '@/app/server/generate-json-file'
import { auth } from '@/lib/auth'
import { db, storage } from '@/lib/firebase'

export async function saveProfile(formData: FormData) {
  const session = await auth()

  if (!session) return

  try {
    const profileId = formData.get('profileId') as string
    const yourName = formData.get('yourName') as string
    const yourDescription = formData.get('yourDescription') as string
    const file = formData.get('businessPic') as File

    let imagePath = null

    const hasFile = file && file.size > 0

    if (hasFile) {
      const currentProfile = await db
        .collection('profiles')
        .doc(profileId)
        .get()

      const currentImagePath = currentProfile?.data()?.imagePath

      if (currentImagePath) {
        const currentStorageRef = storage.file(currentImagePath)

        const [exists] = await currentStorageRef.exists()

        if (exists) {
          await currentStorageRef.delete()
        }
      }

      const storageRef = storage.file(
        `profiles-images/${profileId}/${randomUUID()}`
      )

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      await storageRef.save(buffer)

      imagePath = storageRef.name
    }

    const response = await db
      .collection('profiles')
      .doc(profileId)
      .update({
        name: yourName,
        businessDescription: yourDescription,
        ...(hasFile && { imagePath }),
        updatedAt: Timestamp.now().toMillis(),
      })

    if (response.writeTime) {
      generateJsonFile({
        userId: session?.user?.id,
        name: yourName,
        link: profileId,
      })
    }

    return true
  } catch (error) {
    return false
  }
}
