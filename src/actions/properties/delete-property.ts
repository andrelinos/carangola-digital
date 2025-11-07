'use server'

import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { db, storage } from '@/lib/firebase'

interface DeleteProps {
  propertyId: string
}

export async function deleteProperty({ propertyId }: DeleteProps) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user?.id) {
    throw new Error('Não autorizado')
  }
  const userId = user.id

  try {
    if (!propertyId) {
      throw new Error('ID da propriedade ausente')
    }

    const propertyRef = db
      .collection('properties')
      .doc(userId)
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
        if (typeof image !== 'string' || !image) return null

        const file = storage.file(image)

        return file.delete().catch(err => {
          if (err.code === 404 || err.message.includes('No such object')) {
            console.warn(`Imagem não encontrada no storage: ${image}`)
          } else {
            console.error(`Falha ao excluir imagem: ${image}`, err)
          }
          return null
        })
      })

      await Promise.all(deletePromises)
    }

    await propertyRef.delete()

    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir propriedade', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Falha ao excluir a propriedade.'

    return { success: false, error: errorMessage }
  }
}
