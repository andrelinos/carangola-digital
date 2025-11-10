import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

import { authOptions } from '@/lib/auth'

import { DashboardSidebar } from './_components/dashboard-sidebar'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/acesso')
  }

  return (
    <div className="flex w-full bg-background font-sans text-foreground antialiased">
      <DashboardSidebar />
      <main className="h-full flex-1 overflow-y-auto transition-all duration-300 ease-in-out md:ml-64">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
