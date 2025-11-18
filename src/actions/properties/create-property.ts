'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { slugify } from '@/utils/generate-slug'
import { revalidatePath } from 'next/cache'

export async function createNewProperty(formData: FormData) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user || !user.id) {
    throw new Error('Não autorizado')
  }

  const userId = user.id

  if (!userId) {
    return {
      success: false,
      message: 'Id de usuário inexistente',
    }
  }

  try {
    const newPropertyJson = formData.get('newProperty') as string | null
    if (!newPropertyJson) {
      throw new Error('Dados do imóvel ausentes.')
    }

    const propertyData = JSON.parse(newPropertyJson)
    const { title } = propertyData

    if (!title || typeof title !== 'string') {
      throw new Error('O título é obrigatório.')
    }

    const normalizedTitle = title
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .trim()

    const keywords = [
      ...new Set([
        ...normalizedTitle.split(' ').filter(term => term.length > 0),
      ]),
    ]

    const newPropertyDoc = {
      ...propertyData,
      ownerId: userId,
      nameLower: normalizedTitle,
      keywords: keywords,
      isPublished: true,
      totalVisits: 0,

      createdAt: Timestamp.now().toMillis(),
      updatedAt: Timestamp.now().toMillis(),
    }

    const slug = slugify(normalizedTitle)

    const docWithSlug = {
      ...newPropertyDoc,
      slug: slug,
    }

    const docRef = await db
      .collection('properties')
      .doc(userId)
      .collection('user_properties')
      .add(docWithSlug)

    await docRef.update({
      id: docRef.id,
    })

    revalidatePath(`/imoveis/${slug}`)
    revalidatePath('/imoveis')

    return { success: true, message: 'Propriedade criada com sucesso!' }
  } catch (error) {
    console.error('Erro ao criar propriedade:', error)
    return { success: false, error: (error as Error).message }
  }
}
