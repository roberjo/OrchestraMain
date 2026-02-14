import { useEffect } from 'react';
import { useStore } from '@/store/index.ts';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);

  useEffect(() => {
    const htmlElement = document.documentElement;
    const isDarkNow = htmlElement.classList.contains('dark');
    const shouldBeDark = theme === 'dark';

    // Only update if theme state differs from what's currently applied
    if (isDarkNow !== shouldBeDark) {
      if (shouldBeDark) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    }

    // Ensure localStorage is synced
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme, setTheme]);

  return <>{children}</>;
}
