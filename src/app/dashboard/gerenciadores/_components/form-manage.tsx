'use client'

import { useRouter } from 'next/navigation'
import { startTransition, useEffect, useState } from 'react'
import { toast } from 'sonner'

import type { ProfileDataProps } from '@/_types/profile-data'
import { addAdminOnProfile } from '@/actions/business/manage-admin-on-profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Session } from 'next-auth'
import Link from 'next/link'
import { RemoveAdmin } from './delete'

interface Props {
  session: Session
  profiles: ProfileDataProps[]
}

export function FormManage({ session, profiles }: Props) {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [identifier, setIdentifier] = useState('')

  const [profileId, setProfileId] = useState<string | undefined>('')

  const [searchTerms, setSearchTerms] = useState('')
  const [listProfiles, setListProfiles] = useState<ProfileDataProps[] | null>(
    profiles
  )

  async function handleAddAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (profileId && identifier) {
      try {
        setIsSubmitting(true)

        if (identifier === session?.user?.email) {
          setIdentifier('')
          return toast.warning('Este usuário já é dono deste perfil!')
        }

        const formData = new FormData()
        formData.append('profileId', profileId)
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

        return false
      } finally {
        startTransition(() => {
          setIsSubmitting(false)
          setIdentifier('')

          router.refresh()
        })
      }
    } else {
      return
    }

    setIsSubmitting(false)
  }

  useEffect(() => {
    const result = profiles.filter(profile => {
      const profileLowerCase = profile?.name?.toLowerCase()
      const termsLowerCase = searchTerms?.toLowerCase()
      return profileLowerCase?.includes(termsLowerCase)
    })

    setListProfiles(result)
  }, [searchTerms, profiles])

  return (
    <div className="flex min-h-[600px] flex-col items-center overflow-y-auto">
      <h1 className="my-8 font-bold text-3xl">Negócios cadastrados</h1>
      <section className="mb-8 flex w-full flex-col gap-6 rounded">
        {listProfiles?.length && listProfiles?.length >= 5 && (
          <div className="flex-1">
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              id="search"
              type="search"
              className="h-10"
              value={searchTerms}
              onChange={e => setSearchTerms(e.target.value)}
            />
          </div>
        )}

        <div className="flex flex-col gap-6">
          {listProfiles?.map((profile, index) => (
            <div
              key={String(index)}
              className="flex flex-col gap-4 rounded shadow-md"
            >
              <div className="flex gap-4 p-3 hover:bg-accent">
                <input
                  id={profile?.id}
                  type="checkbox"
                  checked={profileId === profile.id}
                  onChange={() =>
                    setProfileId(profileId === profile.id ? '' : profile.id)
                  }
                />
                <label htmlFor={profile?.id} className="flex flex-1 flex-col">
                  <p>
                    <strong>Link do perfil</strong>:{' '}
                    <Link
                      href={`/business/${profile?.slug}` || '#'}
                      target="_blank"
                    >
                      {profile?.slug}
                    </Link>
                  </p>
                  <p>
                    <strong>ID</strong>: {profile.userId}
                  </p>
                  <p>
                    <strong>Plano</strong>:{' '}
                    {String(
                      profile?.planActive?.type?.toUpperCase() ?? 'Grátis'
                    )}
                  </p>
                  <p>
                    <strong>Expires</strong>:{' '}
                    {String(profile?.planActive?.expiresAt ?? 'indeterminado')}
                  </p>
                  <p>
                    <strong>Admins</strong>:{' '}
                    {String(profile?.admins?.length ?? 0)}
                  </p>
                </label>
              </div>
              {profile.id === profileId && (
                <div className="flex w-full flex-col items-center gap-1 border-t p-6">
                  <h2 className="mb-4 text-2xl">Gerentes do perfil</h2>
                  {profile?.admins?.map((admin, idx) => (
                    <div
                      key={String(idx)}
                      className="flex w-full items-center justify-between px-4 py-1 hover:bg-accent"
                    >
                      <div>
                        <p>{admin.name}</p>
                        <p className="text-xs text-zinc-400">- {admin.email}</p>
                      </div>

                      <div className={'flex gap-1'}>
                        {admin.userId !== profile.userId && (
                          <RemoveAdmin
                            admin={admin as any}
                            profileId={profileId}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="mx-auto flex w-xl flex-col items-center">
                    <h2 className="mb-4 text-2xl">
                      Adicionar gerente ao perfil
                    </h2>
                    <form
                      onSubmit={handleAddAdmin}
                      className="flex w-full max-w-md flex-col gap-2"
                    >
                      <Input
                        type="text"
                        placeholder="Digite o email do novo gerente"
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
                      />
                      <Button
                        type="submit"
                        className="mx-auto w-full max-w-xs"
                        disabled={!identifier || !profileId || isSubmitting}
                      >
                        {isSubmitting ? 'Aguarde' : 'Adicionar'}
                      </Button>
                    </form>
                    <p className="py-4 text-muted-foreground text-xs">
                      Nota: Somente e-mails já cadastrados no sistema, podem
                      gerenciar um perfil.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
