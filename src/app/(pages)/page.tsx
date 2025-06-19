import type { Metadata } from 'next'

import { auth } from '@/lib/auth'
import { trackServerEvent } from '@/lib/mixpanel'
import { getSEOTags } from '@/lib/seo'

import { HeroSection } from '@/components/commons/hero-section'
import { PricingPlans } from '@/components/commons/plan-section'

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
  const session = await auth()

  const hasProfileLink = session?.user?.hasProfileLink || false

  trackServerEvent('page_view', {
    page: 'home',
  })

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <main>
          <HeroSection />
          <PricingPlans />
          {/* <BusinessProfileDemo /> */}
          {/* <FeaturesSection /> */}
          {/* <CTASection /> */}
        </main>
        {/* <Footer /> */}
      </div>
    </>
  )
}
