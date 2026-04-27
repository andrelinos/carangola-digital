'use client'

import { useEffect, useState, useTransition } from 'react'
import { deleteProfile } from '@/actions/business/delete-profile.action'
import { transferProfile } from '@/actions/business/transfer-profile.action'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  ExternalLink, 
  MoreVertical, 
  Search, 
  Trash2, 
  UserPlus, 
  Calendar,
  Users,
  Eye,
  Settings2,
  ChevronRight
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent } from '@/components/ui/card'

import type { ProfileDataProps } from '@/_types/profile-data'
import type { Session } from 'next-auth'
import Link from 'next/link'
import { toast } from 'sonner'
import { AddProfileModal } from './add-profile-modal'
import { cn } from '@/lib/utils'

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
  const [isLoading, setIsLoading] = useState(false)
  const [listProfiles, setListProfiles] = useState<ProfileDataProps[] | null>(
    profiles
  )

  const [isTransferModalOpen, setTransferModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [newOwnerId, setNewOwnerId] = useState('')
  const [searchTerms, setSearchTerms] = useState('')

  useEffect(() => {
    const result = profiles.filter(profile => {
      const profileName = profile?.name?.toLowerCase() || ''
      const profileSlug = profile?.slug?.toLowerCase() || ''
      const termsLowerCase = searchTerms?.toLowerCase()
      return profileName.includes(termsLowerCase) || profileSlug.includes(termsLowerCase)
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
        selectedProfile.userId,
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
      const result = await deleteProfile(
        selectedProfile?.id ?? '',
        selectedProfile.userId
      )
      if (result.success) {
        toast.success(result.message)
        setDeleteModalOpen(false)
      } else {
        toast.error(`Erro: ${result.message}`)
      }
    })

    setIsLoading(false)
  }

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Pesquisar por nome ou link..."
            className="pl-11 h-12 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary/20"
            value={searchTerms}
            onChange={e => setSearchTerms(e.target.value)}
          />
        </div>
        <AddProfileModal userId={session?.user.id} />
      </div>

      {/* Grid of Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listProfiles?.map(profile => (
          <Card 
            key={profile.id} 
            className="group relative overflow-hidden rounded-[2.5rem] border-slate-100 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] hover:border-primary/20"
          >
            <CardContent className="p-0">
              {/* Card Header Background */}
              <div className="h-24 bg-linear-to-r from-primary/10 to-blue-50 group-hover:from-primary group-hover:to-blue-600 transition-all duration-500" />
              
              <div className="px-8 pb-8 -mt-12">
                {/* Logo / Avatar */}
                <div className="relative mb-6">
                   <div className="size-20 rounded-[1.5rem] bg-white p-1 shadow-xl border border-slate-50 relative z-10 overflow-hidden">
                      {profile.logoImageUrl ? (
                        <img 
                          src={profile.logoImageUrl} 
                          alt={profile.name} 
                          className="size-full object-cover rounded-[1.2rem]" 
                        />
                      ) : (
                        <div className="size-full bg-slate-100 flex items-center justify-center">
                           <Building2 className="size-8 text-slate-400" />
                        </div>
                      )}
                   </div>
                   
                   <div className="absolute top-14 right-0 z-20">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="size-8 rounded-full bg-white border-slate-100 shadow-sm hover:bg-slate-50">
                            <MoreVertical className="size-4 text-slate-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-slate-100 shadow-xl">
                          <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400 px-3">Opções de Gestão</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild className="rounded-xl cursor-not-allowed opacity-50">
                             <div className="flex items-center gap-2 p-2">
                                <Settings2 className="size-4" />
                                <span className="font-bold text-xs uppercase">Configurações</span>
                             </div>
                          </DropdownMenuItem>
                          
                          {isAdmin && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedProfile(profile)
                                  setTransferModalOpen(true)
                                }}
                                className="rounded-xl text-blue-600 focus:text-blue-700 focus:bg-blue-50"
                              >
                                <div className="flex items-center gap-2 p-2">
                                  <UserPlus className="size-4" />
                                  <span className="font-bold text-xs uppercase">Transferir Dono</span>
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedProfile(profile)
                                  setDeleteModalOpen(true)
                                }}
                                className="rounded-xl text-destructive focus:text-destructive focus:bg-destructive/10"
                              >
                                <div className="flex items-center gap-2 p-2">
                                  <Trash2 className="size-4" />
                                  <span className="font-bold text-xs uppercase">Apagar Registro</span>
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
                    <h3 className="font-black text-xl text-slate-900 tracking-tight leading-tight line-clamp-1">{profile.name}</h3>
                    <Link 
                      href={`/business/${profile.slug}`} 
                      target="_blank"
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 mt-1 uppercase tracking-wider"
                    >
                      /{profile.slug}
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                     <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                           <Eye className="size-3" /> Cliques
                        </span>
                        <p className="font-black text-slate-900">{profile.totalVisits || 0}</p>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                           <Users className="size-3" /> Admins
                        </span>
                        <p className="font-black text-slate-900">{profile.admins?.length || 0}</p>
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                           <Calendar className="size-3" /> Criado em
                        </span>
                        <span className="text-xs font-bold text-slate-700 italic">
                          {new Date(profile.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                     </div>
                     
                     <Badge 
                        variant="secondary" 
                        className={cn(
                          "rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-[0.1em]",
                          profile.planActive?.type === 'free' ? "bg-slate-100 text-slate-500" : "bg-primary/10 text-primary"
                        )}
                      >
                        {profile.planActive?.type || 'Grátis'}
                     </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            
            {/* Quick Actions Footer */}
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {profile.id?.slice(0, 8)}...</span>
               <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs font-bold text-primary gap-2 hover:bg-primary/10 rounded-xl"
                asChild
               >
                 <Link href={`/dashboard/business/gerenciadores/${profile.id}`}>
                    Gerenciar <ChevronRight className="size-3" />
                 </Link>
               </Button>
            </div>
          </Card>
        ))}
      </div>

      {listProfiles?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
           <Building2 className="size-16 text-slate-200 mb-6" />
           <h3 className="text-xl font-black text-slate-400 uppercase tracking-tighter italic">Nenhum negócio encontrado</h3>
           <p className="text-slate-400 font-medium text-sm mt-2">Tente ajustar sua pesquisa ou adicione um novo perfil.</p>
        </div>
      )}

      {/* --- MODAL DE TRANSFERÊNCIA --- */}
      <Dialog open={isTransferModalOpen} onOpenChange={setTransferModalOpen}>
        <DialogContent className="overflow-y-auto py-8 rounded-[3rem] p-10 max-w-lg">
          <DialogHeader className="space-y-4">
            <div className="bg-blue-50 size-16 rounded-full flex items-center justify-center mx-auto">
               <UserPlus className="size-8 text-blue-600" />
            </div>
            <div className="text-center">
              <DialogTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Transferir Propriedade</DialogTitle>
              <p className="text-slate-500 text-sm font-medium mt-1">O perfil passará a ser gerenciado por outro usuário.</p>
            </div>
          </DialogHeader>
          
          <div className="py-8 space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dono Atual (ID)</p>
              <code className="text-xs font-bold text-slate-700">{selectedProfile?.userId}</code>
            </div>

            <div className="space-y-3">
              <Label htmlFor="newOwnerId" className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">ID do Novo Proprietário</Label>
              <Input
                id="newOwnerId"
                value={newOwnerId}
                className="h-12 rounded-2xl bg-slate-50 border-none shadow-sm placeholder:text-slate-300"
                onChange={e => setNewOwnerId(e.target.value)}
                placeholder="Ex: d8sa7f9d8s7f98ds7f..."
              />
              <p className="text-[10px] text-slate-500 font-medium italic ml-1 leading-tight">
                Certifique-se de que o ID está correto. A transferência é imediata.
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-col gap-3">
            <Button
              className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:bg-blue-700"
              onClick={handleTransferSubmit}
              disabled={isPending || !newOwnerId}
            >
              {isPending ? 'Transferindo...' : 'Confirmar Transferência'}
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" className="w-full h-12 rounded-2xl font-bold text-slate-400 hover:text-slate-600 uppercase text-[10px] tracking-widest">
                Cancelar e Voltar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL DE CONFIRMAÇÃO PARA APAGAR --- */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="rounded-[3rem] p-10 max-w-lg">
          <DialogHeader className="space-y-4">
            <div className="bg-destructive/10 size-16 rounded-full flex items-center justify-center mx-auto">
               <Trash2 className="size-8 text-destructive" />
            </div>
            <div className="text-center">
              <DialogTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase text-destructive">APAGAR REGISTRO?</DialogTitle>
              <p className="text-slate-500 text-sm font-medium mt-1">Esta ação é <span className="text-destructive font-black underline italic">irreversível</span> e removerá todos os dados.</p>
            </div>
          </DialogHeader>
          
          <div className="py-6 bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center mb-6">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Perfil Selecionado</p>
             <h4 className="text-lg font-black text-slate-900 italic">"{selectedProfile?.name}"</h4>
          </div>

          <DialogFooter className="flex flex-col sm:flex-col gap-3">
            <Button
              variant="destructive"
              className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-destructive/20"
              onClick={handleDeleteSubmit}
              disabled={isPending}
            >
              {isPending ? 'Excluindo...' : 'Sim, apagar definitivamente'}
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" className="w-full h-12 rounded-2xl font-bold text-slate-400 hover:text-slate-600 uppercase text-[10px] tracking-widest">
                Cancelar e Manter
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
