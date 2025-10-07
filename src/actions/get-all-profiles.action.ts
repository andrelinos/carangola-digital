'use server'

// import type { ProfileDataProps } from '@/_types/profile-data'
// import { verifyAdmin } from '@/app/server/verify-admin.server'
// import { db } from '@/lib/firebase'

// import { QueryDocumentSnapshot } from 'firebase-admin/firestore'

// interface GetProfilesParams {
//   pageSize?: number
//   startAfterTimestamp?: number | null
// }

// interface GetProfilesResult {
//   profiles: ProfileDataProps[]
//   lastVisibleTimestamp: number | null
// }

// export async function getProfilesWithPagination({
//   pageSize = 10,
//   startAfterTimestamp = null,
// }: GetProfilesParams): Promise<GetProfilesResult> {
//   try {
//     await verifyAdmin()

//     let query = db
//       .collection('profiles')
//       .orderBy('createdAt', 'desc')
//       .limit(pageSize)

//     // Se 'startAfterTimestamp' for fornecido, começamos a busca a partir dele
//     if (startAfterTimestamp) {
//       query = query.startAfter(startAfterTimestamp)
//     }

//     const snapshot = await query.get()

//     const profiles = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...(doc.data() as Omit<ProfileDataProps, 'id'>),
//     }))

//     // Pega o timestamp do último documento para a próxima página
//     const lastDoc = snapshot.docs[snapshot.docs.length - 1]
//     const lastVisibleTimestamp = lastDoc
//       ? (lastDoc.data().createdAt as number)
//       : null

//     return {
//       profiles,
//       lastVisibleTimestamp,
//     }
//   } catch (error) {
//     return [] as any
//   }
// }

// 'use server'

import { verifyAdmin } from '@/app/server/verify-admin.server'
import { db } from '@/lib/firebase'

export async function getAllProfiles() {
  await verifyAdmin()

  const profilesSnapshot = await db
    .collection('profiles')
    .orderBy('createdAt', 'desc')
    .get()
  const profiles = profilesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))

  return profiles
}
