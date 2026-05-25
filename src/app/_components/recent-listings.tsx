'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Building2, Store } from 'lucide-react'
import Link from 'next/link'
import type { PropertyProps } from '@/_types/property'
import type { PublicProfileCardData } from '@/actions/business/get-latest-public-profiles'
import { BusinessCard } from '@/components/business/business-card'
import { PropertyCard } from '@/components/properties/property-card'

interface RecentListingsProps {
  profiles: PublicProfileCardData[]
  properties: PropertyProps[]
}

export function RecentListings({ profiles, properties }: RecentListingsProps) {
  return (
    <div className="flex flex-col gap-16 py-16 md:py-24">
      {/* Featured Businesses Section */}
      <section className="container mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <div className="mb-2 flex items-center justify-center gap-2 text-primary md:justify-start">
              <Store className="size-5" />
              <span className="font-bold text-sm uppercase tracking-wider">
                Comércio Local
              </span>
            </div>
            <h2 className="font-bold text-3xl text-slate-900 tracking-tight lg:text-4xl dark:text-slate-100">
              Empresas em Destaque
            </h2>
            <p className="mt-2 text-muted-foreground">
              Conheça os melhores estabelecimentos da nossa cidade.
            </p>
          </div>
          <Link
            href="/business"
            className="group flex items-center gap-2 font-semibold text-primary text-sm hover:underline"
          >
            Ver todas as empresas{' '}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {profiles.slice(0, 4).map((profile, index) => (
            <motion.div
              key={profile.id || profile.slug + index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex justify-center"
            >
              <BusinessCard profile={profile} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Properties Section */}
      <section className="container mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <div className="mb-2 flex items-center justify-center gap-2 text-primary md:justify-start">
              <Building2 className="size-5" />
              <span className="font-bold text-sm uppercase tracking-wider">
                Imóveis
              </span>
            </div>
            <h2 className="font-bold text-3xl text-slate-900 tracking-tight lg:text-4xl dark:text-slate-100">
              Novos Imóveis
            </h2>
            <p className="mt-2 text-muted-foreground">
              As melhores oportunidades imobiliárias em Carangola.
            </p>
          </div>
          <Link
            href="/imoveis"
            className="group flex items-center gap-2 font-semibold text-primary text-sm hover:underline"
          >
            Ver todos os imóveis{' '}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.slice(0, 4).map((property, index) => (
            <motion.div
              key={property.id || property.slug + index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex justify-center"
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
