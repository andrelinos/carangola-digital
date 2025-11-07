'use client'

import type { PropertyProps } from '@/_types/property'
import { Button } from '@/components/ui/button'

import { deleteProperty } from '@/actions/properties/delete-property'
import { formatPrice } from '@/utils/format-price'
import { Edit, Eye, Home, Plus, Search, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  const [isDeleting, setIsDeleting] = useState(false)
  const [propertyToDelete, setPropertyToDelete] =
    useState<PropertyProps | null>(null)

  const handleView = (id: string) => {
    router.push(`/imoveis/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/imoveis/${id}/editar`)
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
          console.error(result.error)
        }
      } catch (error) {
        console.error('Falha ao tentar excluir:', error)
      } finally {
        setIsDeleting(false)
      }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível':
        return 'bg-green-100 text-green-800'
      case 'Alugado':
        return 'bg-yellow-100 text-yellow-800'
      case 'Vendido':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <>
      <div className="mx-auto my-8 px-4 pt-8 md:pt-0">
        <div className="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-1 flex-wrap">
            <h1 className="flex items-center gap-3 font-bold text-3xl">
              <Home className="h-8 w-8" />
              Seus Imóveis
            </h1>
            <p className="mt-2 text-gray-400">
              Gerencie seus imóveis cadastrados
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={handleNew}
            className="flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 hover:text-white hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Novo Imóvel
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-blue-700 p-4 shadow dark:bg-blue-600">
            <p className="text-blue-100 text-sm">Total de Imóveis</p>
            <p className="font-bold text-2xl text-white">{properties.length}</p>
          </div>

          <div className="rounded-lg bg-white p-4 shadow dark:border dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm text-zinc-600 dark:text-slate-400">
              Disponíveis
            </p>
            <p className="font-bold text-2xl text-blue-900 dark:text-blue-300">
              {properties.filter(p => p.status === 'Disponível').length}
            </p>
          </div>

          <div className="rounded-lg bg-white p-4 shadow dark:border dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm text-zinc-600 dark:text-slate-400">
              Alugados/Vendidos
            </p>
            <p className="font-bold text-2xl text-amber-600 dark:text-amber-400">
              {properties.filter(p => p.status !== 'Disponível').length}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-slate-400" />
            </span>

            <input
              type="search"
              placeholder="Buscar por título ou endereço..."
              className="w-full max-w-lg rounded-lg border border-slate-300 bg-white p-2.5 pl-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 "
              value={termsToSearch}
              onChange={e => setTermsToSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="hidden grid-cols-1 gap-4 md:grid lg:grid-cols-2 xl:grid-cols-3">
          {properties.map(property => (
            <div
              key={property.id}
              className="flex flex-col overflow-hidden rounded-lg border border-transparent shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-blue-400 hover:shadow-2xl dark:border dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-blue-900 text-lg dark:text-blue-200">
                      {property.title}
                    </p>
                    <p className="text-slate-600 text-sm dark:text-slate-400">
                      {property.address}
                    </p>
                  </div>

                  <span
                    className={`ml-2 shrink-0 rounded-full px-3 py-1 font-medium text-xs ${getStatusColor(property.status)}`}
                  >
                    {property.status}
                  </span>
                </div>
              </div>

              <div className="px-4 pb-4 sm:px-5">
                <p className="font-bold text-2xl text-slate-900 dark:text-slate-100">
                  {formatPrice(property.price)}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 text-xs">
                    {property.listingType}
                  </span>

                  <span className="text-slate-700 text-sm dark:text-slate-300">
                    Tipo: <span className="font-medium">{property.type}</span>
                  </span>
                </div>
              </div>

              <div className="mt-auto border-slate-200 border-t bg-slate-50 p-4 sm:px-5 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleView(property.slug)}
                    className="rounded-lg p-2 text-blue-600 transition hover:scale-110 hover:cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/50"
                    title="Visualizar"
                  >
                    <Eye className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => handleOpenDeleteModal(property.id)}
                    className="rounded-lg p-2 text-rose-400 transition hover:scale-110 hover:cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/50"
                    title="Excluir"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 md:hidden">
          {properties.map(property => (
            <div key={property.id} className="rounded-lg bg-white p-4 shadow">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {property.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{property.address}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${getStatusColor(property.status)}`}
                >
                  {property.status}
                </span>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Tipo:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {property.type}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Finalidade:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {property.listingType}
                  </span>
                </div>
              </div>

              <div className="mb-3 font-semibold text-blue-600 text-lg">
                {formatPrice(Number(property.price))}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleView(property.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 font-medium text-blue-600 transition hover:bg-blue-100"
                >
                  <Eye className="h-4 w-4" />
                  Ver
                </Button>
                <Button
                  onClick={() => handleEdit(property.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-2 font-medium text-green-600 transition hover:bg-green-100"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>

                <Button
                  onClick={() => handleOpenDeleteModal(property.id)}
                  className="flex items-center justify-center rounded-lg bg-red-50 px-4 py-2 text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <Home className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 font-semibold text-gray-900 text-xl">
              Nenhum imóvel {termsToSearch ? 'encontrado' : 'cadastrado'}
            </h3>
            <p className="mb-6 text-gray-600">
              {termsToSearch
                ? 'Cadastre mais imóveis'
                : 'Comece cadastrando seu primeiro imóvel'}
            </p>
            <Button
              onClick={handleNew}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Cadastrar Imóvel
            </Button>
          </div>
        )}
      </div>

      <AddPropertyModal isOpen={isModalOpen} onClose={onCloseModal} />

      <DeletePropertyModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        propertyName={propertyToDelete?.title || ''}
      />
    </>
  )
}
