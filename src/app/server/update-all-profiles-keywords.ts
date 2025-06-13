import { db } from '@/lib/firebase'

function generateKeywords(name: string): string[] {
  const normalizedString: string = name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()

  return normalizedString.split(/\s+/)
}

export async function updateAllProfilesKeywords(): Promise<void> {
  try {
    const profilesSnapshot = await db.collection('profiles').get()

    const BATCH_LIMIT = 500
    let batch = db.batch()
    let operationCounter = 0
    const batches: Promise<FirebaseFirestore.WriteResult[]>[] = []

    for (const doc of profilesSnapshot.docs) {
      const data = doc.data()

      if (typeof data?.name === 'string') {
        const keywords = generateKeywords(data.name)
        batch.update(doc.ref, { keywords })
        operationCounter++

        if (operationCounter === BATCH_LIMIT) {
          batches.push(batch.commit())
          batch = db.batch()
          operationCounter = 0
        }
      }
    }

    if (operationCounter > 0) {
      batches.push(batch.commit())
    }

    await Promise.all(batches)
    console.info('Atualização de keywords concluída com sucesso!')
  } catch (error) {
    console.error('Erro ao atualizar keywords:', error)
  }
}

// updateAllProfilesKeywords();
