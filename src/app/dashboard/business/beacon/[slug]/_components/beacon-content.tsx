'use client'

import { ArrowLeft, Lock, MapPin, Radio } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import type { BusinessAddressProps } from '@/_types/profile-data'
import { updateBeaconState } from '@/actions/business/update-beacon-state'
import {
  type PlanTypeProps,
  plansBusinessConfig,
} from '@/configs/plans-business'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any
}

export function BeaconContent({ slug, profile }: BeaconContentProps) {
  const addresses: BusinessAddressProps[] = (
    profile.businessAddresses ?? []
  ).filter((a: BusinessAddressProps) => a.latitude && a.longitude)

  // Initialize from persisted beaconActiveIndexes; fallback to legacy isBeaconActive flag
  const [activeStates, setActiveStates] = useState<boolean[]>(() => {
    const saved: number[] = profile.beaconActiveIndexes ?? []
    if (saved.length > 0) {
      return addresses.map((_a, i) => saved.includes(i))
    }
    // Legacy: all active or all inactive
    return addresses.map(() => !!profile.isBeaconActive)
  })

  const [isSaving, setIsSaving] = useState(false)

  const hasLocation = addresses.length > 0
  const activeCount = activeStates.filter(Boolean).length

  // Resolve the plan's map highlight limit (-1 = unlimited)
  const planType = (profile.planType ?? 'free') as PlanTypeProps
  const planConfig = plansBusinessConfig[planType] ?? plansBusinessConfig.free
  const highlightLimit = planConfig.mapHighlights.limit
  const isUnlimited = highlightLimit === -1
  const atLimit = !isUnlimited && activeCount >= highlightLimit

  const toggle = async (idx: number) => {
    const isActive = activeStates[idx]
    if (!isActive && atLimit) {
      toast.error(
        Number(highlightLimit) === 0
          ? 'Seu plano não permite destaques no mapa. Faça upgrade para usar este recurso.'
          : `Limite atingido. Seu plano permite destacar até ${highlightLimit} endereço${highlightLimit > 1 ? 's' : ''} simultaneamente.`
      )
      return
    }

    // Optimistic update
    const next = activeStates.map((v, i) => (i === idx ? !v : v))
    setActiveStates(next)
    setIsSaving(true)

    const activeIndexes = next.reduce<number[]>(
      (acc, v, i) => (v ? [...acc, i] : acc),
      []
    )

    const result = await updateBeaconState(profile.id, activeIndexes)
    setIsSaving(false)

    if (!result.success) {
      // Rollback
      setActiveStates(activeStates)
      toast.error(result.error ?? 'Erro ao salvar. Tente novamente.')
      return
    }

    toast.success(
      next[idx] ? 'Endereço em destaque no mapa!' : 'Destaque removido.'
    )
  }

  // Build one BusinessMarker per address so the map renders each independently
  const primaryPhone: string | undefined =
    profile.businessPhones?.[0]?.phone ?? undefined

  const businessMarkers = addresses.map((addr, idx) => ({
    id: `${profile.id}-${idx}`,
    name: profile.name,
    isBeaconActive: activeStates[idx],
    category: profile.category ?? undefined,
    logoUrl: profile.logoImageUrl ?? undefined,
    rating: profile.rating ?? undefined,
    reviewCount: profile.reviewCount ?? undefined,
    phone: primaryPhone,
    profileSlug: slug,
    businessAddresses: [
      {
        latitude: addr.latitude,
        longitude: addr.longitude,
        title: addr.title,
        address: addr.address,
        neighborhood: addr.neighborhood,
        cep: addr.cep,
      },
    ],
  }))

  const centerAddress = addresses[0]

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
              Visibilidade no Mapa
            </div>
            <h1 className="font-black text-3xl text-slate-900 tracking-tight dark:text-slate-100">
              Sua empresa no mapa
            </h1>
            <p className="mt-2 font-medium text-slate-500 text-sm dark:text-slate-400">
              Escolha em quais endereços você quer aparecer para clientes
              próximos. Ative e desative quando quiser, em tempo real.
            </p>
          </div>

          {hasLocation && activeCount > 0 && (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 dark:border-emerald-800/50 dark:bg-emerald-950/30">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-bold text-emerald-700 text-xs dark:text-emerald-400">
                Você está em destaque em {activeCount} local
                {activeCount > 1 ? 'is' : ''}
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
            Para aparecer no mapa, adicione o endereço completo com as
            coordenadas (latitude e longitude) no seu perfil.
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
          {/* Map — all addresses rendered simultaneously */}
          <div className="md:col-span-2">
            <LocationBeaconMap
              businesses={businessMarkers}
              centerLat={centerAddress.latitude}
              centerLng={centerAddress.longitude}
              zoom={addresses.length > 1 ? 13 : 15}
            />
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Per-address toggle cards */}
            <div className="space-y-3">
              {/* Quota indicator */}
              <div className="flex items-center justify-between">
                <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest dark:text-slate-500">
                  Endereços ({addresses.length})
                </p>
                <p
                  className={`font-bold text-[10px] uppercase tracking-widest ${
                    atLimit && !isUnlimited
                      ? 'text-amber-500 dark:text-amber-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {isUnlimited
                    ? 'Destaques ilimitados'
                    : Number(highlightLimit) === 0
                      ? 'Upgrade para destacar'
                      : `${activeCount}/${highlightLimit} em destaque`}
                </p>
              </div>

              {addresses.map((addr, idx) => {
                const isActive = activeStates[idx]
                return (
                  <div
                    key={String(idx)}
                    className={`rounded-2xl border p-4 transition-all ${
                      isActive
                        ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800/50 dark:bg-emerald-950/20'
                        : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        <div className="relative flex size-3">
                          {isActive && (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          )}
                          <span
                            className={`relative inline-flex size-3 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                          />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-slate-900 text-sm leading-tight dark:text-slate-100">
                          {addr.title || `Endereço ${idx + 1}`}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-slate-500 text-xs dark:text-slate-400">
                          {addr.address}
                          {addr.neighborhood ? `, ${addr.neighborhood}` : ''}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggle(idx)}
                      disabled={isSaving || (!isActive && atLimit)}
                      className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 font-bold text-xs transition-all ${
                        isSaving
                          ? 'cursor-wait bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                          : isActive
                            ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50'
                            : atLimit
                              ? 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                              : 'bg-emerald-500 text-white shadow-emerald-500/30 shadow-md hover:bg-emerald-600'
                      }`}
                    >
                      {isSaving ? (
                        <svg
                          className="size-3.5 animate-spin"
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
                      ) : !isActive && atLimit ? (
                        <>
                          <Lock className="size-3.5" /> Limite atingido
                        </>
                      ) : (
                        <>
                          <Radio className="size-3.5" />
                          {isActive ? 'Remover destaque' : 'Destacar no mapa'}
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* How it works */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="mb-3 font-bold text-slate-900 text-sm dark:text-slate-100">
                Como funciona?
              </h3>
              <ul className="space-y-3">
                {[
                  'O cliente abre o app e toca em "Perto de mim".',
                  'Mostramos negócios visíveis num raio de 5 km.',
                  'Seus endereços ativos pulsam em verde — impossível ignorar.',
                ].map((step, i) => (
                  <li key={String(i)} className="flex gap-2.5">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-[10px] text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      {i + 1}
                    </div>
                    <p className="text-slate-600 text-xs leading-tight dark:text-slate-400">
                      {step}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
