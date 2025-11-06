'use client'

import { DashboardCard } from './dashboard-card'

export function DashboardComponent() {
  const kpiData = [] as any
  // const kpiData = [
  //   {
  //     title: 'Anúncios Ativos',
  //     value: '75',
  //     change: '+5% vs. mês passado',
  //     icon: <LayoutList className="h-5 w-5" />,
  //     iconClass: 'text-chart-1',
  //   },
  //   {
  //     title: 'Visualizações',
  //     value: '12.430',
  //     change: '+12.2% vs. mês passado',
  //     icon: <Eye className="h-5 w-5" />,
  //     iconClass: 'text-chart-2',
  //   },
  //   {
  //     title: 'Novas Mensagens',
  //     value: '142',
  //     change: '+8 novos hoje',
  //     icon: <MessageSquare className="h-5 w-5" />,
  //     iconClass: 'text-chart-4',
  //   },
  //   {
  //     title: 'Taxa de Contato',
  //     value: '11.4%',
  //     change: '-0.5% vs. mês passado',
  //     icon: <Percent className="h-5 w-5" />,
  //     iconClass: 'text-chart-5',
  //   },
  // ]

  return (
    <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-3 xl:grid-cols-4">
      <div className="flex size-full flex-col items-center justify-center py-[25vh]">
        <h1 className="font-bold">Painel de controle</h1>
        <p className="nt-4 text-gray-400">Estamos trabalhando nisto</p>
      </div>
      {kpiData.map((data: any, index: any) => (
        <DashboardCard
          key={String(index)}
          title={data.title}
          value={data.value}
          change={data.change}
          icon={data.icon as any}
          iconClass={data.iconClass}
        />
      ))}

      {/* <PropertiesTable />

      <DashboardProfilesTable /> */}
    </main>
  )
}
