import { trackServerEvent } from '@/lib/mixpanel' // Mantive seu Mixpanel

import { BusinessCTA } from './_components/business-cta'
import { CommunityFeatures } from './_components/community-features'
import { HomeHero } from './_components/home-hero'
import { PopularCategories } from './_components/popular-categories'
import { PropertiesCTA } from './_components/properties-cta'
import { RecentListings } from './_components/recent-listings'

export default async function Home() {
  trackServerEvent('page_view', {
    page: 'home_portal',
  })

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900">
      <main>
        {/* --- Seção Hero com Busca por Abas --- */}
        <HomeHero />

        {/* --- Seção de Categorias Populares --- */}
        <PopularCategories />

        {/* --- Seção de Adicionados Recentemente --- */}
        <RecentListings />

        {/* --- Seção de Utilidade Pública --- */}
        <CommunityFeatures />

        {/* --- Seção CTA para Anunciantes --- */}
        <BusinessCTA />

        {/* --- Seção CTA para Imóveis --- */}
        <PropertiesCTA />
      </main>
      {/* <Footer />  (Seu footer aqui) */}
    </div>
  )
}
