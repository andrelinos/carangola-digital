import { getUsersAdminsProfile } from '@/app/server/get-users-admins-profile'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { FormManage } from './admins/form-manage'

interface Props {
  params: Promise<{
    profileId: string
  }>
}

export default async function Dashboard({ params }: Props) {
  const session = await auth()

  const { profileId } = await params

  const profileData = await getUsersAdminsProfile(profileId)

  console.log('profileData', profileData?.userId)
  console.log('session?.user?.id', session?.user?.id)

  const isOwner = profileData?.userId === session?.user?.id
  const isUserAuth = !!(
    session?.user?.id &&
    profileData?.admins?.some(admin => admin.userId === session.user.id)
  )

  if (!isOwner && !isUserAuth) {
    redirect('/')
  }

  return (
    <>
      <FormManage profileId={profileId} admins={profileData?.admins || []} />
    </>
  )
}
