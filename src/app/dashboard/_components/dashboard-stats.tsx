'use client'

import { Store, Building2, Eye, MessageSquare, Briefcase } from 'lucide-react'
import { DashboardCard } from './dashboard-card'

export function DashboardStats() {
  const stats = [
    {
      title: 'Empresas Ativas',
      value: '3',
      change: '+1 esta semana',
      icon: <Store className="size-5 text-blue-500" />,
      iconClass: 'text-blue-500',
    },
    {
      title: 'Imóveis Anunciados',
      value: '12',
      change: '+2 novos anúncios',
      icon: <Building2 className="size-5 text-green-500" />,
      iconClass: 'text-green-500',
    },
    {
      title: 'Total de Visitas',
      value: '1.240',
      change: '+15.2% vs. mês passado',
      icon: <Eye className="size-5 text-purple-500" />,
      iconClass: 'text-purple-500',
    },
    {
      title: 'Novos Contatos',
      value: '24',
      change: '8 contatos hoje',
      icon: <MessageSquare className="size-5 text-orange-500" />,
      iconClass: 'text-orange-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, index) => (
        <DashboardCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          iconClass={stat.iconClass}
        />
      ))}
    </div>
  )
}
