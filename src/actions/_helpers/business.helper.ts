import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import type { DocumentReference } from 'firebase-admin/firestore'
import { getServerSession } from 'next-auth/next'

// Tipos que você já definiu
interface AdminUser {
  email: string
  name: string
  userId: string
}

interface ProfileData {
  userId: string
  admins: AdminUser[]
  // ... outros campos
}

// Tipo para o retorno de erro
type AuthError = { success: false; error: string }

/**
 * Verifica se o usuário logado tem permissão (dono ou admin)
 * para modificar um perfil.
 * * @param profileId O ID do documento do perfil a ser verificado.
 * @returns { error: AuthError } em caso de falha de autorização.
 * @returns { profileRef: DocumentReference } em caso de sucesso.
 */
export async function authorizeProfileUpdate(
  profileId: string
): Promise<
  | { profileRef: DocumentReference; error?: undefined }
  | { profileRef?: undefined; error: AuthError }
> {
  // 1. Obter sessão e usuário
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user || !user.id) {
    console.error('Usuário não autenticado.')
    return { error: { success: false, error: 'Não autorizado' } }
  }
  const currentUserId = user.id

  // 2. Buscar documento
  const profileRef = db.collection('profiles').doc(profileId)
  const profileDoc = await profileRef.get()

  if (!profileDoc.exists) {
    console.error('Perfil não encontrado:', profileId)
    return { error: { success: false, error: 'Perfil não encontrado' } }
  }

  // 3. Verificar permissões (Dono ou Admin)
  const profileData = profileDoc.data() as ProfileData
  const isOwner = currentUserId === profileData.userId
  const admins = (profileData.admins || []) as AdminUser[]
  const isAdmin = admins.some(admin => admin.userId === currentUserId)

  if (!isOwner && !isAdmin) {
    console.warn(
      `ACESSO NEGADO: Usuário ${currentUserId} tentou modificar ${profileId}`
    )
    return { error: { success: false, error: 'Não autorizado' } }
  }

  // 4. Sucesso! Retorna a referência do documento
  return { profileRef }
}
