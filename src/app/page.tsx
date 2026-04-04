import { trackServerEvent } from '@/lib/mixpanel'
import { getLatestPublicProfiles } from '@/actions/business/get-latest-public-profiles'
import { getLatestPublicProperties } from '@/actions/properties/get-latest-public-properties'

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

  const [profiles, properties] = await Promise.all([
    getLatestPublicProfiles(),
    getLatestPublicProperties()
  ])

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950">
      <main>
        <HomeHero />

        <PopularCategories />

        <RecentListings 
          profiles={profiles || []} 
          properties={properties || []} 
        />

        <CommunityFeatures />

        <BusinessCTA />

        <PropertiesCTA />
      </main>
    </div>
  )
}
