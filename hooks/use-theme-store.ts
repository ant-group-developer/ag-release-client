import { LOCAL_STORAGE_KEY, THEME } from '@/enums/common';
import { create } from 'zustand';

type ThemeStore = {
    theme: THEME;
    toggleTheme: (newTheme?: THEME) => void;
    setTheme: (theme: THEME) => void;
};

export const useThemeStore = create<ThemeStore>((set) => {
    const savedTheme =
        typeof window !== 'undefined'
            ? (localStorage.getItem(LOCAL_STORAGE_KEY.THEME) as THEME) ||
              THEME.SYSTEM
            : THEME.SYSTEM;

    return {
        theme: savedTheme,
        toggleTheme: (newTheme?: THEME) => {
            set((state) => {
                let themeToSet: THEME;

                if (newTheme) {
                    themeToSet = newTheme;
                } else {
                    if (state.theme === THEME.LIGHT) {
                        themeToSet = THEME.DARK;
                    } else if (state.theme === THEME.DARK) {
                        themeToSet = THEME.SYSTEM;
                    } else {
                        themeToSet = THEME.LIGHT;
                    }
                }

                if (typeof window !== 'undefined') {
                    localStorage.setItem(LOCAL_STORAGE_KEY.THEME, themeToSet);
                }

                return { theme: themeToSet };
            });
        },
        setTheme: (theme: THEME) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem(LOCAL_STORAGE_KEY.THEME, theme);
            }
            set({ theme });
        },
    };
});
