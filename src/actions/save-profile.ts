'use server'

import { randomUUID } from 'node:crypto'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

import { auth } from '@/lib/auth'
import { db, storage } from '@/lib/firebase'
import { generateKeywords } from '@/utils/generate-keywords'

async function handleImageUpload(
  file: File | null,
  currentPath: string | undefined,
  profileId: string,
  folder: 'cover-images' | 'logo-images'
) {
  if (!file || file.size === 0) {
    return null
  }

  if (currentPath) {
    try {
      const oldStorageRef = storage.file(currentPath)
      await oldStorageRef.delete()
    } catch (error) {
      console.warn(`Falha ao deletar imagem antiga: ${currentPath}`, error)
    }
  }

  const storageRef = storage.file(
    `profiles-images/${profileId}/${folder}/${randomUUID()}`
  )
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  await storageRef.save(buffer)

  return storageRef.name
}

export async function saveProfile(formData: FormData) {
  const session = await auth()
  if (!session) {
    throw new Error('Não autorizado')
  }

  try {
    const profileId = formData.get('profileId') as string
    const name = formData.get('name') as string
    const categoriesJSON = formData.get('categories') as string | null
    const categories = categoriesJSON ? JSON.parse(categoriesJSON) : []

    const coverPicValue = formData.get('coverPic') as File
    const logoPicValue = formData.get('logoPic') as File

    const coverPic = coverPicValue instanceof File ? coverPicValue : null
    const logoPic = logoPicValue instanceof File ? logoPicValue : null

    const profileRef = db.collection('profiles').doc(profileId)
    const currentProfileSnap = await profileRef.get()
    const currentData = currentProfileSnap.data()

    const [newCoverPath, newLogoPath] = await Promise.all([
      handleImageUpload(
        coverPic,
        currentData?.coverImagePath || currentData?.imagePath,
        profileId,
        'cover-images'
      ),
      handleImageUpload(
        logoPic,
        currentData?.logoImagePath,
        profileId,
        'logo-images'
      ),
    ])

    const normalizedName = name
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .trim()
    const keywords = [
      ...new Set([...generateKeywords(normalizedName), profileId]),
    ]

    const updateData: { [key: string]: any } = {
      name,
      categories,
      keywords,
      nameLower: normalizedName,
      updatedAt: Timestamp.now().toMillis(),
      imagePath: FieldValue.delete(),
    }

    if (newCoverPath) {
      updateData.coverImagePath = newCoverPath
    }
    if (newLogoPath) {
      updateData.logoImagePath = newLogoPath
    }

    await profileRef.update(updateData)

    return true
  } catch (error) {
    console.error('Erro ao salvar perfil:', error)
    return false
  }
}
