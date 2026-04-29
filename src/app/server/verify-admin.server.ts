import 'server-only'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function verifyAdmin() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!user || session?.user?.email !== 'andrelinodev@gmail.com') {
      throw Error
    }

    return !!session // true
  } catch (_error) {
    return false
  }
}
