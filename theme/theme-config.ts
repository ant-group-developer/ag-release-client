import { defaultConfig } from '@/constants/env';
import { THEME } from '@/enums/common';
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
    colorBorder: '#d9d9d9',
    cardBg: '#f2f2f2',
    cardBgHover: '#e5e5e5',
    fontFamily: 'var(--font-inter), Inter, sans-serif',
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
    colorBorder: '#424242',
    cardBg: '#2a2a2a',
    cardBgHover: '#3a3a3a',
    fontFamily: 'var(--font-inter), Inter, sans-serif',
};

export const getThemeConfig = (mode: THEME): ThemeConfig => {
    const tokens = mode === THEME.DARK ? darkThemeTokens : lightThemeTokens;

    return {
        token: tokens,
    };
};
