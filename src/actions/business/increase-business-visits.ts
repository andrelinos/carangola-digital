'use server'

import { FieldValue } from 'firebase-admin/firestore'

import { db } from '@/lib/firebase'

export async function increaseBusinessVisits({
  profileId,
}: { profileId?: string }) {
  if (!profileId) return null

  try {
    const profileRef = db.collection('profiles').doc(profileId)

    await profileRef.update({
      totalVisits: FieldValue.increment(1),
    })
    return { success: true }
  } catch (error) {
    console.error('Erro ao incrementar visitas:', error)
    return null
  }
}

// 'use server'

// import { FieldValue, Timestamp } from 'firebase-admin/firestore'
// import { db } from '@/lib/firebase'
// import { headers } from 'next/headers'
// import { kv } from '@vercel/kv' // <-- 1. Importar o Vercel KV

// // (Funções getIpAddress, getTodayDateString, sanitizeIpForKey...
// //  são as mesmas da resposta anterior)

// export async function increaseBusinessVisits({
//   profileId,
// }: { profileId?: string }) {
//   if (!profileId) return { success: false, error: 'ID do perfil não fornecido' }

//   const ip = getIpAddress()
//   const today = getTodayDateString()
//   const ipKey = sanitizeIpForKey(ip)

//   if (ip === '0.0.0.0') {
//     return { success: false, error: 'IP não detectado' }
//   }

//   // 2. Criar uma chave única para o KV
//   // ex: "visit:Bos3oHYZdr1kZ7OXdmDL:2025-11-04:189_12_34_56"
//   const kvKey = `visit:${profileId}:${today}:${ipKey}`

//   try {
//     // 3. Tentar SETAR a chave no KV se ela NÃO EXISTIR (nx = Not Exists)
//     // e definir uma expiração de 24h (86400 segundos)
//     const reply = await kv.set(kvKey, '1', { ex: 86400, nx: true })

//     // 4. Analisar a resposta
//     if (reply !== 'OK') {
//       // A chave JÁ EXISTIA (reply foi null).
//       // O IP já visitou hoje. Não fazemos nada.
//       return { success: true, message: 'Visita já contada hoje.' }
//     }

//     // 5. Se reply foi 'OK', a chave foi setada.
//     // Esta é a PRIMEIRA VISITA. Agora, incrementamos o Firestore.
//     const profileRef = db.collection('profiles').doc(profileId)
//     await profileRef.update({
//       totalVisits: FieldValue.increment(1),
//       updatedAt: Timestamp.now().toMillis(),
//     })

//     return { success: true, message: 'Visita contada com sucesso.' }

//   } catch (error) {
//     // ...
//     // PONTO CRÍTICO:
//     // E se o kv.set() funcionou (Etapa 3),
//     // mas o profileRef.update() (Etapa 5) falhou?
//     // O cache dirá que o usuário visitou, mas o contador não subiu.
//     // A visita foi perdida e o usuário será bloqueado por 24h.
//     // ...
//     console.error('Erro ao processar visita com KV:', error)
//     return { success: false, error: 'Erro interno' }
//   }
// }
