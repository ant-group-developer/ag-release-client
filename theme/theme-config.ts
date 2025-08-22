import { defaultConfig } from '@/constants/env';
import type { ThemeConfig } from 'antd';

export const lightThemeTokens = {
    colorPrimary: '#1677ff',
    colorInfo: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorText: defaultConfig.TEXT_COLOR || '#252525',
    colorTextHeading: '#3f4254',
    colorTextSecondary: '#666666',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f0f2f5',
    colorBorder: 'rgb(229, 231, 235)',
    cardBg: '#f2f2f2',
    cardBgHover: '#e5e5e5',
    fontFamily: 'var(--font-inter), Inter, sans-serif',
    colorBgContainerDisabled: '#f5f5f5', // Background container khi disabled
    colorBorderBg: '#d9d9d9',
    // colorTextDisabled: defaultConfig.TEXT_COLOR,
};

export const darkThemeTokens = {
    colorPrimary: '#1668dc',
    colorInfo: '#1668dc',
    colorSuccess: '#49aa19',
    colorWarning: '#d89614',
    colorError: '#dc4446',
    colorText: '#ffffff',
    colorTextHeading: '#3f4254',
    colorTextSecondary: '#a6a6a6',
    colorBgContainer: '#141414',
    colorBgLayout: '#000000',
    colorBorder: 'rgb(39, 39, 42)',
    cardBg: '#2a2a2a',
    cardBgHover: '#3a3a3a',
    fontFamily: 'var(--font-inter), Inter, sans-serif',
    colorBgContainerDisabled: '#2a2a2a',
    colorBorderBg: '#666666',
    colorTextDisabled: '#fff',
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
