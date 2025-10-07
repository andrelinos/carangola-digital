import { Footer } from '@/components/commons/footer'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carangola Digital',
  description: 'Tenha a cidade ao seu alcance!',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function SlugLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      {children}
      <Footer />
    </div>
  )
}
