'use client';

import { LOCALE } from '@/enums/common';
import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale as useLocaleIntl } from 'next-intl';
import { useQueryParams } from './use-query-params';

export const useLocale = () => {
    const locale = useLocaleIntl() as LOCALE;
    const router = useRouter();
    const pathname = usePathname();
    const queryParams = useQueryParams();

    const switchLocale = (value: LOCALE) => {
        router.replace({ pathname, query: queryParams }, { locale: value });
    };

    return {
        locale,
        switchLocale,
    };
};
