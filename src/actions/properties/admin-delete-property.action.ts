'use server'

import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/app/server/verify-admin.server'
import { db, storage } from '@/lib/firebase'

interface DeleteProps {
  propertyId: string
  ownerId: string
}

export async function adminDeleteProperty({ propertyId, ownerId }: DeleteProps) {
  try {
    await requireAdmin()
  } catch {
    return { success: false, error: 'Não autorizado. Apenas administradores.' }
  }

  try {
    if (!propertyId || !ownerId) {
      throw new Error('Parâmetros ausentes')
    }

    const propertyRef = db
      .collection('properties')
      .doc(ownerId)
      .collection('user_properties')
      .doc(propertyId)

    const docSnap = await propertyRef.get()

    if (!docSnap.exists) {
      throw new Error('Propriedade não encontrada.')
    }

    const propertyData = docSnap.data()
    const imagesToDelete: { path: string; url: string }[] = propertyData?.images

    if (imagesToDelete && imagesToDelete.length > 0) {
      const deletePromises = imagesToDelete.map(image => {
        const imagePath = typeof image === 'string' ? image : image.path
        if (!imagePath) return null

        const file = storage.file(imagePath)

        return file.delete().catch(err => {
          if (err.code === 404 || err.message.includes('No such object')) {
            console.warn(`Imagem não encontrada no storage: ${imagePath}`)
          } else {
            console.error(`Falha ao excluir imagem: ${imagePath}`)
          }
          return null
        })
      })

      await Promise.all(deletePromises)
    }

    await propertyRef.delete()

    revalidatePath('/dashboard/todos-imoveis')

    return { success: true }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Falha ao excluir a propriedade.'

    return { success: false, error: errorMessage }
  }
}
