'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getPaginatedProfiles,
  type PublicProfileCardData,
} from '@/actions/business/get-paginated-profiles'
import { BusinessCard } from '@/components/business/business-card'
import { cn } from '@/lib/utils'

interface Props {
  initialProfiles: any
  initialCategory?: string
  initialSearchTerm?: string
  initialDistance?: string
}

import { Search, X } from 'lucide-react'

export function BusinessSearchClient({
  initialProfiles,
  initialCategory = 'Todos',
  initialSearchTerm = '',
  initialDistance = 'any',
}: Props) {
  const router = useRouter()
  const [category, setCategory] = useState(initialCategory)

  // Local state to store original search results for client-side filtering
  const [originalSearchResults, setOriginalSearchResults] = useState<
    PublicProfileCardData[]
  >(initialSearchTerm ? initialProfiles.profiles : [])

  const [profiles, setProfiles] = useState<PublicProfileCardData[]>(
    initialProfiles.profiles
  )
  const [profilesLastId, setProfilesLastId] = useState<string | null>(
    initialProfiles.lastDocId
  )
  const [profilesHasMore, setProfilesHasMore] = useState(
    initialProfiles.hasMore
  )

  const [loading, setLoading] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  const isSearchMode = initialSearchTerm.trim().length >= 3

  const loadMore = useCallback(async () => {
    // Disable infinite scroll if we are in text search mode
    if (loading || !profilesHasMore || isSearchMode) return

    setLoading(true)
    try {
      const res = await getPaginatedProfiles(
        category === 'Todos' ? null : category,
        profilesLastId
      )
      setProfiles(prev => [...prev, ...res.profiles])
      setProfilesLastId(res.lastDocId)
      setProfilesHasMore(res.hasMore)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [category, profilesLastId, profilesHasMore, loading, isSearchMode])

  const prevParams = useRef({
    initialSearchTerm,
    initialCategory,
    initialDistance,
  })

  if (
    prevParams.current.initialSearchTerm !== initialSearchTerm ||
    prevParams.current.initialCategory !== initialCategory ||
    prevParams.current.initialDistance !== initialDistance
  ) {
    prevParams.current = { initialSearchTerm, initialCategory, initialDistance }
    setProfiles(initialProfiles.profiles)
    setOriginalSearchResults(initialSearchTerm ? initialProfiles.profiles : [])
    setProfilesLastId(initialProfiles.lastDocId)
    setProfilesHasMore(initialProfiles.hasMore)
    setCategory(initialCategory)
  }

  function clearSearch() {
    router.push('/business#explorar')
  }

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

  return (
    <div className="flex flex-col gap-8 pt-8 pb-12">
      {/* Dynamic Header for Search */}
      <div className="flex flex-col items-center gap-4 text-center">
        {isSearchMode ||
        initialCategory !== 'Todos' ||
        initialDistance !== 'any' ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-primary text-sm">
              <Search className="size-4" />
              <p>
                Buscando por:{' '}
                <strong className="font-bold">
                  {initialSearchTerm || 'Todos os termos'}
                </strong>{' '}
                em <strong className="font-bold">{initialCategory}</strong>
                {initialDistance !== 'any' && (
                  <span> (+ {initialDistance} km)</span>
                )}
              </p>
            </div>
            <button
              onClick={clearSearch}
              className="flex items-center justify-center rounded-full bg-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              title="Limpar busca"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-slate-600 text-sm dark:bg-slate-800 dark:text-slate-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
            </span>
            <p>Mostrando todas as empresas</p>
          </div>
        )}
      </div>

      {/* Results Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {profiles.map((profile, i) => (
            <BusinessCard key={profile.id + i} profile={profile} />
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

        {!loading && !profilesHasMore && profiles.length > 0 && (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <div className="mb-2 h-px w-24 bg-slate-200 dark:bg-slate-800"></div>
            <p className="font-medium text-sm italic">
              Você chegou ao final da lista
            </p>
          </div>
        )}

        {!loading && profiles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
            <p className="font-medium">Nenhum estabelecimento encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
