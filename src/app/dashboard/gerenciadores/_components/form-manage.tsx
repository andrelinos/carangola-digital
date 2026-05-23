'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Search, Settings, Shield, Store, User, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Session } from 'next-auth'
import { startTransition, useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { ProfileDataProps } from '@/_types/profile-data'
import { addAdminOnProfile } from '@/actions/business/manage-admin-on-profile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ProfileCompletenessCard } from '../../_components/profile-completeness-card'
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
      } finally {
        startTransition(() => {
          setIsSubmitting(false)
          setIdentifier('')
          router.refresh()
        })
      }
    }
  }

  useEffect(() => {
    const result =
      profiles?.filter(profile => {
        const profileLowerCase =
          profile?.name?.toLowerCase() || profile?.slug?.toLowerCase() || ''
        const termsLowerCase = searchTerms?.toLowerCase()
        return profileLowerCase.includes(termsLowerCase)
      }) || []

    setListProfiles(result)
  }, [searchTerms, profiles])

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      {/* Header Area */}
      <div className="flex flex-col justify-between gap-4 border-slate-200 border-b pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-black text-3xl text-slate-900 tracking-tight">
            Meus Negócios
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Gerencie o perfil, assinaturas e administradores das suas empresas.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-400" />
        <Input
          type="search"
          placeholder="Buscar negócio por nome..."
          className="h-12 rounded-xl border-slate-200 bg-white pl-10 font-medium shadow-sm transition-all focus:border-blue-500 focus:ring-blue-100"
          value={searchTerms}
          onChange={e => setSearchTerms(e.target.value)}
        />
      </div>

      {/* Business Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {listProfiles?.map(profile => {
          const isExpanded = profileId === profile.id
          const isOwner = session?.user?.id === profile.userId

          return (
            <Card
              key={profile.id}
              className={`overflow-hidden transition-all duration-300 ${
                isExpanded
                  ? 'border-blue-200 shadow-lg ring-2 ring-blue-500'
                  : 'border-slate-200 bg-white shadow-sm hover:shadow-md'
              }`}
            >
              <CardContent className="p-0">
                {/* Card Header & Summary */}
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                      <Store className="size-6" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`font-bold text-[10px] uppercase ${
                        profile.planActive?.planType === 'pro'
                          ? 'border-amber-200 bg-amber-100 text-amber-700'
                          : 'border-slate-200 bg-slate-100 text-slate-600'
                      }`}
                    >
                      {profile.planActive?.planType || 'Grátis'}
                    </Badge>
                  </div>

                  <div className="mb-6">
                    <h2
                      className="truncate font-bold text-slate-900 text-xl"
                      title={profile.name || profile.slug}
                    >
                      {profile.name || profile.slug}
                    </h2>
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Shield className="size-4" />
                        <span className="font-medium">
                          {isOwner ? 'Proprietário' : 'Administrador'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <User className="size-4" />
                        <span>{profile.admins?.length || 0} gerente(s)</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setProfileId(isExpanded ? '' : profile.id)}
                    variant={isExpanded ? 'secondary' : 'default'}
                    className={`h-11 w-full rounded-xl font-bold transition-all ${
                      isExpanded
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-blue-600 text-white shadow-blue-500/20 shadow-md hover:bg-blue-700'
                    }`}
                  >
                    <Settings className="mr-2 size-4" />
                    {isExpanded ? 'Fechar Gerenciador' : 'Gerenciar Perfil'}
                  </Button>
                </div>

                {/* Expanded Management Area */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-slate-100 border-t bg-slate-50"
                    >
                      <div className="space-y-8 p-6">
                        {/* Profile Completeness */}
                        <div>
                          <ProfileCompletenessCard profile={profile} />
                        </div>

                        {/* Managers List */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="mb-5 flex flex-col gap-1">
                            <h3 className="font-bold text-lg text-slate-900">
                              Equipe do Perfil
                            </h3>
                            <p className="font-medium text-slate-500 text-sm">
                              Usuários com acesso para editar este negócio.
                            </p>
                          </div>

                          <div className="space-y-3">
                            {profile.admins?.map((admin, idx) => (
                              <div
                                key={String(idx)}
                                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-sm">
                                    {admin.name?.charAt(0).toUpperCase() || 'U'}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-900 text-sm">
                                      {admin.name}
                                    </p>
                                    <p className="text-slate-500 text-xs">
                                      {admin.email}
                                    </p>
                                  </div>
                                </div>
                                {admin.userId !== profile.userId && (
                                  <RemoveAdmin
                                    admin={admin as any}
                                    profileId={profileId}
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Add Manager Form */}
                          <div className="mt-6 border-slate-100 border-t pt-5">
                            <h4 className="mb-3 flex items-center gap-2 font-bold text-slate-900 text-sm">
                              <UserPlus className="size-4 text-blue-600" />{' '}
                              Adicionar Gerente
                            </h4>
                            <form
                              onSubmit={handleAddAdmin}
                              className="flex gap-2"
                            >
                              <Input
                                type="email"
                                placeholder="Email do gerente..."
                                className="h-10 flex-1 rounded-lg border-slate-200 bg-white text-sm shadow-sm focus:border-blue-500 focus:ring-blue-100"
                                value={identifier}
                                onChange={e => setIdentifier(e.target.value)}
                              />
                              <Button
                                type="submit"
                                disabled={!identifier || isSubmitting}
                                className="h-10 rounded-lg bg-slate-900 font-bold text-white hover:bg-slate-800"
                              >
                                {isSubmitting ? '...' : 'Convidar'}
                              </Button>
                            </form>
                            <p className="mt-2 font-medium text-[11px] text-slate-400">
                              Nota: O e-mail já deve possuir conta cadastrada no
                              portal.
                            </p>
                          </div>
                        </div>

                        {/* Footer Action */}
                        <div className="flex justify-end pt-2">
                          <Link
                            href={`/business/${profile.slug}`}
                            target="_blank"
                          >
                            <Button
                              variant="outline"
                              className="rounded-xl border-slate-200 font-bold text-slate-700 text-sm shadow-sm hover:bg-slate-100"
                            >
                              Visualizar Página Pública
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {listProfiles?.length === 0 && (
        <div className="mt-4 flex flex-col items-center justify-center rounded-3xl border border-slate-200 border-dashed bg-white py-24 text-center">
          <div className="mb-4 rounded-full bg-slate-50 p-4">
            <Store className="size-10 text-slate-400" />
          </div>
          <h2 className="font-bold text-slate-900 text-xl">
            Nenhum negócio encontrado
          </h2>
          <p className="mt-2 max-w-sm font-medium text-slate-500">
            Você ainda não gerencia nenhum negócio ou a busca não retornou
            resultados.
          </p>
        </div>
      )}
    </div>
  )
}
