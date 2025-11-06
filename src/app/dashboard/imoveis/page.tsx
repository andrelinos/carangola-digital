import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

import { getUserProperties } from '@/actions/properties/get-all-properties-from-user'
import { PropertyComponentAdmin } from '@/app/imoveis/_components/manage-properties'
import { authOptions } from '@/lib/auth'

export default async function PropertiesPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) {
    redirect('/acesso')
  }

  const userId = user.id

  const allPropertiesFromUser = await getUserProperties(userId)

  return <PropertyComponentAdmin data={allPropertiesFromUser} />
}
