import '@/styles/globals.css'

import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'

import { cn } from '@/lib/utils'

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Carangola Digital',
  description: 'Tenha a cidade ao seu alcance!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn('text-zinc-700 antialiased', quicksand.className)}>
        {children}
      </body>
    </html>
  )
}
