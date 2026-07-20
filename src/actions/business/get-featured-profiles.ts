'use server'

import { unstable_cache } from 'next/cache'
import type { ProfileDataProps } from '@/_types/profile-data'
import { db, getDownloadURLFromPath } from '@/lib/firebase'

export type PublicProfileCardData = {
  id: string
  name: string
  slug: string
  logoImageUrl: string | null
  category: string | null
  openingHours: ProfileDataProps['openingHours']
  holidayExceptions: ProfileDataProps['holidayExceptions']
  isPremium?: boolean
  isVerified?: boolean
  isFeatured?: boolean
  isTopCompanies?: boolean
  featuredStartAt?: number | null
  featuredEndAt?: number | null
  businessAddresses?: ProfileDataProps['businessAddresses']
}

/**
 * Verifica se o momento atual (now) está dentro do range de destaque.
 *
 * Regras:
 *  - isFeatured = true  →  elegível para o filtro de datas
 *  - featuredStartAt ausente / null  →  considera que está ativo (legado sem datas)
 *  - featuredEndAt ausente / null    →  sem data de término = vigência indefinida
 *  - Caso contrário, now >= start  AND  now <= end
 */
function isWithinFeaturedRange(data: FirebaseFirestore.DocumentData): boolean {
  if (!data.isFeatured && !data.isTopCompanies) return false

  const now = Date.now()

  // Sem datas configuradas: legado — considera ativo
  if (data.featuredStartAt == null && data.featuredEndAt == null) return true

  const start: number = data.featuredStartAt ?? 0
  const end: number | null = data.featuredEndAt ?? null

  const afterStart = now >= start
  const beforeEnd = end === null || now <= end

  return afterStart && beforeEnd
}

// Fetch do Firebase altamente otimizado
async function fetchFeaturedFromFirebase(): Promise<PublicProfileCardData[]> {
  // 1. SELECT reduz a quantidade de dados (banda/rede) baixados por documento.
  const fieldsToSelect = [
    'name',
    'slug',
    'logoImagePath',
    'coverImagePath',
    'imagePath',
    'categories',
    'category',
    'openingHours',
    'holidayExceptions',
    'isPremium',
    'isVerified',
    'isFeatured',
    'isTopCompanies',
    'featuredStartAt',
    'featuredEndAt',
    'businessAddresses',
    'createdAt',
  ]

  // 2. Duas queries isoladas — filtramos APENAS docs marcados como destaque,
  //    poupando leituras faturáveis (reads) no Firestore.
  const [featuredSnapshot, topCompaniesSnapshot] = await Promise.all([
    db
      .collection('profiles')
      .where('isPublished', '==', true)
      .where('isFeatured', '==', true)
      .select(...fieldsToSelect)
      .get(),
    db
      .collection('profiles')
      .where('isPublished', '==', true)
      .where('isTopCompanies', '==', true)
      .select(...fieldsToSelect)
      .get(),
  ])

  // 3. Mescla resultados removendo duplicatas (empresa com as 2 flags ativas)
  const mergedDocs = new Map<string, FirebaseFirestore.QueryDocumentSnapshot>()
  for (const doc of featuredSnapshot.docs) {
    mergedDocs.set(doc.id, doc)
  }
  for (const doc of topCompaniesSnapshot.docs) {
    mergedDocs.set(doc.id, doc)
  }

  // 4. Filtra somente empresas dentro do range de vigência de destaque.
  //    Feito em memória: zero custo extra de leituras no Firestore e dispensa
  //    índices compostos adicionais.
  const activeDocs = Array.from(mergedDocs.values()).filter(doc =>
    isWithinFeaturedRange(doc.data())
  )

  // 5. Ordenação in-memory pela data de criação (mais recente primeiro)
  activeDocs.sort((a, b) => {
    const aTime = a.data().createdAt || 0
    const bTime = b.data().createdAt || 0
    return bTime - aTime
  })

  // Limita a exibição caso existam muitas empresas marcadas no admin
  const limitedDocs = activeDocs.slice(0, 50)

  const profiles = await Promise.all(
    limitedDocs.map(async doc => {
      const data = doc.data()

      const imagePath =
        data.logoImagePath || data.coverImagePath || data.imagePath
      const imageUrl = await getDownloadURLFromPath(imagePath)

      return {
        id: doc.id,
        name: data.name || 'Nome não informado',
        slug: data.slug || doc.id,
        logoImageUrl: imageUrl || null,
        openingHours: data.openingHours || {},
        holidayExceptions: data.holidayExceptions || [],
        isPremium: !!data.isPremium,
        isVerified: !!data.isVerified,
        isFeatured: !!data.isFeatured,
        isTopCompanies: !!data.isTopCompanies,
        featuredStartAt: data.featuredStartAt ?? null,
        featuredEndAt: data.featuredEndAt ?? null,
        businessAddresses: data.businessAddresses || [],
        category:
          Array.isArray(data.categories) && data.categories.length > 0
            ? data.categories[0]
            : data.category || null,
      } as PublicProfileCardData
    })
  )

  return profiles
}

// 6. CACHING: dezenas ou centenas de acessos simultâneos geram
//    ZERO leituras extras no Firestore durante o intervalo de revalidação.
//    O cache é invalidado via revalidateTag('featured-profiles') sempre que
//    o admin altera o status de uma empresa.
const getCachedFeaturedProfiles = unstable_cache(
  async () => fetchFeaturedFromFirebase(),
  ['featured-profiles-cache'],
  {
    revalidate: 3600, // Revalida a cada 1 hora (3600 segundos)
    tags: ['featured-profiles'],
  }
)

export async function getFeaturedProfiles(): Promise<PublicProfileCardData[]> {
  try {
    return await getCachedFeaturedProfiles()
  } catch (error: any) {
    console.error('ERRO DO FIREBASE:', error.message)
    throw new Error(`Falha ao buscar perfis em destaque: ${error.message}`)
  }
}
