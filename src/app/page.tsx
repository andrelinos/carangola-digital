import { trackServerEvent } from '@/lib/mixpanel' // Mantive seu Mixpanel
import { getSEOTags } from '@/lib/seo' // Mantive sua função de SEO
import type { Metadata } from 'next'
import { BusinessCTA } from './_components/business-cta'
import { CommunityFeatures } from './_components/community-features'
import { HomeHero } from './_components/home-hero'
import { PopularCategories } from './_components/popular-categories'
import { PropertiesCTA } from './_components/properties-cta'
import { RecentListings } from './_components/recent-listings'

// Componentes da UI e Ícones

/*
================================================================================
METADATA: Atualizado para focar no visitante
================================================================================
*/
export const metadata: Metadata = getSEOTags({
  appName: 'Carangola Digital',
  appDescription:
    'Encontre os melhores estabelecimentos, serviços e imóveis em Carangola e região. O guia completo da cidade em um só lugar.',
  locale: 'pt-BR',
  keywords: [
    'Carangola',
    'Carangola Digital',
    'guia de negócios',
    'imobiliárias',
    'restaurantes',
    'serviços',
    'imóveis para alugar',
  ],
  appDomain: 'https://carangoladigital.com.br/',
  canonicalUrlRelative: '/',
})

/*
================================================================================
PÁGINA PRINCIPAL (Home)
================================================================================
*/
export default async function Home() {
  trackServerEvent('page_view', {
    page: 'home_portal', // Mudei o nome para diferenciar
  })

  return (
    // Fundo da página, compatível com light/dark
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
