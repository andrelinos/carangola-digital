import { UserCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

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
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="flex items-center gap-3 font-bold text-3xl text-foreground tracking-tight">
          <UserCircle className="size-8 text-primary" />
          Meu Perfil
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie suas informações pessoais e foto de perfil.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-10 dark:border-slate-800 dark:bg-slate-900">
        <ProfileForm
          initialName={session.user.name || ''}
          initialImage={session.user.image || '/images/user-no-image.png'}
        />
      </div>
    </div>
  )
}
