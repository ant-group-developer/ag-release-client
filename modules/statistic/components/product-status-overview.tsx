import { APP_ROUTES } from '@/enums/routes';
import { cn } from '@/helpers/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import usePermissionStore from '@/hooks/use-permission';
import { ORDER_STATUS } from '@/modules/order/enums';
import { useLocale, useTranslations } from 'next-intl';
import { FilterOrderStatistic } from '../types/order-statistic';
import { ProductStatusCount } from '../types/product-statistic';
import CardStatus, { CardStatusOption } from './card/card-status';

type Props = {
    className?: string;
    ProductStatusData: ProductStatusCount;
    onChangeFilter: OnChangeFilter<FilterOrderStatistic>;
    dataFilter: FilterOrderStatistic;
};

export default function ProductStatusOverview({
    className,
    ProductStatusData,
    onChangeFilter,
    dataFilter,
}: Props) {
    const messages = useTranslations();
    const ProductStatusCount = ProductStatusData.statusCounts;
    const { canRead } = usePermissionStore((state) => state.permission.product);
    const locale = useLocale();

    const options: CardStatusOption[] = [
        {
            title: messages('common.total'),
            value: ProductStatusData.total,
            isTotal: true,
        },
        {
            title: messages('order.status.completed'),
            value: ProductStatusCount.completed,
            status: ORDER_STATUS.COMPLETED,
            tooltip: messages('filter.clickToSeeProduct', {
                status: messages('order.status.completed').toLocaleLowerCase(),
            }),
        },
        {
            title: messages('order.status.new'),
            value: ProductStatusCount.new,
            status: ORDER_STATUS.NEW,
            tooltip: messages('filter.clickToSeeProduct', {
                status: messages('order.status.new').toLocaleLowerCase(),
            }),
        },
        {
            title: messages('order.status.inProgress'),
            value: ProductStatusCount.in_progress,
            status: ORDER_STATUS.IN_PROGRESS,
            tooltip: messages('filter.clickToSeeProduct', {
                status: messages('order.status.inProgress').toLocaleLowerCase(),
            }),
        },
        {
            title: messages('order.status.pendingApproval'),
            value: ProductStatusCount.pending_approval,
            status: ORDER_STATUS.PENDING_APPROVAL,
            tooltip: messages('filter.clickToSeeProduct', {
                status: messages(
                    'order.status.pendingApproval'
                ).toLocaleLowerCase(),
            }),
        },
        {
            title: messages('order.status.reject'),
            value: ProductStatusCount.reject,
            status: ORDER_STATUS.REJECT,
            tooltip: messages('filter.clickToSeeProduct', {
                status: messages('order.status.reject').toLocaleLowerCase(),
            }),
        },
        {
            title: messages('order.status.deadline'),
            value: ProductStatusCount.overdue,
            status: ORDER_STATUS.OVERDUE,
            tooltip: messages('filter.clickToSeeProduct', {
                status: messages('order.status.deadline').toLocaleLowerCase(),
            }),
        },
        {
            title: messages('common.cancel'),
            value: ProductStatusCount.cancel,
            status: ORDER_STATUS.CANCEL,
            tooltip: messages('filter.clickToSeeProduct', {
                status: messages('common.cancel').toLocaleLowerCase(),
            }),
        },
    ];

    const handleClick = (status: ORDER_STATUS) => {
        if (!canRead || !status) return;
        const url = `/${locale}${APP_ROUTES.PRODUCT}?status=${status}&startDateDeadline=${dataFilter.startDate}&endDateDeadline=${dataFilter.endDate}${dataFilter.productTypeId ? `&productTypeId=${dataFilter.productTypeId}` : ''} `;
        window.open(url, '_blank');
    };

    const titleCard = () => {
        return (
            <div className="flex justify-between gap-2">
                {messages('product.label')}

                {/* <TypeSelect
                    allowClear
                    variant="filled"
                    className="min-w-[150px] font-medium"
                    placeholder={messages('productType.label')}
                    onChange={(value) =>
                        onChangeFilter({ productTypeId: value })
                    }
                /> */}
            </div>
        );
    };

    return (
        <div className={cn('', className)}>
            <CardStatus
                onClick={handleClick}
                title={titleCard()}
                options={options}
            />
        </div>
    );
}
