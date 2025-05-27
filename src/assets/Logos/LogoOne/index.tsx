'use client';

import { useEffect, useState } from 'react';

import LogoBlue from '@/assets/Logos/logo-blue.svg';
import LogoOrange from '@/assets/Logos/logo-orange.svg';
import Image from 'next/image';

export function LogoOne() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme =
    typeof window !== 'undefined' && !!(localStorage.theme === 'dark');

  useEffect(() => {
    const themeMode = !!(
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    setIsDarkMode(themeMode);
  }, [theme]);

  if (isDarkMode) {
    return <Image src={LogoOrange} alt="" priority />;
  }

  return <Image src={LogoBlue} alt="" priority />;
}
