import ExportExcelButton from '@/components/ui/button/export-button';
import { APP_ROUTES } from '@/enums/routes';
import { OnChangeFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import usePermissionStore from '@/hooks/use-permission';
import { ORDER_STATUS } from '@/modules/order/enums';
import { useLocale, useTranslations } from 'next-intl';
import { TYPE_MODAL_STATISTIC } from '../enums';
import {
    FilterOrderStatistic,
    OrderStatusCount,
} from '../types/order-statistic';
import CardStatus, { CardStatusOption } from './card/card-status';
import ExcelExportModal from './modal/excel-export-modal';

type Props = {
    orderStatusData: OrderStatusCount;
    onChangeFilter: OnChangeFilter<FilterOrderStatistic>;
    dataFilter: FilterOrderStatistic;
};

export default function OrderStatusOverview({
    orderStatusData,
    onChangeFilter,
    dataFilter,
}: Props) {
    const messages = useTranslations();
    const orderStatusCount = orderStatusData.statusCounts;
    const { canRead } = usePermissionStore((state) => state.permission.order);
    const locale = useLocale();
    const typeModal = useModalStore((state) => state.typeModal);
    const openModal = useModalStore((state) => state.openModal);

    const options: CardStatusOption[] = [
        {
            title: messages('common.total'),
            value: orderStatusData.total,
            //@ts-ignore
            status: null,
        },
        {
            title: messages('order.status.completed'),
            value: orderStatusCount.completed,
            status: ORDER_STATUS.COMPLETED,
            tooltip: messages('filter.clickToSeeOrder', {
                status: messages('order.status.completed').toLocaleLowerCase(),
            }),
        },
        {
            title: messages('order.status.new'),
            value: orderStatusCount.new,
            status: ORDER_STATUS.NEW,
            tooltip: messages('filter.clickToSeeOrder', {
                status: messages('order.status.new').toLocaleLowerCase(),
            }),
        },
        {
            title: messages('order.status.inProgress'),
            value: orderStatusCount.in_progress,
            status: ORDER_STATUS.IN_PROGRESS,
            tooltip: messages('filter.clickToSeeOrder', {
                status: messages('order.status.inProgress').toLocaleLowerCase(),
            }),
        },
        {
            title: messages('order.status.pendingApproval'),
            value: orderStatusCount.pending_approval,
            status: ORDER_STATUS.PENDING_APPROVAL,
            tooltip: messages('filter.clickToSeeOrder', {
                status: messages(
                    'order.status.pendingApproval'
                ).toLocaleLowerCase(),
            }),
        },
        {
            title: messages('order.status.reject'),
            value: orderStatusCount.reject,
            status: ORDER_STATUS.REJECT,
            tooltip: messages('filter.clickToSeeOrder', {
                status: messages('order.status.reject').toLocaleLowerCase(),
            }),
        },
        {
            title: messages('order.status.deadline'),
            value: orderStatusCount.overdue,
            status: ORDER_STATUS.OVERDUE,
            tooltip: messages('filter.clickToSeeOrder', {
                status: messages('order.status.deadline').toLocaleLowerCase(),
            }),
        },
        {
            title: messages('common.cancel'),
            value: orderStatusCount.cancel,
            status: ORDER_STATUS.CANCEL,
            tooltip: messages('filter.clickToSeeOrder', {
                status: messages('common.cancel').toLocaleLowerCase(),
            }),
        },
    ];

    const handleClick = (status: ORDER_STATUS) => {
        if (!canRead || !status) return;
        const url = `/${locale}${APP_ROUTES.ORDER}?status=${status}&startDateDeadline=${dataFilter.startDate}&endDateDeadline=${dataFilter.endDate}${dataFilter.productTypeId ? `&productTypeId=${dataFilter.productTypeId}` : ''} `;
        window.open(url, '_blank');
    };

    const titleCard = () => {
        return (
            <div className="flex justify-between gap-2">
                {messages('order.title')}
                {/* <TypeSelect
                    allowClear
                    variant="filled"
                    className="min-w-[150px] font-medium"
                    placeholder={messages('productType.label')}
                    onChange={(value) =>
                        onChangeFilter({ productTypeId: value })
                    }
                /> */}
                <ExportExcelButton
                    type="default"
                    onClick={() => openModal(TYPE_MODAL_STATISTIC.EXCEL)}
                />
                {typeModal === TYPE_MODAL_STATISTIC.EXCEL && (
                    <ExcelExportModal dataFilter={dataFilter} />
                )}
            </div>
        );
    };

    return (
        <div>
            <CardStatus
                title={titleCard()}
                options={options}
                onClick={handleClick}
            />
        </div>
    );
}
