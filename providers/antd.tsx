'use client';
import { LOCALE } from '@/enums/common';
import { setAntdStaticInstances } from '@/helpers/antd-static';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { getThemeConfig } from '@/theme/theme-config';
import { App, ConfigProvider, ThemeConfig } from 'antd';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import { useLocale } from 'next-intl';
import { PropsWithChildren, useEffect } from 'react';

interface Props extends PropsWithChildren {}

/** Bridge component to capture Ant Design's static instances */
function AntdStaticBridge() {
    const { message, notification, modal } = App.useApp();

    useEffect(() => {
        setAntdStaticInstances(message, notification, modal);
    }, [message, notification, modal]);

    return null;
}

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
            <App>
                <AntdStaticBridge />
                {children}
            </App>
        </ConfigProvider>
    );
}

export default AntdProvider;
