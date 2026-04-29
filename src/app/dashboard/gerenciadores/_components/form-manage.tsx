'use client'

import { useRouter } from 'next/navigation'
import { startTransition, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

import type { ProfileDataProps } from '@/_types/profile-data'
import { addAdminOnProfile } from '@/actions/business/manage-admin-on-profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Session } from 'next-auth'
import Link from 'next/link'
import { RemoveAdmin } from './delete'
import { ProfileCompletenessCard } from '../../_components/profile-completeness-card'

import { Store, Shield, User, Settings, UserPlus, Search } from 'lucide-react'

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
    const result = profiles?.filter(profile => {
      const profileLowerCase = profile?.name?.toLowerCase() || profile?.slug?.toLowerCase() || ''
      const termsLowerCase = searchTerms?.toLowerCase()
      return profileLowerCase.includes(termsLowerCase)
    }) || []

    setListProfiles(result)
  }, [searchTerms, profiles])

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Meus Negócios</h1>
          <p className="text-slate-500 font-medium mt-1">Gerencie o perfil, assinaturas e administradores das suas empresas.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
        <Input
          type="search"
          placeholder="Buscar negócio por nome..."
          className="pl-10 h-12 rounded-xl bg-white border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-100 transition-all font-medium"
          value={searchTerms}
          onChange={e => setSearchTerms(e.target.value)}
        />
      </div>

      {/* Business Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {listProfiles?.map(profile => {
          const isExpanded = profileId === profile.id
          const isOwner = session?.user?.id === profile.userId

          return (
            <Card 
              key={profile.id} 
              className={`overflow-hidden transition-all duration-300 ${
                isExpanded 
                  ? 'ring-2 ring-blue-500 shadow-lg border-blue-200' 
                  : 'hover:shadow-md border-slate-200 shadow-sm bg-white'
              }`}
            >
              <CardContent className="p-0">
                {/* Card Header & Summary */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <Store className="size-6" />
                    </div>
                    <Badge 
                      variant="outline"
                      className={`uppercase font-bold text-[10px] ${
                        profile.planActive?.type === 'pro' 
                          ? 'bg-amber-100 text-amber-700 border-amber-200' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {profile.planActive?.type || 'Grátis'}
                    </Badge>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 truncate" title={profile.name || profile.slug}>
                      {profile.name || profile.slug}
                    </h2>
                    <div className="flex flex-col gap-2 mt-3">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Shield className="size-4" />
                        <span className="font-medium">{isOwner ? 'Proprietário' : 'Administrador'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <User className="size-4" />
                        <span>{profile.admins?.length || 0} gerente(s)</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setProfileId(isExpanded ? '' : profile.id)}
                    variant={isExpanded ? "secondary" : "default"}
                    className={`w-full font-bold h-11 rounded-xl transition-all ${
                      isExpanded 
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'
                    }`}
                  >
                    <Settings className="size-4 mr-2" />
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
                      className="border-t border-slate-100 bg-slate-50"
                    >
                      <div className="p-6 space-y-8">
                        
                        {/* Profile Completeness */}
                        <div>
                          <ProfileCompletenessCard profile={profile} />
                        </div>

                        {/* Managers List */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                          <div className="flex flex-col gap-1 mb-5">
                            <h3 className="text-lg font-bold text-slate-900">Equipe do Perfil</h3>
                            <p className="text-sm text-slate-500 font-medium">Usuários com acesso para editar este negócio.</p>
                          </div>

                          <div className="space-y-3">
                            {profile.admins?.map((admin, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <div className="size-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                                    {admin.name?.charAt(0).toUpperCase() || 'U'}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-900 text-sm">{admin.name}</p>
                                    <p className="text-xs text-slate-500">{admin.email}</p>
                                  </div>
                                </div>
                                {admin.userId !== profile.userId && (
                                  <RemoveAdmin admin={admin as any} profileId={profileId} />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Add Manager Form */}
                          <div className="mt-6 pt-5 border-t border-slate-100">
                             <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                               <UserPlus className="size-4 text-blue-600" /> Adicionar Gerente
                             </h4>
                             <form onSubmit={handleAddAdmin} className="flex gap-2">
                               <Input
                                 type="email"
                                 placeholder="Email do gerente..."
                                 className="h-10 rounded-lg border-slate-200 bg-white shadow-sm flex-1 text-sm focus:border-blue-500 focus:ring-blue-100"
                                 value={identifier}
                                 onChange={e => setIdentifier(e.target.value)}
                               />
                               <Button 
                                 type="submit" 
                                 disabled={!identifier || isSubmitting} 
                                 className="h-10 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800"
                               >
                                 {isSubmitting ? '...' : 'Convidar'}
                               </Button>
                             </form>
                             <p className="text-[11px] text-slate-400 mt-2 font-medium">Nota: O e-mail já deve possuir conta cadastrada no portal.</p>
                          </div>
                        </div>

                        {/* Footer Action */}
                        <div className="flex justify-end pt-2">
                           <Link href={`/business/${profile.slug}`} target="_blank">
                             <Button variant="outline" className="text-sm font-bold border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl shadow-sm">
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
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-200 border-dashed mt-4">
          <div className="p-4 bg-slate-50 rounded-full mb-4">
            <Store className="size-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Nenhum negócio encontrado</h2>
          <p className="text-slate-500 mt-2 max-w-sm font-medium">Você ainda não gerencia nenhum negócio ou a busca não retornou resultados.</p>
        </div>
      )}
    </div>
  )
}
