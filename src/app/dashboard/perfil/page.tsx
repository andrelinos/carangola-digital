import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { UserCircle } from 'lucide-react'

import { authOptions } from '@/lib/auth'
import { ProfileForm } from './_components/profile-form'

export const metadata = {
  title: 'Configurações de Perfil | Dashboard',
  description: 'Gerencie suas informações de perfil',
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/acesso')
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <UserCircle className="size-8 text-primary" />
          Meu Perfil
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e foto de perfil.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 md:p-10 shadow-sm">
        <ProfileForm
          initialName={session.user.name || ''}
          initialImage={session.user.image || '/images/user-no-image.png'}
        />
      </div>
    </div>
  )
}
