'use client'

import { Search, Settings, Shield, Star, Store, User } from 'lucide-react'
import type { Session } from 'next-auth'
import { useEffect, useState } from 'react'
import type { ProfileDataProps } from '@/_types/profile-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ManageBusinessModal } from './manage-business-modal'

interface Props {
  session: Session
  profiles: ProfileDataProps[]
}

export function FormManage({ session, profiles }: Props) {
  const [profileId, setProfileId] = useState<string | undefined>('')
  const [searchTerms, setSearchTerms] = useState('')
  const [listProfiles, setListProfiles] = useState<ProfileDataProps[] | null>(
    profiles
  )

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

  const selectedProfile = profiles.find(p => p.id === profileId)

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      {/* Header Area */}
      <div className="flex flex-col justify-between gap-4 border-slate-100 border-b pb-6 sm:flex-row sm:items-center dark:border-slate-800">
        <div>
          <h1 className="font-black text-3xl text-slate-900 tracking-tight dark:text-slate-100">
            Meus Negócios
          </h1>
          <p className="mt-1 font-medium text-slate-500 text-sm dark:text-slate-400">
            Gerencie o perfil, assinaturas e administradores das suas empresas.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
        <Input
          type="search"
          placeholder="Buscar negócio por nome..."
          className="h-12 rounded-xl border-slate-200 bg-white pl-11 font-medium shadow-sm transition-all focus:border-blue-500 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
          value={searchTerms}
          onChange={e => setSearchTerms(e.target.value)}
        />
      </div>

      {/* Business Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {listProfiles?.map(profile => {
          const isOwner = session?.user?.id === profile.userId

          return (
            <Card
              key={profile.id}
              className="overflow-hidden border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="mb-5 flex items-start justify-between">
                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Store className="size-6" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`font-bold text-[10px] uppercase tracking-wider ${
                        profile.planActive?.planType === 'pro'
                          ? 'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400'
                          : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {profile.planActive?.planType || 'Grátis'}
                    </Badge>
                  </div>

                  <div className="mb-6">
                    <h2
                      className="truncate font-bold text-slate-900 text-xl tracking-tight dark:text-slate-100"
                      title={profile.name || profile.slug}
                    >
                      {profile.name || profile.slug}
                    </h2>
                    <div className="mt-4 flex flex-col gap-2.5">
                      <div className="flex items-center gap-2.5 text-slate-500 text-sm dark:text-slate-400">
                        <Shield className="size-4 text-emerald-500 dark:text-emerald-400" />
                        <span className="font-medium">
                          {isOwner ? 'Proprietário' : 'Administrador'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-500 text-sm dark:text-slate-400">
                        <User className="size-4 text-blue-500 dark:text-blue-400" />
                        <span className="font-medium">
                          {profile.admins?.length || 0} gerente(s)
                        </span>
                      </div>
                      {profile.isFeatured && (
                        <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 dark:bg-amber-500/10">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          <span className="font-black text-[10px] text-amber-600 uppercase tracking-widest dark:text-amber-400">
                            Em Destaque
                          </span>
                          {profile.featuredEndAt && (
                            <span className="ml-1 font-medium text-[10px] text-amber-500 italic dark:text-amber-300">
                              até{' '}
                              {new Date(
                                profile.featuredEndAt
                              ).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                              })}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => setProfileId(profile.id)}
                    className="h-11 w-full rounded-xl bg-blue-600 font-bold text-white shadow-blue-500/20 shadow-md transition-all hover:bg-blue-700"
                  >
                    <Settings className="mr-2 size-4" />
                    Gerenciar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {listProfiles?.length === 0 && (
        <div className="mt-4 flex flex-col items-center justify-center rounded-3xl border border-slate-200 border-dashed bg-white py-24 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 rounded-full bg-slate-50 p-4 dark:bg-slate-800">
            <Store className="size-10 text-slate-400 dark:text-slate-500" />
          </div>
          <h2 className="font-bold text-slate-900 text-xl dark:text-slate-100">
            Nenhum negócio encontrado
          </h2>
          <p className="mt-2 max-w-sm font-medium text-slate-500 dark:text-slate-400">
            Você ainda não gerencia nenhum negócio ou a busca não retornou
            resultados.
          </p>
        </div>
      )}

      {/* Modal */}
      {selectedProfile && (
        <ManageBusinessModal
          session={session}
          profile={selectedProfile}
          isOpen={!!profileId}
          onOpenChange={open => {
            if (!open) setProfileId('')
          }}
        />
      )}
    </div>
  )
}
