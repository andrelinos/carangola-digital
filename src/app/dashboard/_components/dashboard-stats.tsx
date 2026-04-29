'use client'

import { Building2, Eye, MessageSquare, Store } from 'lucide-react'
import { DashboardCard } from './dashboard-card'

interface DashboardStatsData {
  activeBusinesses: number
  announcedProperties: number
  totalVisits: number
  newLeads: number
}

interface DashboardStatsProps {
  stats?: DashboardStatsData
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  // Fallback para evitar erros caso stats seja undefined
  const data = stats || {
    activeBusinesses: 0,
    announcedProperties: 0,
    totalVisits: 0,
    newLeads: 0,
  }

  const statsConfig = [
    {
      title: 'Empresas Ativas',
      value: data.activeBusinesses.toString(),
      change: data.activeBusinesses > 0 ? '+1 esta semana' : 'Nenhuma ativa',
      trend: data.activeBusinesses > 0 ? ('up' as const) : ('neutral' as const),
      icon: <Store className="size-5 text-blue-500" />,
      iconClass: 'text-blue-500',
      sparkline: [
        data.activeBusinesses,
        data.activeBusinesses,
        data.activeBusinesses,
        data.activeBusinesses,
        data.activeBusinesses,
        data.activeBusinesses,
        data.activeBusinesses,
      ],
    },
    {
      title: 'Imóveis Anunciados',
      value: data.announcedProperties.toString(),
      change:
        data.announcedProperties > 0 ? '+2 novos anúncios' : 'Nenhum imóvel',
      trend:
        data.announcedProperties > 0 ? ('up' as const) : ('neutral' as const),
      icon: <Building2 className="size-5 text-green-500" />,
      iconClass: 'text-green-500',
      sparkline: [
        data.announcedProperties,
        data.announcedProperties,
        data.announcedProperties,
        data.announcedProperties,
        data.announcedProperties,
        data.announcedProperties,
        data.announcedProperties,
      ],
    },
    {
      title: 'Cliques no WhatsApp',
      value: data.totalVisits.toLocaleString('pt-BR'),
      change: '+15.2% vs. mês passado',
      trend: 'up' as const,
      icon: <Eye className="size-5 text-purple-500" />,
      iconClass: 'text-purple-500',
      sparkline: [
        data.totalVisits * 0.5,
        data.totalVisits * 0.6,
        data.totalVisits * 0.7,
        data.totalVisits * 0.8,
        data.totalVisits * 0.9,
        data.totalVisits * 0.95,
        data.totalVisits,
      ],
    },
    {
      title: 'Novos Leads',
      value: data.newLeads.toString(),
      change: '+12% hoje',
      trend: 'up' as const,
      icon: <MessageSquare className="size-5 text-orange-500" />,
      iconClass: 'text-orange-500',
      sparkline: [
        data.newLeads * 0.1,
        data.newLeads * 0.3,
        data.newLeads * 0.2,
        data.newLeads * 0.5,
        data.newLeads * 0.7,
        data.newLeads * 0.9,
        data.newLeads,
      ],
    },
  ]

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map(stat => (
        <DashboardCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          icon={stat.icon}
          iconClass={stat.iconClass}
          sparkline={stat.sparkline}
        />
      ))}
    </div>
  )
}
