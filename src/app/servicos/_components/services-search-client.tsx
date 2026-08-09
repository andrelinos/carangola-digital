'use client'

import { useCallback, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Loader2, Briefcase, Phone } from 'lucide-react'
import { getPaginatedServices } from '@/actions/services/get-paginated-services'
import { searchServices } from '@/actions/services/search-services'
import { categories } from '@/assets/data/categories'
import type { ServiceListingCardData } from '@/_types/service-listing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const ALL_CATEGORY = 'Todos'
const PRICE_TYPE_LABEL: Record<string, string> = {
  fixed: 'R$',
  from: 'A partir de',
  'on-request': 'Consultar',
}

function ServiceCard({ service }: { service: ServiceListingCardData }) {
  const whatsappHref = service.contactWhatsApp
    ? `https://wa.me/55${service.contactWhatsApp.replace(/\D/g, '')}`
    : null

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted/50">
        {service.thumbnailUrl ? (
          <img
            src={service.thumbnailUrl}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Briefcase className="size-10 text-muted-foreground/30" />
          </div>
        )}
        {service.isHighlighted && (
          <span className="absolute top-2 left-2 rounded-full bg-amber-500 px-2 py-0.5 font-semibold text-white text-xs shadow">
            ⭐ Destaque
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Badge variant="secondary" className="mb-2 text-xs">
            {service.category}
          </Badge>
          <h2 className="font-semibold text-foreground leading-tight">
            {service.title}
          </h2>
        </div>

        {/* Price */}
        <div className="text-sm">
          {service.priceType === 'on-request' ? (
            <span className="text-muted-foreground">Consultar preço</span>
          ) : (
            <span className="font-semibold text-primary">
              {PRICE_TYPE_LABEL[service.priceType]}{' '}
              {service.price
                ? `R$ ${(service.price / 100).toFixed(2).replace('.', ',')}`
                : ''}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto flex gap-2">
          <Button
            className="flex-1 text-sm"
            size="sm"
            asChild={!!whatsappHref}
            disabled={!whatsappHref}
            onClick={!whatsappHref ? undefined : undefined}
          >
            {whatsappHref ? (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <Phone className="mr-1.5 size-3.5" />
                Entrar em Contato
              </a>
            ) : (
              <span>
                <Phone className="mr-1.5 size-3.5" />
                Sem contato
              </span>
            )}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`/servicos/${service.slug}`}>Ver mais</a>
          </Button>
        </div>
      </div>
    </article>
  )
}

interface ServicesSearchClientProps {
  initialResult: {
    services: ServiceListingCardData[]
    lastDocId: string | null
    hasMore: boolean
  }
  initialCategory: string
  initialSearchTerm: string
}

export function ServicesSearchClient({
  initialResult,
  initialCategory,
  initialSearchTerm,
}: ServicesSearchClientProps) {
  const router = useRouter()
  const searchParamsHook = useSearchParams()

  const [services, setServices] = useState(initialResult.services)
  const [lastDocId, setLastDocId] = useState(initialResult.lastDocId)
  const [hasMore, setHasMore] = useState(initialResult.hasMore)
  const [searchInput, setSearchInput] = useState(initialSearchTerm)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const visibleCategories = [ALL_CATEGORY, ...categories.slice(0, 12)]

  const applyFilter = useCallback(
    async (cat: string, q: string) => {
      setIsLoading(true)
      const params = new URLSearchParams(searchParamsHook.toString())
      if (cat !== ALL_CATEGORY) params.set('cat', cat)
      else params.delete('cat')
      if (q.trim()) params.set('q', q)
      else params.delete('q')
      router.push(`/servicos?${params.toString()}`, { scroll: false })

      let result: {
        services: ServiceListingCardData[]
        lastDocId: string | null
        hasMore: boolean
      }

      if (q.trim().length >= 3) {
        const sr = await searchServices(q)
        const filtered = cat !== ALL_CATEGORY ? sr.filter(s => s.category === cat) : sr
        result = { services: filtered, lastDocId: null, hasMore: false }
      } else {
        result = await getPaginatedServices(cat === ALL_CATEGORY ? null : cat, null, 12)
      }

      setServices(result.services)
      setLastDocId(result.lastDocId)
      setHasMore(result.hasMore)
      setIsLoading(false)
    },
    [router, searchParamsHook]
  )

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    await applyFilter(activeCategory, searchInput)
  }

  async function handleCategoryChange(cat: string) {
    setActiveCategory(cat)
    await applyFilter(cat, searchInput)
  }

  async function handleLoadMore() {
    if (!lastDocId || isLoadingMore) return
    setIsLoadingMore(true)
    const result = await getPaginatedServices(
      activeCategory === ALL_CATEGORY ? null : activeCategory,
      lastDocId,
      12
    )
    setServices(prev => [...prev, ...result.services])
    setLastDocId(result.lastDocId)
    setHasMore(result.hasMore)
    setIsLoadingMore(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="services-search-input"
            placeholder="Buscar serviço..."
            className="pl-9"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Buscar'}
        </Button>
      </form>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {visibleCategories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <Briefcase className="size-10 text-muted-foreground/40" />
          <p className="font-semibold text-foreground">
            Nenhum serviço encontrado
          </p>
          <p className="text-muted-foreground text-sm">
            Tente outra categoria ou termo de busca.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  'Carregar mais'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
