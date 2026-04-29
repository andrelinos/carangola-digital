'use client'

import { WelcomeHeader } from './welcome-header'
import { DashboardStats } from './dashboard-stats'
import { ProUpgradeBanner } from './pro-upgrade-banner'
import { DashboardProfilesTable } from './dashboard-profiles-sum-table'
import { PropertiesTable } from './dashboard-properties-table'

import { MarketingKit } from './marketing-kit'

export function DashboardComponent({ stats, profiles, properties }: { stats: any, profiles: any[], properties: any[] }) {
  return (
    <div className="flex flex-col">
      {/* 👋 Personalized Greeting */}
      <WelcomeHeader />

      {/* 📊 Key Statistics */}
      <DashboardStats stats={stats} />

      <div className="mb-8">
        <ProUpgradeBanner />
      </div>

      {/* 📋 Listings Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-2">
          <DashboardProfilesTable profiles={profiles} />
        </div>
        <div className="xl:col-span-2">
          <MarketingKit profiles={profiles} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 xl:cols-4">
        <PropertiesTable properties={properties} />
      </div>

      <div className="mt-8 flex flex-col items-center justify-center py-12 border border-dashed rounded-3xl bg-muted/20 text-muted-foreground opacity-50">
        <p className="text-sm font-medium italic">Mais métricas detalhadas em breve...</p>
      </div>
    </div>
  )
}
