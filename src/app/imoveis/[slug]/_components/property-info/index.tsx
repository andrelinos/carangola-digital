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
      <div className="w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="relative mb-6 flex w-fit gap-1 font-bold text-gray-900 text-lg tracking-tight">
          Informações principais
          {(isOwner || isUserAuth) && <EditPropertyInfo data={propertyData} />}
        </div>
        <div className="space-y-4">
          <div className="flex flex-col gap-1 rounded-lg bg-slate-50 p-3">
            <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">Tipo de imóvel</p>
            <p className="font-semibold text-slate-900">{propertyData?.type}</p>
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-slate-50 p-3">
            <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">Finalidade</p>
            <p className="font-semibold text-slate-900">
              {propertyData?.listingType}
            </p>
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-slate-50 p-3">
            <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">Ano de Construção</p>
            <p className="font-semibold text-slate-900">
              {propertyData?.yearBuilt || 'Não informado'}
            </p>
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-slate-50 p-3">
            <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">CEP</p>
            <p className="font-semibold text-slate-900">
              {formatCep(propertyData?.cep)}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <p className="text-slate-500 text-sm">
              Cadastrado em{' '}
              <span className="font-medium text-slate-700">
                {new Date(propertyData?.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
