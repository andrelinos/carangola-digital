'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { randomUUID } from 'node:crypto'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { db, storage, getDownloadURLFromPath } from '@/lib/firebase'

export async function updateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user?.id) {
    throw new Error('Não autorizado')
  }

  try {
    const name = formData.get('name') as string
    const imageFile = formData.get('image') as File | null

    const updateData: { [key: string]: any } = {
      updatedAt: Timestamp.now().toMillis(),
    }

    if (name) {
      updateData.name = name
    }

    if (imageFile && imageFile.size > 0) {
      const currentDoc = await db.collection('users').doc(user.id).get()
      const currentData = currentDoc.data()
      
      // Attempt to delete old image if it's a storage URL we manage
      if (currentData?.imagePath) {
        try {
          const oldStorageRef = storage.file(currentData.imagePath)
          await oldStorageRef.delete()
        } catch (error) {
          console.warn(`Falha ao deletar imagem antiga: ${currentData.imagePath}`, error)
        }
      }

      const newPath = `users-images/${user.id}/${randomUUID()}`
      const storageRef = storage.file(newPath)
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      await storageRef.save(buffer)

      const downloadUrl = await getDownloadURLFromPath(newPath)
      
      updateData.imagePath = newPath
      if (downloadUrl) {
        updateData.image = downloadUrl // NextAuth uses 'image' field for session avatar
      }
    }

    await db.collection('users').doc(user.id).update(updateData)

    return { success: true }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { success: false, error: 'Erro ao atualizar perfil.' }
  }
}
