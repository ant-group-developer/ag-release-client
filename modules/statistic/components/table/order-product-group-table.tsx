import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT } from '@/enums/common';
import { calculateComparePercent, formattedDate } from '@/helpers/common';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { GroupCount } from '../../types';
import { FilterOrderStatistic } from '../../types/order-statistic';
import CompareTooltip from '../CompareTooltip';
import ArrowPercent from '../arrow-percent';

type Props = Omit<AppTableProps<GroupCount>, 'columns'> & {
    titleHeader: string;
    dataFilter: FilterOrderStatistic;
};

export default function GroupTable({
    dataFilter,
    titleHeader,
    ...props
}: Props) {
    const messages = useTranslations();

    const columns: ColumnType<GroupCount>[] = [
        {
            title: messages('common.iNo'),
            dataIndex: 'iNo',
            key: 'iNo',
            align: 'center',
            width: 50,
            render: (_, __, index) => index + 1,
        },
        {
            title: messages('common.department'),
            dataIndex: 'nameGroup',
            key: 'nameGroup',
            align: 'left',
            width: 100,
            sorter: (a, b) => a.nameGroup.localeCompare(b.nameGroup),
        },
        {
            title: messages('common.total'),
            dataIndex: 'totalCount',
            key: 'totalCount',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.totalCount - b.totalCount,
            render: (value, record) => {
                const currentTotal = record.totalCount;
                const previousTotal = record.comparison.totalCount;
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
                    record.comparison.previousDate.startDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const prevEndDate = formattedDate(
                    record.comparison.previousDate.endDate,
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
                    <div className="flex items-center">
                        <p className="w-2/5">{value}</p>
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
            title: messages('order.status.new'),
            dataIndex: 'newCount',
            key: 'newCount',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.newCount - b.newCount,
            render: (value, record) => {
                const currentNew = record.newCount;
                const previousNew = record.comparison.newCount;
                const comparePercent = calculateComparePercent(
                    currentNew,
                    previousNew
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
                    record.comparison.previousDate.startDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const prevEndDate = formattedDate(
                    record.comparison.previousDate.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentNew}
                        previous={previousNew}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );
                return (
                    <div className="flex items-center">
                        <p className="w-2/5">{value}</p>
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
            dataIndex: 'inProgressCount',
            key: 'inProgressCount',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.inProgressCount - b.inProgressCount,
            render: (value, record) => {
                const currentProgress = record.inProgressCount;
                const previousProgress = record.comparison.inProgressCount;
                const comparePercent = calculateComparePercent(
                    currentProgress,
                    previousProgress
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
                    record.comparison.previousDate.startDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const prevEndDate = formattedDate(
                    record.comparison.previousDate.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentProgress}
                        previous={previousProgress}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );
                return (
                    <div className="flex items-center">
                        <p className="w-2/5">{value}</p>
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
            dataIndex: 'pendingApprovalCount',
            key: 'pendingApprovalCount',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.pendingApprovalCount - b.pendingApprovalCount,
            render: (value, record) => {
                const currentPendingApproval = record.pendingApprovalCount;
                const previousPendingApproval =
                    record.comparison.pendingApprovalCount;
                const comparePercent = calculateComparePercent(
                    currentPendingApproval,
                    previousPendingApproval
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
                    record.comparison.previousDate.startDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const prevEndDate = formattedDate(
                    record.comparison.previousDate.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentPendingApproval}
                        previous={previousPendingApproval}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );

                return (
                    <div className="flex items-center">
                        <p className="w-2/5">{value}</p>
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
            dataIndex: 'completedCount',
            key: 'completedCount',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.completedCount - b.completedCount,
            render: (value, record) => {
                const currentCompleted = record.completedCount;
                const previousCompleted = record.comparison.completedCount;
                const comparePercent = calculateComparePercent(
                    currentCompleted,
                    previousCompleted
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
                    record.comparison.previousDate.startDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const prevEndDate = formattedDate(
                    record.comparison.previousDate.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentCompleted}
                        previous={previousCompleted}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );
                return (
                    <div className="flex items-center">
                        <p className="w-2/5">{value}</p>
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
            dataIndex: 'rejectCount',
            key: 'rejectCount',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.rejectCount - b.rejectCount,
            render: (value, record) => {
                const currentReject = record.rejectCount;
                const previousReject = record.comparison.rejectCount;
                const comparePercent = calculateComparePercent(
                    currentReject,
                    previousReject
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
                    record.comparison.previousDate.startDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const prevEndDate = formattedDate(
                    record.comparison.previousDate.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentReject}
                        previous={previousReject}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );
                return (
                    <div className="flex items-center">
                        <p className="w-2/5">{value}</p>
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
            dataIndex: 'overdueCount',
            key: 'overdueCount',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.overdueCount - b.overdueCount,
            render: (value, record) => {
                const currentDeadline = record.overdueCount;
                const previousDeadline = record.comparison.overdueCount;
                const comparePercent = calculateComparePercent(
                    currentDeadline,
                    previousDeadline
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
                    record.comparison.previousDate.startDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const prevEndDate = formattedDate(
                    record.comparison.previousDate.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentDeadline}
                        previous={previousDeadline}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );
                return (
                    <div className="flex items-center">
                        <p className="w-2/5">{value}</p>
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
            dataIndex: 'cancelCount',
            key: 'cancelCount',
            align: 'center',
            width: 100,
            sorter: (a, b) => a.cancelCount - b.cancelCount,
            render: (value, record) => {
                const currentCancel = record.cancelCount;
                const previousCancel = record.comparison.cancelCount;
                const comparePercent = calculateComparePercent(
                    currentCancel,
                    previousCancel
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
                    record.comparison.previousDate.startDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const prevEndDate = formattedDate(
                    record.comparison.previousDate.endDate,
                    DATE_FORMAT.DATE_ONLY
                );

                const tooltipTitle = (
                    <CompareTooltip
                        current={currentCancel}
                        previous={previousCancel}
                        startDate={startDate}
                        endDate={endDate}
                        prevStartDate={prevStartDate}
                        prevEndDate={prevEndDate}
                    />
                );
                return (
                    <div className="flex items-center">
                        <p className="w-2/5">{value}</p>
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
        <div className="rounded-lg border">
            <p className="px-6 py-4 pb-4 text-left text-base font-bold">
                {titleHeader}
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
