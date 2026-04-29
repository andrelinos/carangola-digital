'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Building2, ChevronRight, Filter, Home } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { PropertyProps } from '@/_types/property'
import {
  getPaginatedProfiles,
  type PublicProfileCardData,
} from '@/actions/business/get-paginated-profiles'
import { getPaginatedProperties } from '@/actions/properties/get-paginated-properties'
import { cn } from '@/lib/utils'

interface Props {
  initialProfiles: any
  initialProperties: any
}

type Universe = 'business' | 'properties'

const BUSINESS_CATEGORIES = [
  'Todos',
  'Restaurantes',
  'Saúde',
  'Serviços',
  'Lojas',
  'Educação',
  'Beleza',
  'Tecnologia',
  'Oficinas',
  'Outros',
]

const PROPERTY_CATEGORIES = [
  'Todos',
  'Casa',
  'Apartamento',
  'Terreno',
  'Comercial',
  'Sítio/Fazenda',
]

export function ExplorerClient({ initialProfiles, initialProperties }: Props) {
  const [universe, setUniverse] = useState<Universe>('business')
  const [category, setCategory] = useState('Todos')

  // States for Business
  const [profiles, setProfiles] = useState<PublicProfileCardData[]>(
    initialProfiles.profiles
  )
  const [profilesLastId, setProfilesLastId] = useState<string | null>(
    initialProfiles.lastDocId
  )
  const [profilesHasMore, setProfilesHasMore] = useState(
    initialProfiles.hasMore
  )

  // States for Properties
  const [properties, setProperties] = useState<PropertyProps[]>(
    initialProperties.properties
  )
  const [propertiesLastId, setPropertiesLastId] = useState<string | null>(
    initialProperties.lastDocId
  )
  const [propertiesHasMore, setPropertiesHasMore] = useState(
    initialProperties.hasMore
  )

  const [loading, setLoading] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  // Fetch Logic
  const loadMore = useCallback(async () => {
    if (loading) return

    setLoading(true)
    try {
      if (universe === 'business') {
        if (!profilesHasMore) return
        const res = await getPaginatedProfiles(
          category === 'Todos' ? null : category,
          profilesLastId
        )
        setProfiles(prev => [...prev, ...res.profiles])
        setProfilesLastId(res.lastDocId)
        setProfilesHasMore(res.hasMore)
      } else {
        if (!propertiesHasMore) return
        const res = await getPaginatedProperties(
          category === 'Todos' ? null : category,
          propertiesLastId
        )
        setProperties(prev => [...prev, ...res.properties])
        setPropertiesLastId(res.lastDocId)
        setPropertiesHasMore(res.hasMore)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [
    universe,
    category,
    profilesLastId,
    profilesHasMore,
    propertiesLastId,
    propertiesHasMore,
    loading,
  ])

  // Reset when Universe or Category changes
  useEffect(() => {
    const resetAndFetch = async () => {
      setLoading(true)
      try {
        if (universe === 'business') {
          const res = await getPaginatedProfiles(
            category === 'Todos' ? null : category,
            null
          )
          setProfiles(res.profiles)
          setProfilesLastId(res.lastDocId)
          setProfilesHasMore(res.hasMore)
        } else {
          const res = await getPaginatedProperties(
            category === 'Todos' ? null : category,
            null
          )
          setProperties(res.properties)
          setPropertiesLastId(res.lastDocId)
          setPropertiesHasMore(res.hasMore)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    // Skip reset on initial mount as data is provided by SEO SSR
    if (category !== 'Todos' || universe !== 'business') {
      resetAndFetch()
    }
  }, [universe, category])

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [loadMore, loading])

  const activeCategories =
    universe === 'business' ? BUSINESS_CATEGORIES : PROPERTY_CATEGORIES

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* 🚀 Sticky Header Explorer */}
      <div className="sticky top-0 z-40 border-slate-200 border-b bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="font-extrabold text-3xl text-slate-900 tracking-tight dark:text-slate-50">
                Explorar
              </h1>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Descubra os melhores lugares e oportunidades da cidade.
              </p>
            </div>

            {/* Universe Toggle */}
            <div className="flex w-fit rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-900">
              <button
                onClick={() => {
                  setUniverse('business')
                  setCategory('Todos')
                }}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-6 py-2.5 font-bold transition-all',
                  universe === 'business'
                    ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                <Building2 className="size-5" />
                Empresas
              </button>
              <button
                onClick={() => {
                  setUniverse('properties')
                  setCategory('Todos')
                }}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-6 py-2.5 font-bold transition-all',
                  universe === 'properties'
                    ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                <Home className="size-5" />
                Imóveis
              </button>
            </div>
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="scrollbar-none no-scrollbar mt-8 flex items-center gap-3 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-slate-400 dark:bg-slate-900">
              <Filter className="size-4" />
            </div>
            {activeCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'whitespace-nowrap rounded-xl border px-6 py-2.5 font-bold text-sm transition-all',
                  category === cat
                    ? 'scale-105 border-primary bg-primary text-white shadow-lg shadow-primary/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🚀 Results Grid */}
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${universe}-${category}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {universe === 'business'
              ? profiles.map((profile, i) => (
                  <ExploreBusinessCard key={profile.id + i} profile={profile} />
                ))
              : properties.map((property, i) => (
                  <ExplorePropertyCard
                    key={property.id + i}
                    property={property}
                  />
                ))}
          </motion.div>
        </AnimatePresence>

        {/* Loading / End Reach */}
        <div
          ref={loaderRef}
          className="mt-12 flex flex-col items-center justify-center gap-4 py-12"
        >
          {loading && (
            <div className="flex items-center gap-3">
              <div className="size-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
              <div className="size-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
              <div className="size-3 animate-bounce rounded-full bg-primary"></div>
            </div>
          )}

          {!loading &&
            ((universe === 'business' && !profilesHasMore) ||
              (universe === 'properties' && !propertiesHasMore)) && (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <div className="mb-2 h-px w-24 bg-slate-200 dark:bg-slate-800"></div>
                <p className="font-medium text-sm italic">
                  Você chegou ao final da lista
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

// Internal Mini Components for Cards (reusing logic from project for consistency)
function ExploreBusinessCard({ profile }: { profile: PublicProfileCardData }) {
  return (
    <Link href={`/business/${profile.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Cover Placeholder or Image */}
        <div className="relative aspect-16/10 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={profile.logoImageUrl || '/images/og-image.png'}
            alt={profile.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {profile.isPremium && (
            <div className="absolute top-4 left-4 rounded-lg bg-yellow-400 px-2 py-1 font-black text-[10px] text-yellow-950 uppercase shadow-sm">
              Premium
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-bold text-[10px] text-primary uppercase tracking-widest">
                {profile.category}
              </span>
              <h3 className="mt-1 line-clamp-1 font-extrabold text-slate-900 dark:text-slate-100">
                {profile.name}
              </h3>
            </div>
            {profile.isVerified && (
              <div className="flex size-6 items-center justify-center rounded-full bg-blue-500 text-white">
                <ChevronRight className="size-4" />
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-slate-100 border-t pt-4 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(s => (
                  <div
                    key={s}
                    className={`size-3 rounded-full ${s <= (profile.rating || 0) ? 'bg-yellow-400' : 'bg-slate-200 dark:bg-slate-700'}`}
                  ></div>
                ))}
              </div>
              <span className="font-bold text-[10px] text-slate-400">
                {profile.reviewCount || 0} avaliações
              </span>
            </div>
            <ArrowRight className="size-4 text-slate-300 transition-colors group-hover:text-primary" />
          </div>
        </div>
      </div>
    </Link>
  )
}

function ExplorePropertyCard({ property }: { property: PropertyProps }) {
  return (
    <Link href={`/imoveis/${property.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="relative aspect-16/10 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={property.thumbnail || '/images/og-image.png'}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 font-bold text-[10px] text-slate-900 shadow-sm backdrop-blur">
            {property.listingType}
          </div>
        </div>

        <div className="p-6">
          <span className="font-bold text-[10px] text-blue-500 uppercase tracking-widest">
            {property.type}
          </span>
          <h3 className="mt-1 line-clamp-1 font-extrabold text-slate-900 dark:text-slate-100">
            {property.title}
          </h3>

          <div className="mt-4 flex flex-col gap-1">
            <span className="font-black text-slate-900 text-xl dark:text-slate-50">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(property.price)}
              {property.listingType === 'Aluguel' && (
                <span className="font-bold text-slate-500 text-xs">/mês</span>
              )}
            </span>
            <p className="line-clamp-1 text-slate-500 text-xs opacity-70 dark:text-slate-400">
              {property.neighborhood}, {property.city}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-slate-100 border-t pt-4 dark:border-slate-800">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="flex items-center gap-1">
                <span className="font-bold text-xs">
                  {property.characteristics?.bedrooms || 0}
                </span>
                <span className="font-medium text-[10px] uppercase">Qts</span>
              </div>
              <div className="flex items-center gap-1 border-slate-200 border-l pl-3 dark:border-slate-800">
                <span className="font-bold text-xs">
                  {property.characteristics?.area || 0}
                </span>
                <span className="font-medium text-[10px] uppercase">m²</span>
              </div>
            </div>
            <ArrowRight className="size-4 text-slate-300 transition-colors group-hover:text-primary" />
          </div>
        </div>
      </div>
    </Link>
  )
}
