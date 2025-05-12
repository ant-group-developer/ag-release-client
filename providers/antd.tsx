import { LOCALE } from '@/enums/common';
import theme from '@/theme/antd-config';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import { useLocale } from 'next-intl';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {}

function AntdProvider({ children }: Props) {
    const locale = useLocale();
    return (
        <ConfigProvider
            theme={theme}
            locale={locale === LOCALE.VI ? viVN : enUS}
        >
            {children}
        </ConfigProvider>
    );
}

export default AntdProvider;
