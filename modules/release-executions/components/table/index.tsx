import IconButton from '@/components/ui/button/icon-button';
import AppProTable, { AppProTableProps } from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { formattedDate, getIndex } from '@/helpers/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { ProColumns } from '@ant-design/pro-components';
import { Popconfirm, Tag, Typography } from 'antd';
import { Eye, RotateCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
    RELEASE_EXECUTION_STATUS,
    TYPE_MODAL_RELEASE_EXECUTION,
} from '../../enums';
import {
    formatDurationShort,
    formatRelativeShort,
    getStatusColor,
} from '../../helpers';
import { useRetryReleaseExecution } from '../../hooks/use-retry';
import { ReleaseExecutionData, ReleaseExecutionFilter } from '../../types';

type Props = Omit<AppProTableProps<ReleaseExecutionData>, 'columns'> & {
    dataFilter: ReleaseExecutionFilter;
    onChangeFilter: OnChangeFilter<ReleaseExecutionFilter>;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function ReleaseExecutionTable({ ...props }: Props) {
    const messages = useTranslations();
    const { retryReleaseExecution, isPending } = useRetryReleaseExecution();
    const openModal = useModalStore((state) => state.openModal);

    const getStatusLabel = (status?: RELEASE_EXECUTION_STATUS) => {
        if (!status) return '-';

        return messages(`releaseExecution.statusOptionsV2.${status}`);
    };

    const columns: ProColumns<ReleaseExecutionData>[] = [
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
            dataIndex: 'upc',
            key: 'upc',
            width: 150,
            fixed: 'left',
            ellipsis: true,
            render: (_, record) => (
                <Typography.Text copyable>
                    {record?.release?.upc || '-'}
                </Typography.Text>
            ),
        },
        {
            title: messages('releaseExecution.columns.releaseName'),
            dataIndex: 'releaseId',
            key: 'releaseId',
            width: 200,
            fixed: 'left',
            render: (_, record) => (
                <Typography.Text
                    copyable
                    ellipsis={{ tooltip: record?.release?.title }}
                    style={{ maxWidth: '100%' }}
                >
                    {record?.release?.title || '-'}
                </Typography.Text>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (value, record) =>
                messages(`releaseExecution.typeOptions.${record?.type}`) || '-',
        },
        {
            title: messages('releaseExecution.columns.status'),
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (_, record) =>
                record?.status ? (
                    <Tag color={getStatusColor(record.status)}>
                        {getStatusLabel(record.status)}
                    </Tag>
                ) : (
                    '-'
                ),
        },
        {
            title: messages('releaseExecution.columns.targetDspCodes'),
            dataIndex: 'originalDspCodes',
            key: 'originalDspCodes',
            width: 240,
            render: (_, record) => (
                <span>
                    {record?.originalDspCodes?.length
                        ? record.originalDspCodes.join(', ')
                        : '-'}
                </span>
            ),
        },
        // {
        //     title: 'Triggered By',
        //     dataIndex: 'triggeredBy',
        //     key: 'triggeredBy',
        //     width: 180,
        //     ellipsis: true,
        //     render: (_, record) => record?.triggeredBy?.name || '-',
        // },
        {
            title: messages('releaseExecution.columns.since'),
            key: 'since',
            width: 100,
            render: (_, record) => {
                const sinceText =
                    formatRelativeShort(record?.startedAt, messages) ??
                    formatRelativeShort(record?.createdAt, messages);
                const completedText = formatDurationShort(
                    record?.startedAt,
                    record?.completedAt
                );
                const summaryText = record?.summary;

                if (!sinceText && !completedText && !summaryText) return '-';

                const tooltipStartDate = (
                    <div>
                        <p>
                            {messages('common.startedAt')}:{' '}
                            {formattedDate(record?.startedAt)}
                        </p>
                        <p>
                            {messages('common.completedAt')}:{' '}
                            {formattedDate(record?.completedAt)}
                        </p>
                    </div>
                );

                return (
                    <CustomTooltip title={tooltipStartDate}>
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
                            {!completedText && summaryText && (
                                <Typography.Text
                                    type="secondary"
                                    className="!text-xs"
                                >
                                    {summaryText}
                                </Typography.Text>
                            )}
                        </div>
                    </CustomTooltip>
                );
            },
        },
        {
            title: '',
            key: 'actions',
            width: 60,
            fixed: 'right',
            align: 'center',
            render: (_, record) => {
                const isFailed =
                    record.status === RELEASE_EXECUTION_STATUS.FAILED;
                return (
                    <div className="flex items-center justify-start">
                        <IconButton
                            onClick={() =>
                                openModal(
                                    TYPE_MODAL_RELEASE_EXECUTION.DETAIL,
                                    record
                                )
                            }
                        >
                            <Eye size={SIZE_ICON} />
                        </IconButton>
                        {isFailed && (
                            <Popconfirm
                                title={messages(
                                    'releaseExecution.confirm.retryTitle'
                                )}
                                description={messages(
                                    'releaseExecution.confirm.retryDescription'
                                )}
                                okText="OK"
                                cancelText={messages('common.cancel')}
                                okButtonProps={{ loading: isPending }}
                                onConfirm={() =>
                                    retryReleaseExecution({
                                        id: record.id,
                                    })
                                }
                            >
                                <IconButton>
                                    <RotateCw size={SIZE_ICON} />
                                </IconButton>
                            </Popconfirm>
                        )}
                    </div>
                );
            },
        },
    ];

    return <AppProTable {...props} columns={columns} pagination={false} />;
}
