'use client'

import {
  Building2,
  ChevronRight,
  DollarSign,
  Home,
  MapPin,
  MoreVertical,
  Search,
  Star,
  Tag,
  Trash2,
  UserPlus,
} from 'lucide-react'
import Link from 'next/link'
import type { Session } from 'next-auth'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import type { PropertyProps } from '@/_types/property'
import { adminDeleteProperty } from '@/actions/properties/admin-delete-property.action'
import { transferProperty } from '@/actions/properties/transfer-property.action'
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
import { formatPrice } from '@/utils/format-price'
import { FeaturedPropertyModal } from './featured-property-modal'

interface Props {
  properties: PropertyProps[]
  session: Session | null
  isAdmin: boolean
}

export function AllPropertiesAdminTable({
  properties: initialProperties,
  session,
  isAdmin = false,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [selectedProperty, setSelectedProperty] = useState<PropertyProps | null>(null)
  const [_isLoading, setIsLoading] = useState(false)
  const [listProperties, setListProperties] = useState<PropertyProps[]>(initialProperties)

  const [isTransferModalOpen, setTransferModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isFeaturedModalOpen, setFeaturedModalOpen] = useState(false)
  const [newOwnerId, setNewOwnerId] = useState('')
  const [searchTerms, setSearchTerms] = useState('')

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

  const getPropertyFeaturedState = (property: PropertyProps) => {
    const override = featuredOverrides[property.id ?? '']
    if (override !== undefined) return override
    return {
      isFeatured: !!property.isFeatured,
      featuredStartAt: property.featuredStartAt ?? null,
      featuredEndAt: property.featuredEndAt ?? null,
    }
  }

  useEffect(() => {
    const result = initialProperties.filter(property => {
      const propertyTitle = property?.title?.toLowerCase() || ''
      const propertyAddress = property?.address?.toLowerCase() || ''
      const termsLowerCase = searchTerms?.toLowerCase()
      return (
        propertyTitle.includes(termsLowerCase) ||
        propertyAddress.includes(termsLowerCase)
      )
    })
    setListProperties(result)
  }, [searchTerms, initialProperties])

  const handleTransferSubmit = async () => {
    if (!selectedProperty || !newOwnerId || !isAdmin) return

    setIsLoading(true)
    startTransition(async () => {
      const ownerId = selectedProperty.ownerId || selectedProperty.userId
      const result = await transferProperty(selectedProperty.id, ownerId, newOwnerId)
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
    if (!selectedProperty) return
    setIsLoading(true)

    startTransition(async () => {
      const ownerId = selectedProperty.ownerId || selectedProperty.userId
      const result = await adminDeleteProperty({ propertyId: selectedProperty.id, ownerId })
      if (result.success) {
        toast.success('Imóvel excluído com sucesso!')
        setListProperties(prev => prev.filter(p => p.id !== selectedProperty.id))
        setDeleteModalOpen(false)
      } else {
        toast.error(`Erro: ${result.error || 'Falha ao excluir'}`)
      }
    })

    setIsLoading(false)
  }

  const handleFeaturedSuccess = (
    propertyId: string,
    isFeatured: boolean,
    startAt: string | null,
    endAt: string | null
  ) => {
    setFeaturedOverrides(prev => ({
      ...prev,
      [propertyId]: {
        isFeatured,
        featuredStartAt: startAt ? new Date(startAt).getTime() : null,
        featuredEndAt: endAt ? new Date(endAt).getTime() : null,
      },
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col justify-between gap-6 rounded-4xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Pesquisar por título ou endereço..."
            className="h-12 rounded-2xl border-none bg-slate-50 pl-11 text-accent-foreground focus-visible:ring-primary/20 dark:bg-slate-800"
            value={searchTerms}
            onChange={e => setSearchTerms(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Property Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listProperties?.map(property => (
          <Card
            key={property.id}
            className="group relative overflow-hidden rounded-[2.5rem] border-slate-100 transition-all duration-300 hover:scale-[1.01] hover:border-primary/20 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <CardContent className="p-0">
              <div className="p-6">
                <div className="mb-5 flex items-start justify-between">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Home className="size-6" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`font-bold text-[10px] uppercase tracking-wider ${property.status === 'Disponível'
                          ? 'border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : property.status === 'Alugado'
                            ? 'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400'
                            : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                    >
                      {property.status}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-full border-slate-100 bg-white shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                        >
                          <MoreVertical className="size-4 text-slate-600 dark:text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 rounded-2xl border-slate-100 p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900"
                      >
                        <DropdownMenuLabel className="px-3 font-black text-[10px] text-slate-400 uppercase tracking-widest">
                          Opções de Gestão
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="dark:bg-slate-800" />

                        {isAdmin && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProperty(property)
                                setFeaturedModalOpen(true)
                              }}
                              className={cn(
                                'rounded-xl focus:bg-amber-50 focus:text-amber-700 dark:focus:bg-amber-900/30 dark:focus:text-amber-400',
                                getPropertyFeaturedState(property).isFeatured
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-slate-600 dark:text-slate-400'
                              )}
                            >
                              <div className="flex items-center gap-2 p-2">
                                <Star
                                  className={cn(
                                    'size-4',
                                    getPropertyFeaturedState(property).isFeatured && 'fill-amber-400'
                                  )}
                                />
                                <span className="font-bold text-xs uppercase">
                                  {getPropertyFeaturedState(property).isFeatured
                                    ? 'Remover Destaque'
                                    : 'Destacar Imóvel'}
                                </span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="dark:bg-slate-800" />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProperty(property)
                                setTransferModalOpen(true)
                              }}
                              className="rounded-xl text-blue-600 focus:bg-blue-50 focus:text-blue-700 dark:text-blue-400 dark:focus:bg-blue-900/30 dark:focus:text-blue-300"
                            >
                              <div className="flex items-center gap-2 p-2">
                                <UserPlus className="size-4" />
                                <span className="font-bold text-xs uppercase">
                                  Transferir Dono
                                </span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="dark:bg-slate-800" />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProperty(property)
                                setDeleteModalOpen(true)
                              }}
                              className="rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive dark:text-rose-400 dark:focus:bg-rose-900/30 dark:focus:text-rose-300"
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

                <div className="mb-6">
                  <h2
                    className='truncate font-bold text-slate-900 text-xl tracking-tight dark:text-slate-100'
                    title={property.title}
                  >
                    {property.title}
                  </h2>
                  <div className="mt-4 flex flex-col gap-2.5">
                    <div className='flex items-center gap-2.5 text-slate-500 text-sm dark:text-slate-400'>
                      <MapPin className="size-4 shrink-0 text-rose-500 dark:text-rose-400" />
                      <span className="truncate font-medium">
                        {property.address}
                      </span>
                    </div>
                    <div className='flex items-center gap-2.5 text-slate-500 text-sm dark:text-slate-400'>
                      <Tag className="size-4 shrink-0 text-blue-500 dark:text-blue-400" />
                      <span className="font-medium">
                        {property.listingType} • {property.type}
                      </span>
                    </div>
                    <div className='flex items-center gap-2.5 text-slate-500 text-sm dark:text-slate-400'>
                      <DollarSign className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {formatPrice(Number(property.price))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Featured badge */}
                {getPropertyFeaturedState(property).isFeatured && (
                  <div className="mb-4 flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 dark:bg-amber-500/10">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    <span className="font-black text-[10px] text-amber-600 uppercase tracking-widest dark:text-amber-400">
                      Em Destaque
                    </span>
                    {getPropertyFeaturedState(property).featuredEndAt && (
                      <span className="ml-1 font-medium text-[10px] text-amber-500 italic dark:text-amber-300">
                        até{' '}
                        {new Date(
                          getPropertyFeaturedState(property).featuredEndAt!
                        ).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-1 border-slate-100 border-t pt-4 dark:border-slate-800">
                  <span className="font-black text-[10px] text-slate-400 uppercase tracking-widest">
                    Proprietário ID
                  </span>
                  <span className="truncate font-bold text-slate-700 text-xs italic dark:text-slate-300">
                    {property.userId || 'Desconhecido'}
                  </span>
                </div>
              </div>
            </CardContent>

            {/* Quick Actions Footer */}
            <div className="flex items-center justify-between border-slate-100 border-t bg-slate-50 px-8 py-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:border-slate-800 dark:bg-slate-900">
              <span className="font-black text-[10px] text-slate-400 uppercase tracking-widest">
                ID: {property.id?.slice(0, 8)}...
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-xl font-bold text-primary text-xs hover:bg-primary/10 dark:text-blue-400"
                asChild
              >
                <Link href={`/imoveis/${property.slug}`} target="_blank">
                  Visualizar <ChevronRight className="size-3" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {listProperties?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border border-slate-200 border-dashed bg-white py-20 dark:border-slate-800 dark:bg-slate-900">
          <Building2 className="mb-6 size-16 text-slate-200 dark:text-slate-700" />
          <h3 className="font-black text-slate-400 text-xl uppercase italic tracking-tighter">
            Nenhum imóvel encontrado
          </h3>
          <p className="mt-2 font-medium text-slate-400 text-sm">
            Tente ajustar sua pesquisa.
          </p>
        </div>
      )}

      {/* --- MODAL DE DESTAQUE --- */}
      {selectedProperty && (
        <FeaturedPropertyModal
          open={isFeaturedModalOpen}
          onOpenChange={setFeaturedModalOpen}
          propertyId={selectedProperty.id ?? ''}
          propertyTitle={selectedProperty.title}
          ownerId={selectedProperty.ownerId || selectedProperty.userId}
          currentIsFeatured={getPropertyFeaturedState(selectedProperty).isFeatured}
          currentFeaturedStartAt={getPropertyFeaturedState(selectedProperty).featuredStartAt}
          currentFeaturedEndAt={getPropertyFeaturedState(selectedProperty).featuredEndAt}
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
                Transferir Imóvel
              </DialogTitle>
              <p className="mt-1 font-medium text-slate-500 text-sm">
                O imóvel passará a ser gerenciado por outro usuário.
              </p>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-8">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-1 font-black text-[10px] text-slate-400 uppercase tracking-widest">
                Dono Atual (ID)
              </p>
              <code className="font-bold text-slate-700 text-xs">
                {selectedProperty?.ownerId || selectedProperty?.userId || '—'}
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
              Imóvel Selecionado
            </p>
            <h4 className="font-black text-lg text-slate-900 italic">
              "{selectedProperty?.title}"
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
