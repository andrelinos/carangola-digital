'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, 
  Home, 
  Search, 
  ChevronRight,
  Filter,
  ArrowRight
} from 'lucide-react'
import { getPaginatedProfiles, PublicProfileCardData } from '@/actions/business/get-paginated-profiles'
import { getPaginatedProperties } from '@/actions/properties/get-paginated-properties'
import type { PropertyProps } from '@/_types/property'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// UI Components (Using standard project buttons and styles)
import { Button } from '@/components/ui/button'

interface Props {
  initialProfiles: any
  initialProperties: any
}

type Universe = 'business' | 'properties'

const BUSINESS_CATEGORIES = [
  'Todos', 'Restaurantes', 'Saúde', 'Serviços', 'Lojas', 'Educação', 'Beleza', 'Tecnologia', 'Oficinas', 'Outros'
]

const PROPERTY_CATEGORIES = [
  'Todos', 'Casa', 'Apartamento', 'Terreno', 'Comercial', 'Sítio/Fazenda'
]

export function ExplorerClient({ initialProfiles, initialProperties }: Props) {
  const [universe, setUniverse] = useState<Universe>('business')
  const [category, setCategory] = useState('Todos')
  
  // States for Business
  const [profiles, setProfiles] = useState<PublicProfileCardData[]>(initialProfiles.profiles)
  const [profilesLastId, setProfilesLastId] = useState<string | null>(initialProfiles.lastDocId)
  const [profilesHasMore, setProfilesHasMore] = useState(initialProfiles.hasMore)
  
  // States for Properties
  const [properties, setProperties] = useState<PropertyProps[]>(initialProperties.properties)
  const [propertiesLastId, setPropertiesLastId] = useState<string | null>(initialProperties.lastDocId)
  const [propertiesHasMore, setPropertiesHasMore] = useState(initialProperties.hasMore)

  const [loading, setLoading] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  // Fetch Logic
  const loadMore = useCallback(async () => {
    if (loading) return
    
    setLoading(true)
    try {
      if (universe === 'business') {
        if (!profilesHasMore) return
        const res = await getPaginatedProfiles(category === 'Todos' ? null : category, profilesLastId)
        setProfiles(prev => [...prev, ...res.profiles])
        setProfilesLastId(res.lastDocId)
        setProfilesHasMore(res.hasMore)
      } else {
        if (!propertiesHasMore) return
        const res = await getPaginatedProperties(category === 'Todos' ? null : category, propertiesLastId)
        setProperties(prev => [...prev, ...res.properties])
        setPropertiesLastId(res.lastDocId)
        setPropertiesHasMore(res.hasMore)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [universe, category, profilesLastId, profilesHasMore, propertiesLastId, propertiesHasMore, loading])

  // Reset when Universe or Category changes
  useEffect(() => {
    const resetAndFetch = async () => {
      setLoading(true)
      try {
        if (universe === 'business') {
          const res = await getPaginatedProfiles(category === 'Todos' ? null : category, null)
          setProfiles(res.profiles)
          setProfilesLastId(res.lastDocId)
          setProfilesHasMore(res.hasMore)
        } else {
          const res = await getPaginatedProperties(category === 'Todos' ? null : category, null)
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
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        loadMore()
      }
    }, { threshold: 0.1 })

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [loadMore, loading])

  const activeCategories = universe === 'business' ? BUSINESS_CATEGORIES : PROPERTY_CATEGORIES

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* 🚀 Sticky Header Explorer */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">Explorar</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Descubra os melhores lugares e oportunidades da cidade.</p>
            </div>

            {/* Universe Toggle */}
            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit">
              <button 
                onClick={() => { setUniverse('business'); setCategory('Todos'); }}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all",
                  universe === 'business' 
                    ? "bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200/50" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                <Building2 className="size-5" />
                Empresas
              </button>
              <button 
                onClick={() => { setUniverse('properties'); setCategory('Todos'); }}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all",
                  universe === 'properties' 
                    ? "bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200/50" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                <Home className="size-5" />
                Imóveis
              </button>
            </div>
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="mt-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl text-slate-400">
              <Filter className="size-4" />
            </div>
            {activeCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all border",
                  category === cat
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/40"
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {universe === 'business' ? (
              profiles.map((profile, i) => (
                <ExploreBusinessCard key={profile.id + i} profile={profile} />
              ))
            ) : (
              properties.map((property, i) => (
                <ExplorePropertyCard key={property.id + i} property={property} />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Loading / End Reach */}
        <div 
          ref={loaderRef} 
          className="mt-12 flex flex-col items-center justify-center py-12 gap-4"
        >
          {loading && (
            <div className="flex items-center gap-3">
              <div className="size-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="size-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="size-3 bg-primary rounded-full animate-bounce"></div>
            </div>
          )}
          
          {!loading && ((universe === 'business' && !profilesHasMore) || (universe === 'properties' && !propertiesHasMore)) && (
            <div className="flex flex-col items-center gap-2 text-slate-400">
               <div className="h-px w-24 bg-slate-200 dark:bg-slate-800 mb-2"></div>
               <p className="text-sm font-medium italic">Você chegou ao final da lista</p>
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
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
        {/* Cover Placeholder or Image */}
        <div className="aspect-16/10 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
           <img 
            src={profile.logoImageUrl || '/images/og-image.png'} 
            alt={profile.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
           />
           {profile.isPremium && (
             <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-950 text-[10px] font-black uppercase px-2 py-1 rounded-lg shadow-sm">
                Premium
             </div>
           )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{profile.category}</span>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 line-clamp-1 mt-1">{profile.name}</h3>
            </div>
            {profile.isVerified && (
              <div className="size-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <ChevronRight className="size-4" />
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                 {[1, 2, 3, 4, 5].map((s) => (
                   <div key={s} className={`size-3 rounded-full ${s <= (profile.rating || 0) ? 'bg-yellow-400' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                 ))}
              </div>
              <span className="text-[10px] font-bold text-slate-400">{profile.reviewCount || 0} avaliações</span>
            </div>
            <ArrowRight className="size-4 text-slate-300 group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}

function ExplorePropertyCard({ property }: { property: PropertyProps }) {
  return (
    <Link href={`/imoveis/${property.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
        <div className="aspect-16/10 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
           <img 
            src={property.thumbnail || '/images/og-image.png'} 
            alt={property.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
           />
           <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 shadow-sm">
              {property.listingType}
           </div>
        </div>

        <div className="p-6">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{property.type}</span>
          <h3 className="font-extrabold text-slate-900 dark:text-slate-100 line-clamp-1 mt-1">{property.title}</h3>
          
          <div className="mt-4 flex flex-col gap-1">
            <span className="text-xl font-black text-slate-900 dark:text-slate-50">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
              {property.listingType === 'Aluguel' && <span className="text-xs font-bold text-slate-500">/mês</span>}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 opacity-70">
              {property.neighborhood}, {property.city}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-500">
               <div className="flex items-center gap-1">
                  <span className="text-xs font-bold">{property.characteristics?.bedrooms || 0}</span>
                  <span className="text-[10px] uppercase font-medium">Qts</span>
               </div>
               <div className="flex items-center gap-1 border-l pl-3 border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold">{property.characteristics?.area || 0}</span>
                  <span className="text-[10px] uppercase font-medium">m²</span>
               </div>
            </div>
            <ArrowRight className="size-4 text-slate-300 group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}
