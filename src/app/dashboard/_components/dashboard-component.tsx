'use client'

import { WelcomeHeader } from './welcome-header'
import { DashboardStats } from './dashboard-stats'
import { ProUpgradeBanner } from './pro-upgrade-banner'
import { DashboardProfilesTable } from './dashboard-profiles-sum-table'
import { PropertiesTable } from './dashboard-properties-table'

export function DashboardComponent() {
  return (
    <div className="flex flex-col">
      {/* 👋 Personalized Greeting */}
      <WelcomeHeader />

      {/* 📊 Key Statistics */}
      <DashboardStats />

      {/* 🚀 Monetization CTA */}
      <ProUpgradeBanner />

      {/* 📋 Listings Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-2">
          <DashboardProfilesTable />
        </div>
        <div className="xl:col-span-2">
          <PropertiesTable />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center py-12 border border-dashed rounded-3xl bg-muted/20 text-muted-foreground opacity-50">
        <p className="text-sm font-medium italic">Mais métricas detalhadas em breve...</p>
      </div>
    </div>
  )
}
