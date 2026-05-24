'use client'

import { Store, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Session } from 'next-auth'
import { startTransition, useState } from 'react'
import { toast } from 'sonner'
import type { ProfileDataProps } from '@/_types/profile-data'
import { addAdminOnProfile } from '@/actions/business/manage-admin-on-profile'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ProfileCompletenessCard } from '../../_components/profile-completeness-card'
import { RemoveAdmin } from './delete'

interface Props {
  session: Session
  profile: ProfileDataProps
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageBusinessModal({
  session,
  profile,
  isOpen,
  onOpenChange,
}: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [identifier, setIdentifier] = useState('')

  async function handleAddAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (profile.id && identifier) {
      try {
        setIsSubmitting(true)

        if (identifier === session?.user?.email) {
          setIdentifier('')
          return toast.warning('Este usuário já é dono deste perfil!')
        }

        const formData = new FormData()
        formData.append('profileId', profile.id)
        formData.append('identifier', identifier)

        const response = await addAdminOnProfile(formData)

        if (!response?.success) {
          throw new Error(response.error)
        }
        toast.success('Administrador adicionado com sucesso!')
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Erro ao adicionar administrador. ${error.message}`)
        } else {
          toast.error('Erro ao adicionar administrador.')
        }
      } finally {
        startTransition(() => {
          setIsSubmitting(false)
          setIdentifier('')
          router.refresh()
        })
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-3xl gap-0 overflow-y-auto border-slate-200 bg-slate-50 p-0 dark:border-slate-800 dark:bg-slate-950'>
        <DialogHeader className='sticky top-0 z-10 border-slate-200 border-b bg-white p-6 dark:border-slate-800 dark:bg-slate-900'>
          <DialogTitle className='flex items-center gap-3 font-bold text-slate-900 text-xl dark:text-slate-100'>
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Store className="size-5" />
            </div>
            {profile.name || profile.slug}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 p-6 md:p-8">
          {/* Profile Completeness */}
          <ProfileCompletenessCard profile={profile} />

          {/* Managers List */}
          <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 dark:border-slate-800 dark:bg-slate-900'>
            <div className="mb-5 flex flex-col gap-1">
              <h3 className='font-bold text-lg text-slate-900 dark:text-slate-100'>
                Equipe do Perfil
              </h3>
              <p className='font-medium text-slate-500 text-sm dark:text-slate-400'>
                Usuários com acesso para editar este negócio.
              </p>
            </div>

            <div className="space-y-3">
              {profile.admins?.map((admin, idx) => (
                <div
                  key={String(idx)}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-slate-200 dark:border-slate-800/80 dark:bg-slate-800/30 dark:hover:border-slate-700"
                >
                  <div className="flex items-center gap-4">
                    <div className='flex size-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-sm dark:bg-blue-500/20 dark:text-blue-400'>
                      {admin.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className='font-semibold text-slate-900 text-sm dark:text-slate-100'>
                        {admin.name}
                      </p>
                      <p className='text-slate-500 text-xs dark:text-slate-400'>
                        {admin.email}
                      </p>
                    </div>
                  </div>
                  {admin.userId !== profile.userId && (
                    <RemoveAdmin admin={admin as any} profileId={profile.id} />
                  )}
                </div>
              ))}
            </div>

            {/* Add Manager Form */}
            <div className='mt-6 border-slate-100 border-t pt-5 dark:border-slate-800'>
              <h4 className='mb-4 flex items-center gap-2 font-bold text-slate-900 text-sm dark:text-slate-200'>
                <UserPlus className="size-4 text-blue-600 dark:text-blue-500" />{' '}
                Adicionar Gerente
              </h4>
              <form onSubmit={handleAddAdmin} className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Email do gerente..."
                  className='h-11 flex-1 rounded-lg border-slate-200 bg-slate-50 font-medium text-sm shadow-sm transition-colors focus:border-blue-500 focus:bg-white focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-blue-500 dark:focus:bg-slate-900 dark:focus:ring-blue-900'
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                />
                <Button
                  type="submit"
                  disabled={!identifier || isSubmitting}
                  className="h-11 rounded-lg bg-slate-900 px-6 font-bold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {isSubmitting ? '...' : 'Convidar'}
                </Button>
              </form>
              <p className='mt-3 font-medium text-[11px] text-slate-400'>
                Nota: O e-mail já deve possuir conta cadastrada no portal.
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex justify-end pt-2">
            <Link href={`/business/${profile.slug}`} target="_blank">
              <Button
                variant="outline"
                className='rounded-xl border-slate-200 font-bold text-slate-700 text-sm shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              >
                Visualizar Página Pública
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
