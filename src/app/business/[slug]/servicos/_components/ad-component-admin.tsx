'use client'

import { Button } from '@/components/ui/button'
import { formatPrice } from '@/utils/format-price'
import { Edit, Eye, Home, Plus, Trash2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

interface AdsComponentProps {
  data: any[]
}

export function AdsComponentAdmin({ data }: AdsComponentProps) {
  const router = useRouter()
  const params = useParams()
  const profileId = params.profileId

  const [ads, setAds] = useState<any[]>(data)

  const handleView = (id: string) => {
    router.push(`/${profileId}/anuncios/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/${profileId}/anuncios/${id}/editar`)
  }

  const handleDelete = (id: string) => {
    const property = ads.find(p => p.id === id)
    const confirmed = confirm(
      `Tem certeza que deseja excluir "${property?.title}"?\nEsta ação não pode ser desfeita.`
    )

    if (confirmed) {
      setAds(data?.filter(p => p.id !== id))
      // Aqui você faria a chamada para API para deletar
      // await fetch(`/api/properties/${id}`, { method: 'DELETE' })
    }
  }

  const handleNew = () => {
    router.push(`/${profileId}/anuncios/novo`)
  }

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
    <div className="mx-auto my-8 max-w-7xl px-4">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 font-bold text-3xl text-gray-800">
            <Home className="h-8 w-8 text-blue-600" />
            Seus anúncios
          </h1>
          <p className="mt-2 text-gray-600">
            Gerencie seus anúncios cadastrados
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={handleNew}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Novo Imóvel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-gray-600 text-sm">Total de Imóveis</p>
          <p className="font-bold text-2xl text-gray-800">{ads.length}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-gray-600 text-sm">Disponíveis</p>
          <p className="font-bold text-2xl text-green-600">
            {ads.filter(p => p.status === 'Disponível').length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-gray-600 text-sm">Alugados/Vendidos</p>
          <p className="font-bold text-2xl text-yellow-600">
            {ads.filter(p => p.status !== 'Disponível').length}
          </p>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="hidden overflow-hidden rounded-lg bg-white shadow md:block">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                Imóvel
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                Tipo
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                Finalidade
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                Status
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                Preço
              </th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ads.map(property => (
              <tr key={property.id} className="transition hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {property.title}
                    </p>
                    <p className="text-gray-500 text-sm">{property.address}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{property.type}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 text-xs">
                    {property.listingType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 font-medium text-xs ${getStatusColor(property.status)}`}
                  >
                    {property.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {formatPrice(Number(property.price))}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleView(property.id)}
                      className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                      title="Visualizar"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleEdit(property.id)}
                      className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                      title="Editar"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(property.id)}
                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                      title="Excluir"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards - Mobile */}
      <div className="space-y-4 md:hidden">
        {ads.map(property => (
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
              {property.price}
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
                onClick={() => handleDelete(property.id)}
                className="flex items-center justify-center rounded-lg bg-red-50 px-4 py-2 text-red-600 transition hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {ads.length === 0 && (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <Home className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 font-semibold text-gray-900 text-xl">
            Nenhum imóvel cadastrado
          </h3>
          <p className="mb-6 text-gray-600">
            Comece cadastrando seu primeiro imóvel
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
  )
}
