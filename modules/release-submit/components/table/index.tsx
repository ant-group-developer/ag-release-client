import IconButton from '@/components/ui/button/icon-button';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_RELEASE_EXECUTION } from '@/modules/release-executions/enums';
import { ProColumns } from '@ant-design/pro-components';
import { Tag, Typography } from 'antd';
import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
    formatDurationShort,
    formatEnumLabel,
    formatRelativeShort,
    getReleaseSubmitStatusColor,
} from '../../helpers';
import { ReleaseSubmitData, ReleaseSubmitFilter } from '../../types';

type Props = Omit<AppProTableProps<ReleaseSubmitData>, 'columns'> & {
    dataFilter: ReleaseSubmitFilter;
    onChangeFilter: OnChangeFilter<ReleaseSubmitFilter>;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function ReleaseSubmitTable({ dataFilter, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const columns: ProColumns<ReleaseSubmitData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) =>
                getIndex(
                    props?.pagination?.pageSize,
                    props?.pagination?.current,
                    index
                ),
        },
        {
            title: messages('releaseExecution.columns.upc'),
            key: 'upc',
            width: 120,
            fixed: 'left',
            ellipsis: true,
            render: (_, record) => (
                <Typography.Text copyable>
                    {record?.metadata?.input?.releaseSnapshot?.upc || '-'}
                </Typography.Text>
            ),
        },
        {
            title: messages('releaseExecution.columns.releaseName'),
            key: 'releaseId',
            width: 220,
            render: (_, record) => (
                <Typography.Text copyable>
                    {record?.metadata?.input?.releaseSnapshot?.title || '-'}
                </Typography.Text>
            ),
        },
        {
            title: messages('releaseExecution.columns.status'),
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (_, record) =>
                record.status ? (
                    <Tag color={getReleaseSubmitStatusColor(record.status)}>
                        {formatEnumLabel(record.status)}
                    </Tag>
                ) : (
                    '-'
                ),
        },
        {
            title: messages('releaseExecution.columns.targetDspCodes'),
            key: 'dspCodes',
            width: 240,
            render: (_, record) => (
                <span>
                    {record?.metadata?.input?.dspCodes?.length
                        ? record.metadata.input.dspCodes.join(', ')
                        : '-'}
                </span>
            ),
        },
        {
            title: messages('releaseExecution.columns.since'),
            key: 'since',
            width: 120,
            render: (_, record) => {
                const sinceText =
                    formatRelativeShort(record?.completedAt) ??
                    formatRelativeShort(record?.createdAt);
                const completedText = formatDurationShort(
                    record?.createdAt,
                    record?.completedAt
                );

                if (!sinceText && !completedText && !record?.summary)
                    return '-';

                const tooltipTitle = (
                    <div>
                        <p>
                            {messages('common.startedAt')}:{' '}
                            {formattedDate(record?.createdAt)}
                        </p>
                        {record?.completedAt && (
                            <p>
                                {messages('common.completedAt')}:{' '}
                                {formattedDate(record?.completedAt)}
                            </p>
                        )}
                    </div>
                );

                return (
                    <CustomTooltip title={tooltipTitle}>
                        <div className="min-w-0">
                            {sinceText && (
                                <div className="text-blue-500">
                                    {messages('common.startedAt')} {sinceText}
                                </div>
                            )}
                            {completedText && (
                                <Typography.Text
                                    type="secondary"
                                    className="!text-xs"
                                >
                                    {completedText}
                                </Typography.Text>
                            )}
                        </div>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.createdAt'),
            dataIndex: 'submit.createdAt',
            key: 'submit.createdAt',
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter?.orderBy,
                dataFilter?.fieldOrder,
                'submit.createdAt'
            ),
            width: 100,
            render: (value, record) =>
                record?.createdAt
                    ? formattedDate(record?.createdAt, DATE_FORMAT.DATE_MINUTE)
                    : '-',
        },
        {
            title: '',
            key: 'actions',
            width: 60,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
                <IconButton
                    onClick={() =>
                        openModal(TYPE_MODAL_RELEASE_EXECUTION.DETAIL, record)
                    }
                >
                    <Eye size={SIZE_ICON} />
                </IconButton>
            ),
        },
    ];

    return <AppProTable {...props} columns={columns} pagination={false} />;
}
