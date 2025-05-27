'use client';

import { useEffect, useState } from 'react';
import { LogoDark } from './LogoDark';
import { LogoLight } from './LogoLight';

export function Logo() {
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
    return <LogoDark />;
  }

  return <LogoLight />;
}
