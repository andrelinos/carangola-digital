'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Bath, Bed, MapPin, Maximize2 } from 'lucide-react'
import Link from 'next/link'
import type { PropertyProps } from '@/_types/property'
import { Badge } from '@/components/ui/badge'
import { SafeImage } from '@/components/ui/safe-image'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
  property: PropertyProps
  className?: string
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(property.price)

  const thumbnail =
    property.thumbnail || property.images?.[0]?.url || '/default-property.webp'

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-xl',
        className
      )}
    >
      {/* Listing Type Badge */}
      <div className="absolute top-4 left-4 z-20">
        <Badge
          variant={property.listingType === 'Aluguel' ? 'secondary' : 'default'}
          className="border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider shadow-sm"
        >
          {property.listingType}
        </Badge>
      </div>

      {/* Property Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <SafeImage
          src={thumbnail}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Price Overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/60 to-transparent p-4">
          <div className="font-bold text-white text-xl">
            {formattedPrice}
            {property.listingType === 'Aluguel' && (
              <span className="ml-1 font-normal text-sm">/mês</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          <h3 className="line-clamp-1 font-bold text-foreground text-lg transition-colors group-hover:text-primary">
            {property.title}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
            <MapPin className="size-3 text-primary/60" />
            <span className="truncate">
              {property.neighborhood}, {property.city}
            </span>
          </div>
        </div>

        {/* Characteristics */}
        <div className="mt-4 flex items-center justify-between border-border border-y py-4 text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-foreground">
              <Bed className="size-4 text-primary/60" />
              <span className="font-semibold text-sm">
                {property.characteristics?.bedrooms ?? 0}
              </span>
            </div>
            <span className="text-[10px] uppercase">Quartos</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x px-6">
            <div className="flex items-center gap-1.5 text-foreground">
              <Bath className="size-4 text-primary/60" />
              <span className="font-semibold text-sm">
                {property.characteristics?.bathrooms ?? 0}
              </span>
            </div>
            <span className="text-[10px] uppercase">Banheiros</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-foreground">
              <Maximize2 className="size-4 text-primary/60" />
              <span className="font-semibold text-sm">
                {property.characteristics?.area ?? 0}m²
              </span>
            </div>
            <span className="text-[10px] uppercase">Área</span>
          </div>
        </div>

        {/* Action */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-muted-foreground text-xs">{property.type}</span>
          <Link
            href={`/imoveis/${property.slug}`}
            className="inline-flex items-center gap-1.5 font-bold text-primary text-sm transition-all hover:gap-2"
          >
            Ver detalhes
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
