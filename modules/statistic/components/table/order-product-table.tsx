import ExportExcelButton from '@/components/ui/button/export-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT } from '@/enums/common';
import { calculateComparePercent, formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_STATISTIC } from '../../enums';
import { OrderProductStatusCount } from '../../types';
import { FilterOrderStatistic } from '../../types/order-statistic';
import ArrowPercent from '../arrow-percent';
import CompareTooltip from '../CompareTooltip';
import ExcelExportModal from '../modal/excel-export-modal';

type Props = Omit<AppTableProps<OrderProductStatusCount>, 'columns'> & {
    titleHeader: string;
    dataFilter: FilterOrderStatistic;
};

export default function OrderProductStatusTable({
    dataFilter,
    titleHeader,
    ...props
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const typeModal = useModalStore((state) => state.typeModal);

    const columns: ColumnType<OrderProductStatusCount>[] = [
        {
            title: messages('common.iNo'),
            dataIndex: 'iNo',
            key: 'iNo',
            align: 'center',
            width: 50,
            render: (_, __, index) => index + 1,
        },
        {
            title: messages('common.type'),
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            width: 100,
            render: (value) =>
                value === 'order'
                    ? messages('order.title')
                    : messages('product.label'),
        },
        {
            title: messages('common.total'),
            dataIndex: 'total',
            key: 'total',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.total - b.total,
            render: (value, record) => {
                const currentTotal = record?.total;
                const previousTotal = record?.comparison?.total;
                const comparePercent = calculateComparePercent(
                    currentTotal,
                    previousTotal
                );

                const startDate = formattedDate(
                    dataFilter.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const endDate = formattedDate(
                    dataFilter.endDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevStartDate = formattedDate(
                    record?.comparison?.previousDate?.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevEndDate = formattedDate(
                    record?.comparison?.previousDate?.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentTotal}
                        previous={previousTotal}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );

                return (
                    <div className="flex items-center gap-4">
                        <p className="w-2/5 text-right">{value}</p>
                        <CustomTooltip title={tooltipTitle}>
                            <div className="cursor-pointer">
                                <ArrowPercent comparePercent={comparePercent} />
                            </div>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('order.status.new'),
            dataIndex: 'new',
            key: 'new',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.new - b.new,
            render: (value, record) => {
                const currentTotal = record?.new;
                const previousTotal = record?.comparison?.statusCounts?.new;
                const comparePercent = calculateComparePercent(
                    currentTotal,
                    previousTotal
                );
                const startDate = formattedDate(
                    dataFilter.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const endDate = formattedDate(
                    dataFilter.endDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevStartDate = formattedDate(
                    record?.comparison?.previousDate?.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevEndDate = formattedDate(
                    record?.comparison?.previousDate?.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentTotal}
                        previous={previousTotal}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );
                return (
                    <div className="flex items-center gap-4">
                        <p className="w-2/5 text-right">{value}</p>
                        <CustomTooltip title={tooltipTitle}>
                            <div>
                                <ArrowPercent comparePercent={comparePercent} />
                            </div>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('order.status.inProgress'),
            dataIndex: 'inProgress',
            key: 'inProgress',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.inProgress - b.inProgress,
            render: (value, record) => {
                const currentTotal = record?.inProgress;
                const previousTotal =
                    record?.comparison?.statusCounts?.in_progress;
                const comparePercent = calculateComparePercent(
                    currentTotal,
                    previousTotal
                );
                const startDate = formattedDate(
                    dataFilter.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const endDate = formattedDate(
                    dataFilter.endDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevStartDate = formattedDate(
                    record?.comparison?.previousDate?.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevEndDate = formattedDate(
                    record?.comparison?.previousDate?.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentTotal}
                        previous={previousTotal}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );
                return (
                    <div className="flex items-center gap-4">
                        <p className="w-2/5 text-right">{value}</p>
                        <CustomTooltip title={tooltipTitle}>
                            <div>
                                <ArrowPercent comparePercent={comparePercent} />
                            </div>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('order.status.pendingApproval'),
            dataIndex: 'pendingApproval',
            key: 'pendingApproval',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.pendingApproval - b.pendingApproval,
            render: (value, record) => {
                const currentTotal = record?.pendingApproval;
                const previousTotal =
                    record?.comparison?.statusCounts?.pending_approval;
                const comparePercent = calculateComparePercent(
                    currentTotal,
                    previousTotal
                );
                const startDate = formattedDate(
                    dataFilter.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const endDate = formattedDate(
                    dataFilter.endDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevStartDate = formattedDate(
                    record?.comparison?.previousDate?.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevEndDate = formattedDate(
                    record?.comparison?.previousDate?.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentTotal}
                        previous={previousTotal}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );
                return (
                    <div className="flex items-center gap-4">
                        <p className="w-2/5 text-right">{value}</p>
                        <CustomTooltip title={tooltipTitle}>
                            <div>
                                <ArrowPercent comparePercent={comparePercent} />
                            </div>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('order.status.completed'),
            dataIndex: 'completed',
            key: 'completed',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.completed - b.completed,
            render: (value, record) => {
                const currentTotal = record?.completed;
                const previousTotal =
                    record?.comparison?.statusCounts?.completed;
                const comparePercent = calculateComparePercent(
                    currentTotal,
                    previousTotal
                );
                const startDate = formattedDate(
                    dataFilter.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const endDate = formattedDate(
                    dataFilter.endDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevStartDate = formattedDate(
                    record?.comparison?.previousDate?.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevEndDate = formattedDate(
                    record?.comparison?.previousDate?.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentTotal}
                        previous={previousTotal}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );
                return (
                    <div className="flex items-center gap-4">
                        <p className="w-2/5 text-right">{value}</p>
                        <CustomTooltip title={tooltipTitle}>
                            <div>
                                <ArrowPercent comparePercent={comparePercent} />
                            </div>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('order.status.reject'),
            dataIndex: 'reject',
            key: 'reject',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.reject - b.reject,
            render: (value, record) => {
                const currentTotal = record?.reject;
                const previousTotal = record?.comparison?.statusCounts?.reject;
                const comparePercent = calculateComparePercent(
                    currentTotal,
                    previousTotal
                );
                const startDate = formattedDate(
                    dataFilter.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const endDate = formattedDate(
                    dataFilter.endDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevStartDate = formattedDate(
                    record?.comparison?.previousDate?.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevEndDate = formattedDate(
                    record?.comparison?.previousDate?.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentTotal}
                        previous={previousTotal}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );
                return (
                    <div className="flex items-center gap-4">
                        <p className="w-2/5 text-right">{value}</p>
                        <CustomTooltip title={tooltipTitle}>
                            <div>
                                <ArrowPercent
                                    comparePercent={comparePercent}
                                    reverseColors={true}
                                />
                            </div>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('order.status.deadline'),
            dataIndex: 'overdue',
            key: 'overdue',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.overdue - b.overdue,
            render: (value, record) => {
                const currentTotal = record?.overdue;
                const previousTotal = record?.comparison?.statusCounts?.overdue;
                const comparePercent = calculateComparePercent(
                    currentTotal,
                    previousTotal
                );
                const startDate = formattedDate(
                    dataFilter.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const endDate = formattedDate(
                    dataFilter.endDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevStartDate = formattedDate(
                    record?.comparison?.previousDate?.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevEndDate = formattedDate(
                    record?.comparison?.previousDate?.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentTotal}
                        previous={previousTotal}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );
                return (
                    <div className="flex items-center gap-4">
                        <p className="w-2/5 text-right">{value}</p>
                        <CustomTooltip title={tooltipTitle}>
                            <div>
                                <ArrowPercent
                                    comparePercent={comparePercent}
                                    isReverse={true}
                                />
                            </div>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('common.cancel'),
            dataIndex: 'cancel',
            key: 'cancel',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.cancel - b.cancel,
            render: (value, record) => {
                const currentTotal = record?.cancel;
                const previousTotal = record?.comparison?.statusCounts?.cancel;
                const comparePercent = calculateComparePercent(
                    currentTotal,
                    previousTotal
                );
                const startDate = formattedDate(
                    dataFilter.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const endDate = formattedDate(
                    dataFilter.endDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevStartDate = formattedDate(
                    record?.comparison?.previousDate?.startDate,
                    DATE_FORMAT.DATE_ONLY
                );
                const prevEndDate = formattedDate(
                    record?.comparison?.previousDate?.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentTotal}
                        previous={previousTotal}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );
                return (
                    <div className="flex items-center gap-4">
                        <p className="w-2/5 text-right">{value}</p>
                        <CustomTooltip title={tooltipTitle}>
                            <div>
                                <ArrowPercent
                                    reverseColors={true}
                                    comparePercent={comparePercent}
                                />
                            </div>
                        </CustomTooltip>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="rounded-md border">
            <p className="flex justify-between px-6 py-4 pb-4 text-left text-base font-bold">
                {titleHeader}
                <ExportExcelButton
                    text={messages('statistic.exportStatisticOrder')}
                    type="default"
                    onClick={() => openModal(TYPE_MODAL_STATISTIC.EXCEL)}
                />
                {typeModal === TYPE_MODAL_STATISTIC.EXCEL && (
                    <ExcelExportModal
                        dataFilter={dataFilter}
                        title={messages('statistic.exportStatisticOrder')}
                    />
                )}
            </p>
            <AppTable
                {...props}
                pagination={false}
                // size="large"
                columns={columns}
                // rowClassName={() => 'group'}
                scroll={{ y: 235 }}
            />
        </div>
    );
}
