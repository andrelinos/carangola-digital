'use client'

import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Bath,
  Bed,
  Calendar,
  Car,
  MapPin,
  Square,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useState } from 'react'
import { formatPrice } from '../../../../../utils/format-price'

// No Next.js 15, params é assíncrono
export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ profileId: string; id: string }>
}) {
  const { profileId, id } = use(params)
  const router = useRouter()

  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [property, setProperty] = useState({
    id: '1',
    title: 'Apartamento Central',
    type: 'Apartamento',
    listingType: 'Venda',
    status: 'Disponível',
    price: 'R$ 350.000',
    address: 'Rua Principal, 123 - Centro',
    city: 'Carangola',
    state: 'MG',
    zipCode: '36800-000',
    description:
      'Excelente apartamento no coração de Carangola, próximo a comércios, escolas e transporte público. Imóvel bem conservado e pronto para morar.',
    area: 85,
    bedrooms: 3,
    bathrooms: 2,
    garageSpots: 1,
    yearBuilt: 2018,
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg', '/placeholder-3.jpg'],
    features: [
      'Ar condicionado',
      'Armários embutidos',
      'Varanda',
      'Portaria 24h',
      'Elevador',
      'Salão de festas',
    ],
    createdAt: '2025-10-01',
  })

  const handleEdit = () => {
    router.push(`/${profileId}/imoveis/${id}/editar`)
  }

  const handleDelete = () => {
    const confirmed = confirm(
      `Tem certeza que deseja excluir "${property.title}"?\nEsta ação não pode ser desfeita.`
    )

    if (confirmed) {
      // Aqui você faria a chamada para API
      // await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      router.push(`/${profileId}/imoveis`)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="mx-auto my-8 max-w-6xl px-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </Button>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Images */}
          <div className="overflow-hidden rounded-lg bg-gray-200 shadow-lg">
            <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600">
              {/* Substitua por componente de galeria de imagens real */}
              <div className="flex h-full items-center justify-center text-white">
                <p className="font-medium text-lg">Galeria de Imagens</p>
              </div>
            </div>
          </div>

          {/* Title and Price */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="mb-2 font-bold text-3xl text-gray-900">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{property.address}</span>
                </div>
              </div>
              <span className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-800">
                {property.status}
              </span>
            </div>

            <div className="border-t pt-4">
              <p className="mb-1 text-gray-600 text-sm">Valor</p>
              <p className="font-bold text-3xl text-blue-600">
                {formatPrice(Number(property.price))}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 font-bold text-gray-900 text-xl">
              Características
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <Square className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-gray-600 text-sm">Área</p>
                  <p className="font-semibold text-gray-900">
                    {property.area} m²
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Bed className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-gray-600 text-sm">Quartos</p>
                  <p className="font-semibold text-gray-900">
                    {property.bedrooms}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Bath className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-gray-600 text-sm">Banheiros</p>
                  <p className="font-semibold text-gray-900">
                    {property.bathrooms}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-gray-600 text-sm">Vagas</p>
                  <p className="font-semibold text-gray-900">
                    {property.garageSpots}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 font-bold text-gray-900 text-xl">Descrição</h2>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Features */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 font-bold text-gray-900 text-xl">
              Diferenciais
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {property.features.map((feature, index) => (
                <div
                  key={String(index)}
                  className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2"
                >
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 font-bold text-gray-900 text-lg">
              Informações
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Tipo</p>
                <p className="font-medium text-gray-900">{property.type}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Finalidade</p>
                <p className="font-medium text-gray-900">
                  {property.listingType}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Ano de Construção</p>
                <p className="font-medium text-gray-900">
                  {property.yearBuilt}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">CEP</p>
                <p className="font-medium text-gray-900">{property.zipCode}</p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-gray-600 text-sm">
                  Cadastrado em{' '}
                  {new Date(property.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="rounded-lg bg-blue-50 p-6 shadow">
            <h3 className="mb-3 font-bold text-gray-900 text-lg">
              Interessado?
            </h3>
            <p className="mb-4 text-gray-700 text-sm">
              Entre em contato para mais informações sobre este imóvel.
            </p>
            <Button className="w-full">Entrar em Contato</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
