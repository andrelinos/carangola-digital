'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import LogoBlue from '@/assets/Logos/logo-blue.svg'
import LogoOrange from '@/assets/Logos/logo-orange.svg'

export function LogoOne() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const _theme =
    typeof window !== 'undefined' && !!(localStorage.theme === 'dark')

  useEffect(() => {
    const themeMode = !!(
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
    setIsDarkMode(themeMode)
  }, [])

  if (isDarkMode) {
    return <Image src={LogoOrange} alt="" priority />
  }

  return <Image src={LogoBlue} alt="" priority />
}
