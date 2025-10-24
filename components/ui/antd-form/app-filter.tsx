import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { QueryFilter, QueryFilterProps } from '@ant-design/pro-components';
import { ChevronsDown, ChevronsUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import IconButton from '../button/icon-button';

type Props = Omit<QueryFilterProps, 'items'> & {};

export default function AppFilter({
    layout = 'vertical',
    className,
    children,
    ...props
}: Props) {
    const messages = useTranslations();
    const isVertical = layout !== 'horizontal';
    return (
        <QueryFilter
            className={cn(
                'rounded-md bg-white',
                isVertical && [
                    // ép label/input dọc chỉ khi layout != horizontal
                    '[&_.ant-form-item-horizontal]:!flex-col',
                    '[&_.ant-form-item-label]:!w-full [&_.ant-form-item-label]:!max-w-full [&_.ant-form-item-label]:!flex-none [&_.ant-form-item-label]:!text-left [&_.ant-form-item-label]:!font-semibold',
                    '[&_.ant-form-item-control]:!w-full [&_.ant-form-item-control]:!max-w-full [&_.ant-form-item-control]:!flex-none',
                ],
                '[&_.ant-pro-query-filter-actions]:!flex [&_.ant-pro-query-filter-actions]:!items-center [&_.ant-pro-query-filter-actions]:!justify-end [&_.ant-pro-query-filter-actions]:!gap-2',
                className
            )}
            submitter={{
                searchConfig: {
                    submitText: messages('common.search'),
                    resetText: messages('common.clearFilter'),
                },
            }}
            collapseRender={(collapsed) =>
                collapsed ? (
                    <IconButton>
                        <ChevronsDown size={SIZE_ICON} />
                    </IconButton>
                ) : (
                    <IconButton>
                        <ChevronsUp size={SIZE_ICON} />
                    </IconButton>
                )
            }
            span={{ xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 4 }}
            {...props}
            labelWidth="auto"
        >
            {children}
        </QueryFilter>
    );
}
