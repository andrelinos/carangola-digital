'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { getServerSession } from 'next-auth/next'
import { randomUUID } from 'node:crypto'

import { authOptions } from '@/lib/auth'
import { db, storage } from '@/lib/firebase'

async function uploadNewImages(
  files: File[],
  userId: string,
  propertyId: string
): Promise<string[]> {
  if (!files || files.length === 0) {
    return []
  }

  const uploadPromises = files.map(async file => {
    if (file.size === 0) return null

    const storageRef = storage.file(
      `properties-images/${userId}/${propertyId}/gallery/${randomUUID()}`
    )

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await storageRef.save(buffer)

    return storageRef.name
  })

  const results = await Promise.all(uploadPromises)
  return results.filter((path): path is string => path !== null)
}

async function deleteOldImages(paths: string[]) {
  if (!paths || paths.length === 0) {
    return
  }

  const deletePromises = paths.map(async path => {
    try {
      const storageRef = storage.file(path)
      await storageRef.delete()
    } catch (error) {
      console.warn(`Falha ao deletar imagem antiga: ${path}`, error)
    }
  })

  await Promise.all(deletePromises)
}

export async function updatePropertyGallery(formData: FormData) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user?.id) {
    throw new Error('Não autorizado')
  }
  const userId = user.id

  let newImagePaths: string[] = []

  try {
    const propertyId = formData.get('propertyId') as string
    if (!propertyId) {
      throw new Error('ID da propriedade ausente.')
    }

    const newImages = formData.getAll('newImages') as File[]
    const imagesToDeleteJSON = formData.get('imagesToDelete') as string | null

    const imagesToDelete = imagesToDeleteJSON
      ? (JSON.parse(imagesToDeleteJSON) as string[])
      : []

    const [uploadedPaths] = await Promise.all([
      uploadNewImages(newImages, userId, propertyId),
      deleteOldImages(imagesToDelete),
    ])
    newImagePaths = uploadedPaths

    const propertyRef = db
      .collection('properties')
      .doc(userId)
      .collection('user_properties')
      .doc(propertyId)

    await db.runTransaction(async transaction => {
      const docSnap = await transaction.get(propertyRef)
      if (!docSnap.exists) {
        throw new Error('Propriedade não encontrada.')
      }

      const currentImages: string[] = docSnap.data()?.images || []

      const updatedImages = currentImages.filter(
        path => !imagesToDelete.includes(path)
      )

      for (const newPath of newImagePaths) {
        if (!updatedImages.includes(newPath)) {
          updatedImages.push(newPath)
        }
      }

      transaction.update(propertyRef, {
        images: updatedImages,
        updatedAt: Timestamp.now().toMillis(),
      })
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar galeria:', error)

    if (newImagePaths.length > 0) {
      console.warn(
        'Erro na transação. Revertendo uploads de imagens...',
        newImagePaths
      )
      await deleteOldImages(newImagePaths)
    }

    return false
  }
}
