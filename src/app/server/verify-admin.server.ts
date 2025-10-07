import 'server-only'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function verifyAdmin() {
  try {
    const session = await auth()

    if (!session || session?.user?.email !== 'andrelinodev@gmail.com') {
      throw new Error(
        'Acesso negado. Apenas administradores podem executar esta ação.'
      )
    }

    return session
  } catch (error) {
    redirect('/')
  }
}
