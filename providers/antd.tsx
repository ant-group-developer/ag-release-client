'use client';
import { LOCALE } from '@/enums/common';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { getThemeConfig } from '@/theme/theme-config';
import { ConfigProvider, ThemeConfig } from 'antd';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import { useLocale } from 'next-intl';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {}

function AntdProvider({ children }: Props) {
    const locale = useLocale();
    const { algorithm, isDark } = useThemeMode();
    const themeConfig = getThemeConfig(isDark);

    const antdThemeConfig: ThemeConfig = {
        ...themeConfig,
        algorithm,
        components: {
            Form: {
                itemMarginBottom: 12,
            },
        },
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
