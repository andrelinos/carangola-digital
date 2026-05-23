import type { Metadata } from 'next'
// import { getLatestPublicProfiles } from '@/actions/business/get-latest-public-profiles'
import { getLatestPublicProperties } from '@/actions/properties/get-latest-public-properties'
import { trackServerEvent } from '@/lib/mixpanel'
import { BusinessCTA } from './_components/business-cta'
import { CommunityFeatures } from './_components/community-features'
import { HomeHero } from './_components/home-hero'
import { PopularCategories } from './_components/popular-categories'
import { PropertiesCTA } from './_components/properties-cta'
import { RecentListings } from './_components/recent-listings'
import { getFeaturedProfiles } from '@/actions/business/get-featured-profiles'

export const metadata: Metadata = {
  title:
    'Carangola Digital | Guia Comercial, Empresas e Imóveis em Carangola/MG',
  description:
    'O portal oficial de Carangola/MG para encontrar serviços, lojas, profissionais e imóveis para aluguel e venda. Cadastre seu negócio gratuitamente no Carangola Digital!',
  alternates: {
    canonical: 'https://carangoladigital.com.br',
  },
}

export default async function Home() {
  trackServerEvent('page_view', {
    page: 'home_portal',
  })

  const [featuredProfiles, properties] = await Promise.all([
    getFeaturedProfiles(),
    getLatestPublicProperties(),
  ])

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950">
      <main>
        <HomeHero />

        <PopularCategories />

        <RecentListings
          profiles={featuredProfiles || []}
          properties={properties || []}
        />

        <CommunityFeatures />

        <BusinessCTA />

        <PropertiesCTA />
      </main>
    </div>
  )
}
