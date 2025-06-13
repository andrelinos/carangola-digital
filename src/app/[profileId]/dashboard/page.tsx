import { getUsersAdminsProfile } from '@/app/server/get-users-admins-profile'
import { auth } from '@/lib/auth'
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

  return (
    <>
      <FormManage profileId={profileId} admins={profileData?.admins || []} />
    </>
  )
}
