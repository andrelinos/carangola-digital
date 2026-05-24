import { UserCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { ProfileForm } from './_components/profile-form'

export const metadata = {
  title: 'Meu Perfil | Dashboard',
  description: 'Gerencie suas informações pessoais e foto de perfil.',
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/acesso')
  }

  const name = session.user.name ?? null
  const email = session.user.email ?? null

  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || 'Usuario'
  )}&background=e2e8f0&color=475569&size=256&font-size=0.4&bold=true`

  const initialImage = session.user.image || fallbackImage

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 border-slate-100 border-b pb-6 dark:border-slate-800">
        <h1 className="flex items-center gap-3 font-black text-2xl text-slate-900 tracking-tight dark:text-slate-100">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20">
            <UserCircle className="size-5 text-primary" />
          </div>
          Meu Perfil
        </h1>
        <p className="ml-[52px] font-medium text-muted-foreground text-sm">
          Atualize seu nome e foto de perfil exibidos na plataforma.
        </p>
        {email && (
          <p className="ml-[52px] font-mono text-[11px] text-slate-400 dark:text-slate-500">
            {email}
          </p>
        )}
      </div>

      {/* Form Card */}
      <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-10 dark:border-slate-800 dark:bg-slate-900">
        <ProfileForm initialName={name} initialImage={initialImage} />
      </div>
    </div>
  )
}
