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
    bgStatus: 'bg-green-50 border-green-100',
    text: 'text-green-700',
    iconArea: 'bg-green-100 text-green-600',
  },
  Vendido: {
    dot: 'bg-rose-500',
    bgStatus: 'bg-rose-50 border-rose-100',
    text: 'text-rose-700',
    iconArea: 'bg-rose-100 text-rose-600',
  },
  Alugado: {
    dot: 'bg-blue-500',
    bgStatus: 'bg-blue-50 border-blue-100',
    text: 'text-blue-700',
    iconArea: 'bg-blue-100 text-blue-600',
  },
  Pendente: {
    dot: 'bg-amber-500',
    bgStatus: 'bg-amber-50 border-amber-100',
    text: 'text-amber-700',
    iconArea: 'bg-amber-100 text-amber-600',
  },
}

export function PropertyStatus({ propertyData, isOwner, isUserAuth }: Props) {
  const status = propertyData?.status || 'Pendente'
  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.Pendente

  return (
    <div
      className={`w-full rounded-2xl border ${config.bgStatus} p-6 shadow-sm`}
    >
      <div className="relative flex flex-col gap-1 font-bold text-gray-900 text-xl tracking-tight">
        <span className="text-slate-800">Situação do imóvel</span>
        <div className="mt-2 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.dot}`}
            ></span>
            <span
              className={`relative inline-flex h-3 w-3 rounded-full ${config.dot}`}
            ></span>
          </span>
          <span className={`font-semibold ${config.text} text-lg`}>
            {status}
          </span>
          {(isOwner || isUserAuth) && (
            <EditPropertyStatus data={propertyData} />
          )}
        </div>
      </div>
    </div>
  )
}
