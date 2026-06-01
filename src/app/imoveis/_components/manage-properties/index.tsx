'use client'

import {
  DollarSign,
  Home,
  MapPin,
  Plus,
  Search,
  Star,
  Tag,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { PropertyProps } from '@/_types/property'
import { deleteProperty } from '@/actions/properties/delete-property'
import { userToggleFeaturedProperty } from '@/actions/properties/user-toggle-featured-property'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/utils/format-price'
import { AddPropertyModal } from './add-property-modal'
import { DeletePropertyModal } from './delete-property-modal'

interface PropertyComponentProps {
  data: PropertyProps[]
}

export function PropertyComponentAdmin({ data }: PropertyComponentProps) {
  const router = useRouter()

  const [properties, setProperties] = useState<PropertyProps[]>(data)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [termsToSearch, setTermsToSearch] = useState('')

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [_isDeleting, setIsDeleting] = useState(false)
  const [propertyToDelete, setPropertyToDelete] =
    useState<PropertyProps | null>(null)
  const [isTogglingFeature, setIsTogglingFeature] = useState<string | null>(
    null
  )

  // NOVO: useEffect ajustado com delay para evitar conflito de hidratação/rotas
  useEffect(() => {
    const checkHash = setTimeout(() => {
      if (
        typeof window !== 'undefined' &&
        window.location.hash === '#anunciar'
      ) {
        setIsModalOpen(true)

        // Limpa a hash da URL sem disparar eventos de navegação que fecham o modal
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search
        )
      }
    }, 150) // 150ms é o suficiente para a DOM estar pronta

    return () => clearTimeout(checkHash)
  }, [])

  const handleView = (id: string) => {
    router.push(`/imoveis/${id}`)
  }

  /**
   * Abre o modal de confirmação de exclusão
   */
  const handleOpenDeleteModal = (id: string) => {
    const property = properties.find(p => p.id === id)
    if (property) {
      setPropertyToDelete(property)
      setIsDeleteModalOpen(true)
    }
  }

  /**
   * Fecha o modal de confirmação de exclusão
   */
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setPropertyToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (propertyToDelete) {
      setIsDeleting(true)

      try {
        const result = await deleteProperty({
          propertyId: propertyToDelete.id,
        })

        if (result.success) {
          setProperties(prevProperties =>
            prevProperties.filter(p => p.id !== propertyToDelete.id)
          )

          handleCloseDeleteModal()
        } else {
          console.error('Erro no processo')
        }
      } catch (_error) {
        console.error('Falha ao tentar excluir:')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleToggleFeature = async (
    propertyId: string,
    currentStatus: boolean
  ) => {
    setIsTogglingFeature(propertyId)
    try {
      const result = await userToggleFeaturedProperty({
        propertyId,
        isFeatured: !currentStatus,
      })

      if (result.success) {
        toast.success(result.message)
        // Optimistic update locally
        setProperties(prev =>
          prev.map(p =>
            p.id === propertyId ? { ...p, isFeatured: !currentStatus } : p
          )
        )
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error('Erro ao processar a ação. Tente novamente.')
    } finally {
      setIsTogglingFeature(null)
    }
  }

  const handleNew = () => {
    setIsModalOpen(true)
  }

  const onCloseModal = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (!data) {
      setProperties([])
      return
    }

    const normalizedSearch = termsToSearch.toLowerCase()
    const result = data.filter(property => {
      const propertyTitle = (property.title || '').toLowerCase()
      return propertyTitle.includes(normalizedSearch)
    })

    setProperties(result)
  }, [data, termsToSearch])

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      {/* Header Area */}
      <div className="flex flex-col justify-between gap-4 border-slate-100 border-b pb-6 sm:flex-row sm:items-center dark:border-slate-800">
        <div>
          <h1 className="font-black text-3xl text-slate-900 tracking-tight dark:text-slate-100">
            Meus Imóveis
          </h1>
          <p className="mt-1 font-medium text-slate-500 text-sm dark:text-slate-400">
            Gerencie seus imóveis cadastrados, status e valores.
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-blue-500/20 shadow-md transition hover:bg-blue-700"
        >
          <Plus className="size-4" />
          Novo Imóvel
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="overflow-hidden border-slate-200 bg-blue-600 shadow-sm dark:border-slate-800 dark:bg-blue-700">
          <CardContent className="p-6">
            <p className="font-medium text-blue-100 text-sm">
              Total de Imóveis
            </p>
            <p className="mt-2 font-bold text-3xl text-white">
              {properties.length}
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-6">
            <p className="font-medium text-slate-500 text-sm dark:text-slate-400">
              Disponíveis
            </p>
            <p className="mt-2 font-bold text-3xl text-slate-900 dark:text-slate-100">
              {properties.filter(p => p.status === 'Disponível').length}
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-6">
            <p className="font-medium text-slate-500 text-sm dark:text-slate-400">
              Alugados / Vendidos
            </p>
            <p className="mt-2 font-bold text-3xl text-slate-900 dark:text-slate-100">
              {properties.filter(p => p.status !== 'Disponível').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
        <Input
          type="search"
          placeholder="Buscar por título ou endereço..."
          className="h-12 rounded-xl border-slate-200 bg-white pl-11 font-medium shadow-sm transition-all focus:border-blue-500 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
          value={termsToSearch}
          onChange={e => setTermsToSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {properties.map(property => (
          <Card
            key={property.id}
            className="overflow-hidden border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            <CardContent className="p-0">
              <div className="p-6">
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Home className="size-6" />
                    </div>
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
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDeleteModal(property.id)}
                    className="size-8 rounded-full text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                    title="Excluir Imóvel"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="mb-6">
                  <h2
                    className="truncate font-bold text-slate-900 text-xl tracking-tight dark:text-slate-100"
                    title={property.title}
                  >
                    {property.title}
                  </h2>
                  <div className="mt-4 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5 text-slate-500 text-sm dark:text-slate-400">
                      <MapPin className="size-4 shrink-0 text-rose-500 dark:text-rose-400" />
                      <span className="truncate font-medium">
                        {property.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-500 text-sm dark:text-slate-400">
                      <Tag className="size-4 shrink-0 text-blue-500 dark:text-blue-400" />
                      <span className="font-medium">
                        {property.listingType} • {property.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-500 text-sm dark:text-slate-400">
                      <DollarSign className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {formatPrice(Number(property.price))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='mt-6 flex flex-col gap-3 border-slate-100 border-t pt-5 dark:border-slate-800'>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleToggleFeature(property.id, !!property.isFeatured)
                      }
                      disabled={isTogglingFeature === property.id}
                      className={`relative h-10 flex-1 overflow-hidden rounded-xl border-0 font-bold text-xs transition-all ${property.isFeatured
                        ? 'bg-linear-to-r from-amber-400 to-amber-500 text-white shadow-amber-500/20 shadow-md hover:from-amber-500 hover:to-amber-600'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700'
                        }`}
                    >
                      {isTogglingFeature === property.id ? (
                        <svg
                          className="mr-1.5 size-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <title> </title>
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                      ) : (
                        <Star
                          className={`mr-1.5 size-3.5 ${property.isFeatured ? 'fill-white' : ''}`}
                        />
                      )}
                      {property.isFeatured ? 'Em Destaque' : 'Destacar'}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/dashboard/imoveis/beacon/${property.slug}`
                        )
                      }
                      className={`relative h-10 flex-1 overflow-hidden rounded-xl border-0 font-bold text-xs transition-all ${property.isBeaconActive
                        ? 'bg-linear-to-r from-emerald-400 to-emerald-500 text-white shadow-emerald-500/20 shadow-md hover:from-emerald-500 hover:to-emerald-600'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700'
                        }`}
                    >
                      <MapPin
                        className={`mr-1.5 size-3.5 ${property.isBeaconActive ? 'fill-white' : ''}`}
                      />
                      {property.isBeaconActive ? 'No Mapa' : 'Mapa'}
                    </Button>
                  </div>

                  <Button
                    onClick={() => handleView(property.slug)}
                    className="h-11 w-full rounded-xl bg-slate-900 font-bold text-white transition-all hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  >
                    Gerenciar Imóvel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {properties?.length === 0 && (
        <div className="mt-4 flex flex-col items-center justify-center rounded-3xl border border-slate-200 border-dashed bg-white py-24 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 rounded-full bg-slate-50 p-4 dark:bg-slate-800">
            <Home className="size-10 text-slate-400 dark:text-slate-500" />
          </div>
          <h2 className="font-bold text-slate-900 text-xl dark:text-slate-100">
            Nenhum imóvel {termsToSearch ? 'encontrado' : 'cadastrado'}
          </h2>
          <p className="mt-2 max-w-sm font-medium text-slate-500 dark:text-slate-400">
            {termsToSearch
              ? 'A busca não retornou resultados.'
              : 'Você ainda não possui imóveis cadastrados na plataforma.'}
          </p>
          {!termsToSearch && (
            <Button
              onClick={handleNew}
              className="mt-6 h-11 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-blue-500/20 shadow-md transition-all hover:bg-blue-700"
            >
              <Plus className="mr-2 size-4" />
              Cadastrar Imóvel
            </Button>
          )}
        </div>
      )}

      <AddPropertyModal isOpen={isModalOpen} onClose={onCloseModal} />

      <DeletePropertyModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        propertyName={propertyToDelete?.title || ''}
      />
    </div>
  )
}
