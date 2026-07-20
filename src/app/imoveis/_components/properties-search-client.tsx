'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Filter, Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { PropertyProps } from '@/_types/property'
import { getPaginatedProperties } from '@/actions/properties/get-paginated-properties'
import { PropertyCard } from '@/components/properties/property-card'
import { cn } from '@/lib/utils'

interface Props {
  initialProperties: any
  initialCategory?: string
  initialListingType?: string
  initialSearchTerm?: string
}

export function PropertiesSearchClient({
  initialProperties,
  initialCategory = 'Todos',
  initialListingType = 'Todos',
  initialSearchTerm = '',
}: Props) {
  const router = useRouter()
  const [category, setCategory] = useState(initialCategory)
  const [listingType, setListingType] = useState(initialListingType)

  // Local state to store original search results for client-side filtering
  const [originalSearchResults, setOriginalSearchResults] = useState<
    PropertyProps[]
  >(initialSearchTerm ? initialProperties.properties : [])

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

  const isSearchMode = initialSearchTerm.trim().length >= 3

  const loadMore = useCallback(async () => {
    if (loading || !propertiesHasMore || isSearchMode) return

    setLoading(true)
    try {
      const res = await getPaginatedProperties(
        category === 'Todos' ? null : category,
        propertiesLastId
      )

      let fetched = res.properties
      if (listingType !== 'Todos') {
        fetched = fetched.filter(p => p.listingType === listingType)
      }

      setProperties(prev => [...prev, ...fetched])
      setPropertiesLastId(res.lastDocId)
      setPropertiesHasMore(res.hasMore)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [
    category,
    listingType,
    propertiesLastId,
    propertiesHasMore,
    loading,
    isSearchMode,
  ])

  const prevParams = useRef({
    initialSearchTerm,
    initialCategory,
    initialListingType,
  })

  if (
    prevParams.current.initialSearchTerm !== initialSearchTerm ||
    prevParams.current.initialCategory !== initialCategory ||
    prevParams.current.initialListingType !== initialListingType
  ) {
    prevParams.current = {
      initialSearchTerm,
      initialCategory,
      initialListingType,
    }
    setProperties(initialProperties.properties)
    setOriginalSearchResults(
      initialSearchTerm ? initialProperties.properties : []
    )
    setPropertiesLastId(initialProperties.lastDocId)
    setPropertiesHasMore(initialProperties.hasMore)
    setCategory(initialCategory)
    setListingType(initialListingType)
  }

  function clearSearch() {
    router.push('/imoveis')
  }

  useEffect(() => {
    if (isSearchMode) {
      // In search mode, perform client-side filtering on the original search results
      let filtered = [...originalSearchResults]
      if (category !== 'Todos') {
        filtered = filtered.filter(p => p.type === category)
      }
      if (listingType !== 'Todos') {
        filtered = filtered.filter(p => p.listingType === listingType)
      }
      setProperties(filtered)
      return
    }

    const resetAndFetch = async () => {
      setLoading(true)
      try {
        const res = await getPaginatedProperties(
          category === 'Todos' ? null : category,
          null
        )
        let fetched = res.properties
        if (listingType !== 'Todos') {
          fetched = fetched.filter(p => p.listingType === listingType)
        }

        setProperties(fetched)
        setPropertiesLastId(res.lastDocId)
        setPropertiesHasMore(res.hasMore)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    resetAndFetch()
  }, [category, listingType, isSearchMode, originalSearchResults])

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
        initialListingType !== 'Todos' ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-primary text-sm">
              <Search className="size-4" />
              <p>
                Buscando por:{' '}
                <strong className="font-bold">
                  {initialSearchTerm || 'Todos os termos'}
                </strong>{' '}
                em <strong className="font-bold">{initialCategory}</strong>
                {initialListingType !== 'Todos' && (
                  <span> ({initialListingType})</span>
                )}
              </p>
            </div>
            <button
              type="button"
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
            <p>Mostrando todos os imóveis</p>
          </div>
        )}
      </div>

      {/* Results Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={category + listingType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {properties.map((property, i) => (
            <PropertyCard key={property.id + String(i)} property={property} />
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

        {!loading && !propertiesHasMore && properties.length > 0 && (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <div className="mb-2 h-px w-24 bg-slate-200 dark:bg-slate-800"></div>
            <p className="font-medium text-sm italic">
              Você chegou ao final da lista
            </p>
          </div>
        )}

        {!loading && properties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
            <p className="font-medium">Nenhum imóvel encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
