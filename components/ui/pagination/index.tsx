import { LOCALE } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';
import { cn } from '@/helpers/tailwind';
import { Pagination, PaginationProps } from 'antd';
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

    const showTotal = (total: number, range: [number, number]) => {
        if (props.showTotal) return props.showTotal(total, range);
        if (!showTotalText) return undefined;

        const offset = formattedNumber(range[0], locale, false);
        const limit = formattedNumber(range[1], locale, false);
        const totalItems = formattedNumber(total, locale, false);

        return (
            <p>
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
            showSizeChanger={false}
            className={cn(
                '!px-5 !py-3 text-center',
                {
                    'text-right': showTotalText,
                },
                className
            )}
            {...props}
            showTotal={showTotal}
            align="end"
        />
    );
}

export default AppPagination;
