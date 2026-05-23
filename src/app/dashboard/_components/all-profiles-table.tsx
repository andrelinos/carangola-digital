'use client'

import {
  Building2,
  Calendar,
  ChevronRight,
  ExternalLink,
  Eye,
  MoreVertical,
  Search,
  Settings2,
  Star,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import type { Session } from 'next-auth'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import type { ProfileDataProps } from '@/_types/profile-data'
import { deleteProfile } from '@/actions/business/delete-profile.action'
import { transferProfile } from '@/actions/business/transfer-profile.action'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { AddProfileModal } from './add-profile-modal'
import { FeaturedModal } from './featured-modal'

interface Props {
  profiles: ProfileDataProps[]
  session: Session | null
  isAdmin: boolean
}

export function AllProfilesTable({
  profiles,
  session,
  isAdmin = false,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [selectedProfile, setSelectedProfile] =
    useState<ProfileDataProps | null>(null)
  const [_isLoading, setIsLoading] = useState(false)
  const [listProfiles, setListProfiles] = useState<ProfileDataProps[] | null>(
    profiles
  )

  const [isTransferModalOpen, setTransferModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isFeaturedModalOpen, setFeaturedModalOpen] = useState(false)
  const [newOwnerId, setNewOwnerId] = useState('')
  const [searchTerms, setSearchTerms] = useState('')

  // Optimistic local updates for isFeatured — avoids full page reload
  const [featuredOverrides, setFeaturedOverrides] = useState<
    Record<
      string,
      {
        isFeatured: boolean
        featuredStartAt: number | null
        featuredEndAt: number | null
      }
    >
  >({})

  const getProfileFeaturedState = (profile: ProfileDataProps) => {
    const override = featuredOverrides[profile.id ?? '']
    if (override !== undefined) return override
    return {
      isFeatured: !!profile.isFeatured,
      featuredStartAt: profile.featuredStartAt ?? null,
      featuredEndAt: profile.featuredEndAt ?? null,
    }
  }

  useEffect(() => {
    const result = profiles.filter(profile => {
      const profileName = profile?.name?.toLowerCase() || ''
      const profileSlug = profile?.slug?.toLowerCase() || ''
      const termsLowerCase = searchTerms?.toLowerCase()
      return (
        profileName.includes(termsLowerCase) ||
        profileSlug.includes(termsLowerCase)
      )
    })
    setListProfiles(result)
  }, [searchTerms, profiles])

  const handleTransferSubmit = async () => {
    if (!selectedProfile || !newOwnerId) return
    if (!isAdmin) return

    setIsLoading(true)
    startTransition(async () => {
      const result = await transferProfile(
        selectedProfile?.id ?? '',
        newOwnerId
      )
      if (result.success) {
        toast.success(result.message)
        setTransferModalOpen(false)
        setNewOwnerId('')
      } else {
        toast.error(`Erro: ${result.message}`)
      }
    })
    setIsLoading(false)
  }

  const handleDeleteSubmit = () => {
    if (!selectedProfile) return
    setIsLoading(true)

    startTransition(async () => {
      const result = await deleteProfile(selectedProfile?.id ?? '')
      if (result.success) {
        toast.success(result.message)
        setDeleteModalOpen(false)
      } else {
        toast.error(`Erro: ${result.message}`)
      }
    })

    setIsLoading(false)
  }

  const handleFeaturedSuccess = (
    profileId: string,
    isFeatured: boolean,
    startAt: string | null,
    endAt: string | null
  ) => {
    setFeaturedOverrides(prev => ({
      ...prev,
      [profileId]: {
        isFeatured,
        featuredStartAt: startAt ? new Date(startAt).getTime() : null,
        featuredEndAt: endAt ? new Date(endAt).getTime() : null,
      },
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col justify-between gap-6 rounded-4xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Pesquisar por nome ou link..."
            className="h-12 rounded-2xl border-none pl-11 text-accent-foreground focus-visible:ring-primary/20"
            value={searchTerms}
            onChange={e => setSearchTerms(e.target.value)}
          />
        </div>
        <AddProfileModal userId={session?.user.id} />
      </div>

      {/* Grid of Profile Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listProfiles?.map(profile => (
          <Card
            key={profile.id}
            className="group relative overflow-hidden rounded-[2.5rem] border-slate-100 transition-all duration-300 hover:scale-[1.01] hover:border-primary/20 hover:shadow-2xl"
          >
            <CardContent className="p-0">
              {/* Card Header Background */}
              <div className="h-24 bg-linear-to-r from-primary/10 to-blue-50 transition-all duration-500 group-hover:from-primary group-hover:to-blue-600" />

              <div className="-mt-12 px-8 pb-8">
                {/* Logo / Avatar */}
                <div className="relative mb-6">
                  <div className="relative z-10 size-20 overflow-hidden rounded-[1.5rem] border border-slate-50 bg-white p-1 shadow-xl">
                    {profile.logoImageUrl ? (
                      <img
                        src={profile.logoImageUrl}
                        alt={profile.name}
                        className="size-full rounded-[1.2rem] object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-slate-100">
                        <Building2 className="size-8 text-slate-400" />
                      </div>
                    )}
                  </div>

                  <div className="absolute top-14 right-0 z-20">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-full border-slate-100 bg-white shadow-sm hover:bg-slate-50"
                        >
                          <MoreVertical className="size-4 text-slate-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 rounded-2xl border-slate-100 p-2 shadow-xl"
                      >
                        <DropdownMenuLabel className="px-3 font-black text-[10px] text-slate-400 uppercase tracking-widest">
                          Opções de Gestão
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          asChild
                          className="cursor-not-allowed rounded-xl opacity-50"
                        >
                          <div className="flex items-center gap-2 p-2">
                            <Settings2 className="size-4" />
                            <span className="font-bold text-xs uppercase">
                              Configurações
                            </span>
                          </div>
                        </DropdownMenuItem>

                        {isAdmin && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProfile(profile)
                                setFeaturedModalOpen(true)
                              }}
                              className={cn(
                                'rounded-xl focus:bg-amber-50 focus:text-amber-700',
                                getProfileFeaturedState(profile).isFeatured
                                  ? 'text-amber-600'
                                  : 'text-slate-600'
                              )}
                            >
                              <div className="flex items-center gap-2 p-2">
                                <Star
                                  className={cn(
                                    'size-4',
                                    getProfileFeaturedState(profile)
                                      .isFeatured && 'fill-amber-400'
                                  )}
                                />
                                <span className="font-bold text-xs uppercase">
                                  {getProfileFeaturedState(profile).isFeatured
                                    ? 'Remover Destaque'
                                    : 'Destacar Empresa'}
                                </span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProfile(profile)
                                setTransferModalOpen(true)
                              }}
                              className="rounded-xl text-blue-600 focus:bg-blue-50 focus:text-blue-700"
                            >
                              <div className="flex items-center gap-2 p-2">
                                <UserPlus className="size-4" />
                                <span className="font-bold text-xs uppercase">
                                  Transferir Dono
                                </span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProfile(profile)
                                setDeleteModalOpen(true)
                              }}
                              className="rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                              <div className="flex items-center gap-2 p-2">
                                <Trash2 className="size-4" />
                                <span className="font-bold text-xs uppercase">
                                  Apagar Registro
                                </span>
                              </div>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="line-clamp-1 font-black text-slate-900 text-xl leading-tight tracking-tight">
                      {profile.name}
                    </h3>
                    <Link
                      href={`/business/${profile.slug}`}
                      target="_blank"
                      className="mt-1 flex items-center gap-1 font-bold text-primary text-xs uppercase tracking-wider hover:underline"
                    >
                      /{profile.slug}
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 border-slate-50 border-y py-4">
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 font-black text-[10px] text-slate-400 uppercase tracking-widest">
                        <Eye className="size-3" /> Cliques
                      </span>
                      <p className="font-black text-slate-900">
                        {profile.totalVisits || 0}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 font-black text-[10px] text-slate-400 uppercase tracking-widest">
                        <Users className="size-3" /> Admins
                      </span>
                      <p className="font-black text-slate-900">
                        {profile.admins?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Featured badge */}
                  {getProfileFeaturedState(profile).isFeatured && (
                    <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      <span className="font-black text-[10px] text-amber-600 uppercase tracking-widest">
                        Em Destaque
                      </span>
                      {getProfileFeaturedState(profile).featuredEndAt && (
                        <span className="ml-1 font-medium text-[10px] text-amber-500 italic">
                          até{' '}
                          {new Date(
                            getProfileFeaturedState(profile).featuredEndAt!
                          ).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 font-black text-[10px] text-slate-400 uppercase tracking-widest">
                        <Calendar className="size-3" /> Criado em
                      </span>
                      <span className="font-bold text-slate-700 text-xs italic">
                        {new Date(profile.createdAt).toLocaleDateString(
                          'pt-BR',
                          { day: '2-digit', month: 'short', year: 'numeric' }
                        )}
                      </span>
                    </div>

                    <Badge
                      variant="secondary"
                      className={cn(
                        'rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest',
                        profile.planActive?.planType === 'free'
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-primary/10 text-primary'
                      )}
                    >
                      {profile.planActive?.planType || 'Grátis'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Quick Actions Footer */}
            <div className="flex items-center justify-between border-slate-100 border-t bg-slate-50 px-8 py-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="font-black text-[10px] text-slate-400 uppercase tracking-widest">
                ID: {profile.id?.slice(0, 8)}...
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-xl font-bold text-primary text-xs hover:bg-primary/10"
                asChild
              >
                <Link href={`/business/${profile.slug}`} target="_blank">
                  Gerenciar <ChevronRight className="size-3" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {listProfiles?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border border-slate-200 border-dashed bg-white py-20">
          <Building2 className="mb-6 size-16 text-slate-200" />
          <h3 className="font-black text-slate-400 text-xl uppercase italic tracking-tighter">
            Nenhum negócio encontrado
          </h3>
          <p className="mt-2 font-medium text-slate-400 text-sm">
            Tente ajustar sua pesquisa ou adicione um novo perfil.
          </p>
        </div>
      )}

      {/* --- MODAL DE DESTAQUE --- */}
      {selectedProfile && (
        <FeaturedModal
          open={isFeaturedModalOpen}
          onOpenChange={setFeaturedModalOpen}
          profileId={selectedProfile.id ?? ''}
          profileName={selectedProfile.name}
          currentIsFeatured={
            getProfileFeaturedState(selectedProfile).isFeatured
          }
          currentFeaturedStartAt={
            getProfileFeaturedState(selectedProfile).featuredStartAt
          }
          currentFeaturedEndAt={
            getProfileFeaturedState(selectedProfile).featuredEndAt
          }
          onSuccess={handleFeaturedSuccess}
        />
      )}

      {/* --- MODAL DE TRANSFERÊNCIA --- */}
      <Dialog open={isTransferModalOpen} onOpenChange={setTransferModalOpen}>
        <DialogContent className="max-w-lg overflow-y-auto rounded-[3rem] p-10 py-8">
          <DialogHeader className="space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-50">
              <UserPlus className="size-8 text-blue-600" />
            </div>
            <div className="text-center">
              <DialogTitle className="font-black text-2xl text-slate-900 uppercase tracking-tighter">
                Transferir Propriedade
              </DialogTitle>
              <p className="mt-1 font-medium text-slate-500 text-sm">
                O perfil passará a ser gerenciado por outro usuário.
              </p>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-8">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-1 font-black text-[10px] text-slate-400 uppercase tracking-widest">
                Dono Atual (ID)
              </p>
              <code className="font-bold text-slate-700 text-xs">
                {selectedProfile?.userId}
              </code>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="newOwnerId"
                className="ml-1 font-black text-slate-900 text-xs uppercase tracking-widest"
              >
                ID do Novo Proprietário
              </Label>
              <Input
                id="newOwnerId"
                value={newOwnerId}
                className="h-12 rounded-2xl border-none bg-slate-50 shadow-sm placeholder:text-slate-300"
                onChange={e => setNewOwnerId(e.target.value)}
                placeholder="Ex: d8sa7f9d8s7f98ds7f..."
              />
              <p className="ml-1 font-medium text-[10px] text-slate-500 italic leading-tight">
                Certifique-se de que o ID está correto. A transferência é
                imediata.
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-3 sm:flex-col">
            <Button
              className="h-14 w-full rounded-2xl bg-blue-600 font-black text-white text-xs uppercase tracking-widest shadow-blue-200 shadow-xl hover:bg-blue-700"
              onClick={handleTransferSubmit}
              disabled={isPending || !newOwnerId}
            >
              {isPending ? 'Transferindo...' : 'Confirmar Transferência'}
            </Button>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="h-12 w-full rounded-2xl font-bold text-[10px] text-slate-400 uppercase tracking-widest hover:text-slate-600"
              >
                Cancelar e Voltar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL DE CONFIRMAÇÃO PARA APAGAR --- */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="max-w-lg rounded-[3rem] p-10">
          <DialogHeader className="space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="size-8 text-destructive" />
            </div>
            <div className="text-center">
              <DialogTitle className="font-black text-2xl text-destructive text-slate-900 uppercase tracking-tighter">
                APAGAR REGISTRO?
              </DialogTitle>
              <p className="mt-1 font-medium text-slate-500 text-sm">
                Esta ação é{' '}
                <span className="font-black text-destructive italic underline">
                  irreversível
                </span>{' '}
                e removerá todos os dados.
              </p>
            </div>
          </DialogHeader>

          <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50 p-6 py-6 text-center">
            <p className="mb-1 font-black text-[10px] text-slate-400 uppercase tracking-widest">
              Perfil Selecionado
            </p>
            <h4 className="font-black text-lg text-slate-900 italic">
              "{selectedProfile?.name}"
            </h4>
          </div>

          <DialogFooter className="flex flex-col gap-3 sm:flex-col">
            <Button
              variant="destructive"
              className="h-14 w-full rounded-2xl font-black text-xs uppercase tracking-widest shadow-destructive/20 shadow-xl"
              onClick={handleDeleteSubmit}
              disabled={isPending}
            >
              {isPending ? 'Excluindo...' : 'Sim, apagar definitivamente'}
            </Button>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="h-12 w-full rounded-2xl font-bold text-[10px] text-slate-400 uppercase tracking-widest hover:text-slate-600"
              >
                Cancelar e Manter
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
