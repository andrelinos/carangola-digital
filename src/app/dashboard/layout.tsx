import type { Metadata } from 'next'
import { DashboardSidebar } from './_components/dashboard-sidebar'

export const metadata: Metadata = {
  title: 'Carangola Digital',
  description: 'Tenha a cidade ao seu alcance!',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex w-full bg-background font-sans text-foreground antialiased">
      <DashboardSidebar />
      <main className="h-full flex-1 overflow-y-auto transition-all duration-300 ease-in-out md:ml-64">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
