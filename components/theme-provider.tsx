'use client';

import { THEME } from '@/enums/common';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { useEffect } from 'react';

export default function ThemeProvider() {
    const { themeMode } = useThemeMode();

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            if (themeMode === THEME.SYSTEM) {
                const systemTheme = e.matches ? THEME.DARK : THEME.LIGHT;
                document.documentElement.classList.toggle('dark', e.matches);
            }
        };

        if (themeMode === THEME.SYSTEM) {
            const isDarkMode = mediaQuery.matches;
            document.documentElement.classList.toggle('dark', isDarkMode);
        } else {
            document.documentElement.classList.toggle(
                'dark',
                themeMode === THEME.DARK
            );
        }

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [themeMode]);

    return null;
}
