'use client'

import type { PropertyProps } from '@/_types/property'
import { Calendar } from 'lucide-react'
import { formatCep } from '../../../../../utils/format-cep'
import { EditPropertyInfo } from './edit-property-info'

interface Props {
  propertyData: PropertyProps
  isOwner: boolean
  isUserAuth: boolean
}

export function PropertyInfo({ propertyData, isOwner, isUserAuth }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Info Card */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="relative mb-4 flex w-fit gap-1 font-bold text-gray-900 text-lg">
          Informações
          {(isOwner || isUserAuth) && <EditPropertyInfo data={propertyData} />}
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-gray-600 text-sm">Tipo</p>
            <p className="font-medium text-gray-900">{propertyData?.type}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Finalidade</p>
            <p className="font-medium text-gray-900">
              {propertyData?.listingType}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Ano de Construção</p>
            <p className="font-medium text-gray-900">
              {propertyData?.yearBuilt}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">CEP</p>
            <p className="font-medium text-gray-900">
              {formatCep(propertyData?.cep)}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <p className="text-gray-600 text-sm">
              Cadastrado em{' '}
              {new Date(propertyData?.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
