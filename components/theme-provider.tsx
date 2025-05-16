'use client';

import { THEME } from '@/enums/common';
import { useThemeStore } from '@/hooks/use-theme-store';
import { useEffect } from 'react';

export default function ThemeProvider() {
    const { theme } = useThemeStore();

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            if (theme === THEME.SYSTEM) {
                const systemTheme = e.matches ? THEME.DARK : THEME.LIGHT;
                document.documentElement.classList.toggle('dark', e.matches);
            }
        };

        if (theme === THEME.SYSTEM) {
            const isDarkMode = mediaQuery.matches;
            document.documentElement.classList.toggle('dark', isDarkMode);
        } else {
            document.documentElement.classList.toggle(
                'dark',
                theme === THEME.DARK
            );
        }

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [theme]);

    return null;
}
