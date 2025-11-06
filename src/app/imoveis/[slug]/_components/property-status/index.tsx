'use client'

import type { PropertyProps } from '@/_types/property'
import { EditPropertyStatus } from './edit-property-status'
// O EditPropertyStatus não é usado nesta versão simples
// import { EditPropertyStatus } from './edit-property-status'

interface Props {
  propertyData: PropertyProps
  isOwner: boolean
  isUserAuth: boolean
}

// Mapeamento para cores e textos (MUITO mais fácil de manter)
const statusConfig = {
  Disponível: {
    dot: 'bg-green-500',
    bgStatus: 'bg-green-500/20',
    text: 'text-green-700',
  },
  Vendido: {
    dot: 'bg-red-500',
    bgStatus: 'bg-red-500/20',
    text: 'text-red-700',
  },
  Alugado: {
    dot: 'bg-blue-500',
    bgStatus: 'bg-blue-500/20',
    text: 'text-blue-700',
  },
  Pendente: {
    dot: 'bg-yellow-500',
    bgStatus: 'bg-yellow-500/20',
    text: 'text-yellow-700',
  },
}

export function PropertyStatus({ propertyData, isOwner, isUserAuth }: Props) {
  const status = propertyData?.status || 'Indefinido'
  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.Pendente

  return (
    <div className={`rounded-lg ${config.bgStatus} p-6 shadow`}>
      <div className="relative mb-4 flex w-fit flex-col gap-1 font-bold text-gray-900 text-xl">
        <span className="text-white">Status</span>
        <div className="flex items-center gap-2 py-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${config.dot}`}
            aria-hidden="true"
          />
          <span className={`font-semibold ${config.text}`}>{status}</span>
          {(isOwner || isUserAuth) && (
            <EditPropertyStatus data={propertyData} />
          )}
        </div>
      </div>
    </div>
  )
}
