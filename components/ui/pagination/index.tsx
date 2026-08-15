import { LOCALE } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';
import { cn } from '@/helpers/tailwind';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { Pagination, PaginationProps, theme } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';

type AppPaginationProps = {
    showTotalText?: boolean;
} & PaginationProps;

function AppPagination({
    className,
    showTotalText,
    size,
    showSizeChanger = false,
    ...props
}: AppPaginationProps) {
    const isMobile = useIsMobile();
    const locale = useLocale() as LOCALE;
    const messages = useTranslations();
    const { token } = theme.useToken();

    const showSizeChangerConfig = useMemo(() => {
        if (showSizeChanger === true) {
            return { placement: 'topLeft' as const };
        }
        if (showSizeChanger && typeof showSizeChanger === 'object') {
            return { placement: 'topLeft' as const, ...showSizeChanger };
        }
        return showSizeChanger;
    }, [showSizeChanger]);

    const showTotal = (total: number, range: [number, number]) => {
        if (props.showTotal) return props.showTotal(total, range);
        if (!showTotalText || isMobile) return undefined;

        const offset = formattedNumber(range[0], locale, false);
        const limit = formattedNumber(range[1], locale, false);
        const totalItems = formattedNumber(total, locale, false);

        return (
            <p className="whitespace-nowrap">
                <span className="font-semibold">
                    {offset}-{limit}
                </span>{' '}
                {messages('common.of')}{' '}
                <span className="font-semibold">{totalItems}</span>
            </p>
        );
    };

    return (
        <Pagination
            hideOnSinglePage
            showSizeChanger={showSizeChangerConfig}
            size={isMobile ? 'small' : size}
            className={cn(
                'max-w-full rounded-b-lg !px-3 !py-2 text-center max-sm:!flex-wrap max-sm:!justify-center sm:!px-5 sm:!py-3 [&>.ant-pagination-total-text]:whitespace-nowrap max-sm:[&>.ant-pagination-total-text]:!hidden',
                {
                    'text-right': showTotalText && !isMobile,
                },
                className
            )}
            style={{
                backgroundColor: token.colorBgContainer,
            }}
            showTotal={showTotal}
            align={isMobile ? 'center' : 'end'}
            {...props}
        />
    );
}

export default AppPagination;
