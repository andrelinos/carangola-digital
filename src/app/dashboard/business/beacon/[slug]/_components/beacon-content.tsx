'use client'

import { ArrowLeft, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'

// Import dynamically to avoid SSR issues with Leaflet
const LocationBeaconMap = dynamic(
  () => import('@/components/ui/location-beacon-map'),
  { ssr: false, loading: () => <div className="h-[500px] w-full animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" /> }
)

interface BeaconContentProps {
  slug: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any
}

export function BeaconContent({ slug, profile }: BeaconContentProps) {
  const primaryAddress = profile.businessAddresses?.[0]
  
  const hasLocation = !!(primaryAddress?.latitude && primaryAddress?.longitude)
  const [isActive, setIsActive] = useState(!!profile.isBeaconActive)

  // Em um caso real, aqui chamaríamos uma action para atualizar o status no firebase
  const toggleBeacon = () => setIsActive(!isActive)

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-slate-500 text-sm transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="size-4" />
          Voltar ao Dashboard
        </Link>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 font-black text-[10px] text-emerald-600 uppercase tracking-widest dark:bg-emerald-900/30 dark:text-emerald-400">
              <MapPin className="size-3.5" />
              Sinalizador de Local
            </div>
            <h1 className="font-black text-3xl text-slate-900 tracking-tight dark:text-slate-100">
              Sua empresa no mapa
            </h1>
            <p className="mt-2 font-medium text-slate-500 text-sm dark:text-slate-400">
              Ative o sinalizador para aparecer com destaque para clientes em um raio de 5km.
            </p>
          </div>
          
          {hasLocation && (
            <button
              onClick={toggleBeacon}
              className={`relative inline-flex h-12 w-48 shrink-0 items-center justify-center rounded-full font-bold text-sm text-white transition-all ${
                isActive 
                  ? 'bg-red-500 shadow-lg shadow-red-500/30 hover:bg-red-600' 
                  : 'bg-emerald-500 shadow-lg shadow-emerald-500/30 hover:bg-emerald-600'
              }`}
            >
              {isActive ? 'Desativar Sinalizador' : 'Ativar Sinalizador'}
            </button>
          )}
        </div>
      </div>

      {!hasLocation ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
            <MapPin className="size-8 text-slate-400" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Localização não definida</h3>
          <p className="mt-2 max-w-md text-slate-500 text-sm">
            Para aparecer no mapa, você precisa adicionar o endereço completo com as coordenadas (latitude e longitude) no seu perfil.
          </p>
          <Link
            href={`/dashboard/business/edit/${slug}`}
            className="mt-6 rounded-full bg-primary px-6 py-2.5 font-bold text-sm text-white transition-colors hover:bg-primary/90"
          >
            Editar Perfil
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <LocationBeaconMap 
              businesses={[
                {
                  id: profile.id,
                  name: profile.name,
                  isBeaconActive: isActive,
                  businessAddresses: profile.businessAddresses
                }
              ]}
              centerLat={primaryAddress.latitude}
              centerLng={primaryAddress.longitude}
              zoom={15}
            />
          </div>
          
          <div className="flex flex-col gap-6">
            <div className={`rounded-3xl border p-6 transition-colors ${isActive ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20' : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900'}`}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Status atual</h3>
                <div className="relative flex h-3 w-3">
                  {isActive && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>}
                  <span className={`relative inline-flex h-3 w-3 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                </div>
              </div>
              
              <p className="text-slate-600 text-sm leading-relaxed dark:text-slate-400">
                {isActive 
                  ? 'Seu negócio está sendo destacado no mapa em tempo real para todos os usuários próximos. Eles verão o ícone pulsante verde.' 
                  : 'Seu negócio está invisível ou aparecendo como um pino cinza discreto no mapa de proximidade. Ative para se destacar!'}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
               <h3 className="mb-4 font-bold text-slate-900 dark:text-slate-100">Como funciona?</h3>
               <ul className="space-y-4">
                 <li className="flex gap-3">
                   <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 text-xs dark:bg-blue-900/30 dark:text-blue-400">1</div>
                   <p className="text-slate-600 text-sm leading-tight dark:text-slate-400">O usuário abre o app e acessa a aba "Locais Próximos".</p>
                 </li>
                 <li className="flex gap-3">
                   <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 text-xs dark:bg-blue-900/30 dark:text-blue-400">2</div>
                   <p className="text-slate-600 text-sm leading-tight dark:text-slate-400">Calculamos a distância e buscamos negócios num raio de 5km.</p>
                 </li>
                 <li className="flex gap-3">
                   <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 text-xs dark:bg-blue-900/30 dark:text-blue-400">3</div>
                   <p className="text-slate-600 text-sm leading-tight dark:text-slate-400">Negócios com Beacon Ativo pulsam em verde, atraindo o clique imediato.</p>
                 </li>
               </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
