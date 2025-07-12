import type { Metadata } from 'next'

import { trackServerEvent } from '@/lib/mixpanel'
import { getSEOTags } from '@/lib/seo'

import { ActionSection } from '@/components/commons/action-section'
import { BenefitsSection } from '@/components/commons/benefits-section'
import { HeroSection } from '@/components/commons/hero-section'

export const metadata: Metadata = getSEOTags({
  appName: 'Carangola Digital',
  appDescription:
    'Carangola Digital é uma plataforma para divulgar negócios locais.',
  locale: 'pt-BR',
  keywords: [
    'Carangola',
    'Carangola Digital',
    'link na bio',
    'negócios',
    'redes sociais',
    'link',
  ],
  appDomain: 'https://carangoladigital.com.br/',
  canonicalUrlRelative: '/',
})

export default async function Home() {
  trackServerEvent('page_view', {
    page: 'home',
  })

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <main>
          <HeroSection />
          <BenefitsSection />
          <ActionSection />
          {/* <BusinessProfileDemo /> */}
          {/* <FeaturesSection /> */}
          {/* <CTASection /> */}
        </main>
        {/* <Footer /> */}
      </div>
    </>
  )
}
