import { defaultConfig } from '@/constants/env';
import type { ThemeConfig } from 'antd';

export const lightThemeTokens = {
    colorText: defaultConfig.TEXT_COLOR || '#252525',
    fontFamily: 'var(--font-inter), Inter, sans-serif',
};

export const darkThemeTokens = {
    fontFamily: 'var(--font-inter), Inter, sans-serif',
};

const componentsDark = {};

const componentsLight = {};

export const getThemeConfig = (
    isDark: boolean
    // primaryColor: string
): ThemeConfig => {
    const tokens = isDark ? darkThemeTokens : lightThemeTokens;
    const components = isDark ? componentsDark : componentsLight;
    return {
        token: {
            ...tokens,
            // colorPrimary: primaryColor,
        },
        components,
    };
};
