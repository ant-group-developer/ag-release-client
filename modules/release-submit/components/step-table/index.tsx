import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { DspData } from '@/modules/dsp/types';
import { Avatar, Table, Tag, theme } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Eye, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { RELEASE_SUBMIT_STEP_STATUS } from '../../enums';
import {
    formatDurationShort,
    formatEnumLabel,
    getReleaseSubmitStepStatusColor,
} from '../../helpers';
import { useRetryReleaseSubmitStep } from '../../hooks/use-retry-step';
import { ReleaseSubmitLogsData, ReleaseSubmitStepData } from '../../types';

type Props = {
    dataSource: ReleaseSubmitStepData[];
    logs?: ReleaseSubmitLogsData[];
    onViewDetail: (step: ReleaseSubmitStepData) => void;
};

export default function ReleaseSubmitStepTable({
    dataSource,
    logs = [],
    onViewDetail,
}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { retryStep, isPending, variables } = useRetryReleaseSubmitStep();

    const columns: ColumnsType<ReleaseSubmitStepData> = [
        {
            title: 'Step type',
            dataIndex: 'type',
            key: 'type',
            width: 220,
            render: (value, record) => {
                return messages(
                    `releaseExecution.stepTypeOptions.${record?.type}`
                );
            },
        },
        {
            title: 'DSP',
            dataIndex: 'dsp',
            key: 'dsp',
            width: 160,
            render: (_, record) => {
                const dsps = record?.metadata?.input?.dsps as DspData[];
                if (!dsps) return '-';

                const sortedDsps = [...dsps].sort((a, b) => {
                    const nameA = a?.name || a?.code || '';
                    const nameB = b?.name || b?.code || '';
                    return nameA.localeCompare(nameB);
                });

                return (
                    <Avatar.Group
                        max={{
                            count: 5,
                            popover: { trigger: 'hover' },
                            style: {
                                color: token.colorText,
                                backgroundColor: token.colorBgLayout,
                                cursor: 'pointer',
                            },
                        }}
                        size="small"
                    >
                        {sortedDsps?.map((dsp) => {
                            const displayName = dsp?.name || dsp?.code || '-';
                            return (
                                <CustomTooltip
                                    key={dsp?.code}
                                    title={displayName}
                                >
                                    <Avatar
                                        src={dsp?.picture}
                                        size="small"
                                        style={{
                                            backgroundColor:
                                                token.colorBgLayout,
                                            color: token.colorText,
                                        }}
                                    >
                                        {String(displayName)
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </Avatar>
                                </CustomTooltip>
                            );
                        })}
                    </Avatar.Group>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (value) => (
                <Tag color={getReleaseSubmitStepStatusColor(value)}>
                    {formatEnumLabel(value)}
                </Tag>
            ),
        },
        {
            title: 'Started',
            dataIndex: 'startedAt',
            key: 'startedAt',
            width: 150,
            render: (value) =>
                value ? formattedDate(value, DATE_FORMAT.DATE_MINUTE) : '-',
        },
        {
            title: 'Completed',
            dataIndex: 'completedAt',
            key: 'completedAt',
            width: 150,
            render: (value) =>
                value ? formattedDate(value, DATE_FORMAT.DATE_MINUTE) : '-',
        },
        {
            title: 'Duration',
            key: 'duration',
            width: 140,
            render: (_, record) =>
                formatDurationShort(record?.startedAt, record?.completedAt) ||
                '-',
        },
        {
            title: 'Retry',
            dataIndex: 'retryCount',
            key: 'retryCount',
            width: 80,
            align: 'center',
        },
        {
            title: 'Logs',
            key: 'logs',
            width: 80,
            align: 'center',
            render: (_, record) => {
                const count = logs.filter(
                    (log) => log.releaseExecutionStepId === record.id
                ).length;
                return count || '-';
            },
        },
        {
            title: '',
            key: 'actions',
            width: 100,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
                <div className="flex items-center justify-start gap-2">
                    <CustomTooltip title={messages('common.viewDetail')}>
                        <IconButton onClick={() => onViewDetail(record)}>
                            <Eye size={SIZE_ICON} />
                        </IconButton>
                    </CustomTooltip>
                    {record.status === RELEASE_SUBMIT_STEP_STATUS.FAILED && (
                        <CustomTooltip title={messages('common.retry')}>
                            <IconButton
                                onClick={() => {
                                    retryStep({
                                        stepId: record.id,
                                    });
                                }}
                            >
                                <RotateCcw size={SIZE_ICON} />
                            </IconButton>
                        </CustomTooltip>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Table<ReleaseSubmitStepData>
            rowKey="id"
            size="small"
            pagination={false}
            dataSource={dataSource}
            columns={columns}
            loading={isPending}
            expandable={{
                rowExpandable: (record) => !!record.childSteps?.length,
                expandedRowRender: (record) => (
                    <div className="rounded-md border dark:border-zinc-700">
                        <ReleaseSubmitStepTable
                            dataSource={record.childSteps}
                            logs={logs}
                            onViewDetail={onViewDetail}
                        />
                    </div>
                ),
            }}
        />
    );
}
