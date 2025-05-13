'use client';
import { LOCALE, THEME } from '@/enums/common';
import { useThemeStore } from '@/hooks/use-theme-store';
import { getThemeConfig } from '@/theme/theme-config';
import { ConfigProvider, theme as antdTheme } from 'antd';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import { useLocale } from 'next-intl';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {}

function AntdProvider({ children }: Props) {
    const locale = useLocale();
    const { theme: currentTheme } = useThemeStore();

    const themeConfig = getThemeConfig(currentTheme);

    const antdThemeConfig = {
        ...themeConfig,
        algorithm:
            currentTheme === THEME.DARK
                ? antdTheme.darkAlgorithm
                : antdTheme.defaultAlgorithm,
    };

    return (
        <ConfigProvider
            theme={antdThemeConfig}
            locale={locale === LOCALE.VI ? viVN : enUS}
        >
            {children}
        </ConfigProvider>
    );
}

export default AntdProvider;
