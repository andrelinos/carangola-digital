'use client'

import { Search, Settings, Shield, Star, Store, User, MapPin } from 'lucide-react'
import type { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { ProfileDataProps } from '@/_types/profile-data'
import { userToggleFeaturedBusiness } from '@/actions/business/user-toggle-featured-business'
import { toast } from 'sonner'
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
  const router = useRouter()
  const [profileId, setProfileId] = useState<string | undefined>('')
  const [searchTerms, setSearchTerms] = useState('')
  const [isTogglingFeature, setIsTogglingFeature] = useState<string | null>(null)
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

  const handleToggleFeature = async (profileId: string, currentStatus: boolean) => {
    setIsTogglingFeature(profileId)
    try {
      const result = await userToggleFeaturedBusiness({
        profileId,
        isFeatured: !currentStatus,
      })

      if (result.success) {
        toast.success(result.message)
        // Optimistic update locally
        setListProfiles(prev =>
          prev ? prev.map(p =>
            p.id === profileId ? { ...p, isFeatured: !currentStatus } : p
          ) : null
        )
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Erro ao processar a ação. Tente novamente.')
    } finally {
      setIsTogglingFeature(null)
    }
  }

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
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <Store className="size-6" />
                      </div>
                      <Badge
                        variant="outline"
                        className={`font-bold text-[10px] uppercase tracking-wider ${
                          profile.planActive?.planType === 'pro' || profile.planActive?.planType === 'master'
                            ? 'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400'
                            : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {profile.planActive?.planType || 'Grátis'}
                      </Badge>
                    </div>
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
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleToggleFeature(profile.id, !!profile.isFeatured)}
                        disabled={isTogglingFeature === profile.id}
                        className={`relative h-10 flex-1 overflow-hidden rounded-xl border-0 text-xs font-bold transition-all ${
                          profile.isFeatured
                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md shadow-amber-500/20 hover:from-amber-500 hover:to-amber-600'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isTogglingFeature === profile.id ? (
                          <svg className="mr-1.5 size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                        ) : (
                          <Star className={`mr-1.5 size-3.5 ${profile.isFeatured ? 'fill-white' : ''}`} />
                        )}
                        {profile.isFeatured ? 'Em Destaque' : 'Destacar'}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => router.push(`/dashboard/business/beacon/${profile.slug}`)}
                        className={`relative h-10 flex-1 overflow-hidden rounded-xl border-0 text-xs font-bold transition-all ${
                          profile.beaconActiveIndexes && profile.beaconActiveIndexes.length > 0
                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:from-emerald-500 hover:to-emerald-600'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700'
                        }`}
                      >
                        <MapPin className={`mr-1.5 size-3.5 ${profile.beaconActiveIndexes && profile.beaconActiveIndexes.length > 0 ? 'fill-white' : ''}`} />
                        {profile.beaconActiveIndexes && profile.beaconActiveIndexes.length > 0 ? 'No Mapa' : 'Mapa'}
                      </Button>
                    </div>

                    <Button
                      onClick={() => setProfileId(profile.id)}
                      className="h-11 w-full rounded-xl bg-slate-900 font-bold text-white transition-all hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                    >
                      Gerenciar Perfil
                    </Button>
                  </div>
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
