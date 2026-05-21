import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { verifyAdmin } from '@/app/server/verify-admin.server'

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

  const isAdmin = await verifyAdmin()

  return (
    <div className="flex w-full bg-background font-sans text-foreground antialiased">
      <div className="print:hidden">
        <DashboardSidebar isAdmin={isAdmin} />
      </div>
      <main className="h-full flex-1 overflow-y-auto transition-all duration-300 ease-in-out md:ml-64 print:ml-0 print:overflow-visible">
        <div className="px-4 pt-20 pb-4 md:px-8 md:pt-[84px] md:pb-8 print:p-0">
          {children}
        </div>
      </main>
    </div>
  )
}
