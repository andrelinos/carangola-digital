'use client'

import { ArrowLeft, Home, MapPin, Radio } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import type { PropertyProps } from '@/_types/property'
import { userTogglePropertyBeacon } from '@/actions/properties/user-toggle-property-beacon'

const LocationBeaconMap = dynamic(
  () => import('@/components/ui/location-beacon-map'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
    ),
  }
)

interface BeaconContentProps {
  slug: string
  property: PropertyProps
}

export function BeaconContent({ slug, property }: BeaconContentProps) {
  const [isActive, setIsActive] = useState<boolean>(!!property.isBeaconActive)
  const [isSaving, setIsSaving] = useState(false)

  const hasLocation = !!(property.latitude && property.longitude)

  const toggle = async () => {
    setIsSaving(true)
    const nextState = !isActive

    // Optimistic UI update
    setIsActive(nextState)

    try {
      const result = await userTogglePropertyBeacon({
        propertyId: property.id,
        isBeaconActive: nextState,
      })

      if (!result.success) {
        // Rollback
        setIsActive(isActive)
        toast.error(result.message || 'Erro ao salvar. Tente novamente.')
      } else {
        toast.success(
          result.message ||
            (nextState ? 'Imóvel em destaque no mapa!' : 'Destaque removido.')
        )
      }
    } catch (error) {
      // Rollback
      setIsActive(isActive)
      toast.error('Erro ao processar a ação. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  // Build Marker for the property
  const propertyMarker = hasLocation
    ? [
        {
          id: property.id,
          name: property.title,
          isBeaconActive: isActive,
          category: property.type === 'rent' ? 'Aluguel' : 'Venda',
          logoUrl: property.thumbnail,
          profileSlug: slug,
          businessAddresses: [
            {
              latitude: property.latitude,
              longitude: property.longitude,
              title: property.title,
              address: property.address,
              neighborhood: property.neighborhood,
              cep: property.cep,
            },
          ],
        },
      ]
    : []

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/imoveis"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-slate-500 text-sm transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="size-4" />
          Voltar para Meus Imóveis
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 font-black text-[10px] text-emerald-600 uppercase tracking-widest dark:bg-emerald-900/30 dark:text-emerald-400">
              <MapPin className="size-3.5" />
              Visibilidade no Mapa
            </div>
            <h1 className="font-black text-3xl text-slate-900 tracking-tight dark:text-slate-100">
              Seu imóvel no mapa
            </h1>
            <p className="mt-2 font-medium text-slate-500 text-sm dark:text-slate-400">
              Escolha se este imóvel deve aparecer para clientes próximos que
              buscam pelo mapa em tempo real.
            </p>
          </div>

          {hasLocation && isActive && (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 dark:border-emerald-800/50 dark:bg-emerald-950/30">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-bold text-emerald-700 text-xs dark:text-emerald-400">
                Você está em destaque no mapa
              </span>
            </div>
          )}
        </div>
      </div>

      {!hasLocation ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-3xl border border-slate-300 border-dashed bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
            <MapPin className="size-8 text-slate-400" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
            Localização não definida
          </h3>
          <p className="mt-2 max-w-md text-slate-500 text-sm">
            Para aparecer no mapa, adicione a localização (latitude e longitude)
            no momento do cadastro ou edição do imóvel.
          </p>
          <Link
            href={`/imoveis/${slug}`}
            className="mt-6 rounded-full bg-primary px-6 py-2.5 font-bold text-sm text-white transition-colors hover:bg-primary/90"
          >
            Editar Imóvel
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          {/* Map */}
          <div className="md:col-span-2">
            <LocationBeaconMap
              businesses={propertyMarker}
              centerLat={property.latitude}
              centerLng={property.longitude}
              zoom={15}
            />
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="space-y-3">
              <div
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-500/50 dark:bg-emerald-900/20'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 rounded-bl-xl bg-emerald-500 px-3 py-1 font-bold text-[10px] text-white uppercase tracking-widest">
                    Transmissão Ativa
                  </div>
                )}

                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Home className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-sm dark:text-slate-100">
                      {property.title}
                    </h3>
                    <p className="line-clamp-1 text-slate-500 text-xs dark:text-slate-400">
                      {property.address}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggle}
                  disabled={isSaving}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200'
                  } disabled:cursor-not-allowed disabled:opacity-70`}
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="size-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <title>Salvando...</title>
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
                      Salvando...
                    </span>
                  ) : isActive ? (
                    <>
                      <Radio className="size-4 animate-pulse" />
                      Ocultar do Mapa
                    </>
                  ) : (
                    <>
                      <MapPin className="size-4" />
                      Aparecer no Mapa
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <h4 className="mb-2 font-bold text-slate-900 text-sm dark:text-slate-100">
                Como funciona o Beacon?
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed dark:text-slate-400">
                O Beacon é um sinalizador em tempo real. Quando ativo, seu
                imóvel fica visível no mapa interativo para qualquer pessoa
                pesquisando na sua região. Use para atrair visitas imediatas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
