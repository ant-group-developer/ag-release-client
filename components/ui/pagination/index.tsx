import { LOCALE } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';
import { cn } from '@/helpers/tailwind';
import { Pagination, PaginationProps, theme } from 'antd';
import { useLocale, useTranslations } from 'next-intl';

type AppPaginationProps = {
    showTotalText?: boolean;
} & PaginationProps;

function AppPagination({
    className,
    showTotalText,
    ...props
}: AppPaginationProps) {
    const locale = useLocale() as LOCALE;
    const messages = useTranslations();
    const { token } = theme.useToken();
    const showTotal = (total: number, range: [number, number]) => {
        if (props.showTotal) return props.showTotal(total, range);
        if (!showTotalText) return undefined;

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
            showSizeChanger={false}
            className={cn(
                'max-w-full flex-wrap gap-y-2 overflow-x-auto rounded-b-lg !px-5 !py-3 text-center [&>.ant-pagination-total-text]:whitespace-nowrap',
                {
                    'text-right': showTotalText,
                },
                className
            )}
            style={{
                backgroundColor: token.colorBgContainer,
            }}
            {...props}
            showTotal={showTotal}
            align="end"
        />
    );
}

export default AppPagination;
