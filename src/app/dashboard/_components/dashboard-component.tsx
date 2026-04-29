'use client'

import { DashboardProfilesTable } from './dashboard-profiles-sum-table'
import { PropertiesTable } from './dashboard-properties-table'
import { DashboardStats } from './dashboard-stats'
import { MarketingKit } from './marketing-kit'
import { ProUpgradeBanner } from './pro-upgrade-banner'
import { WelcomeHeader } from './welcome-header'

export function DashboardComponent({
  stats,
  profiles,
  properties,
}: {
  stats: any
  profiles: any[]
  properties: any[]
}) {
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
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <DashboardProfilesTable profiles={profiles} />
        </div>
        <div className="xl:col-span-2">
          <MarketingKit profiles={profiles} />
        </div>
      </div>

      <div className="xl:cols-4 mt-8 grid grid-cols-1">
        <PropertiesTable properties={properties} />
      </div>

      <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/20 py-12 text-muted-foreground opacity-50">
        <p className="font-medium text-sm italic">
          Mais métricas detalhadas em breve...
        </p>
      </div>
    </div>
  )
}
