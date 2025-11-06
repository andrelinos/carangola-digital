import 'server-only'

import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth/next'

export async function verifyAdmin() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!user || session?.user?.email !== 'andrelinodev@gmail.com') {
      throw Error
    }

    return !!session // true
  } catch (error) {
    return false
  }
}
