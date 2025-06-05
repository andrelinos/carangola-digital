import { Footer } from '@/components/commons/footer'
import { HeaderHome } from '@/components/commons/headers'
import '@/styles/globals.css'

import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
})

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
      <HeaderHome />
      {children}
      <Footer />
    </div>
  )
}
