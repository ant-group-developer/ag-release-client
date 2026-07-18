import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { DspData } from '@/modules/dsp/types';
import { Avatar, Popconfirm, Table, Tag, theme, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Check, Eye, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { CHILD_EXECUTION_MODE, RELEASE_SUBMIT_STEP_STATUS } from '../../enums';
import {
    formatDurationShort,
    formatEnumLabel,
    getReleaseSubmitStepStatusColor,
} from '../../helpers';
import { useRetryReleaseSubmitStep } from '../../hooks/use-retry-step';
import { ReleaseSubmitLogsData, ReleaseSubmitStepData } from '../../types';
import StepLogsModal from './step-logs-modal';

type Props = {
    dataSource: ReleaseSubmitStepData[];
    onViewDetail: (step: ReleaseSubmitStepData) => void;
    showHeader?: boolean;
};

export default function ReleaseSubmitStepTable({
    dataSource,
    onViewDetail,
    showHeader = true,
}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { retryStep, isPending, variables } = useRetryReleaseSubmitStep();
    const [logsModalVisible, setLogsModalVisible] = useState(false);
    const [selectedLogs, setSelectedLogs] = useState<ReleaseSubmitLogsData[]>(
        []
    );

    const columns: ColumnsType<ReleaseSubmitStepData> = [
        {
            title: messages('releaseExecution.detail.columns.stepType'),
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
            title: messages('releaseExecution.detail.columns.dsp'),
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
            title: messages('releaseExecution.detail.columns.status'),
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
            title: messages('releaseExecution.detail.columns.startedAt'),
            dataIndex: 'startedAt',
            key: 'startedAt',
            width: 150,
            render: (value) =>
                value ? formattedDate(value, DATE_FORMAT.DATE_MINUTE) : '-',
        },
        {
            title: messages('releaseExecution.detail.columns.completedAt'),
            dataIndex: 'completedAt',
            key: 'completedAt',
            width: 150,
            render: (value) =>
                value ? formattedDate(value, DATE_FORMAT.DATE_MINUTE) : '-',
        },
        {
            title: messages('releaseExecution.detail.columns.duration'),
            key: 'duration',
            width: 140,
            render: (_, record) =>
                formatDurationShort(
                    record?.startedAt,
                    record?.completedAt,
                    messages('releaseExecution.detail.columns.completedIn')
                ) || '-',
        },
        {
            title: messages('releaseExecution.detail.columns.logs'),
            key: 'logs',
            width: 80,
            align: 'center',
            render: (_, record) => {
                const count = record?.logs?.length;
                if (!count) return '-';
                return (
                    <Typography.Link
                        onClick={() => {
                            setSelectedLogs(record.logs || []);
                            setLogsModalVisible(true);
                        }}
                    >
                        {count}
                    </Typography.Link>
                );
            },
        },
        {
            title: messages('releaseExecution.childExecutionMode.title'),
            dataIndex: 'childExecutionMode',
            key: 'childExecutionMode',
            width: 130,
            align: 'center',
            render: (value) => {
                if (!value) return '-';
                const isSequential = value === CHILD_EXECUTION_MODE.SEQUENTIAL;
                const label = isSequential
                    ? messages('releaseExecution.childExecutionMode.sequential')
                    : messages('releaseExecution.childExecutionMode.parallel');
                const tooltipText = isSequential
                    ? messages(
                          'releaseExecution.childExecutionMode.tooltipSequential'
                      )
                    : messages(
                          'releaseExecution.childExecutionMode.tooltipParallel'
                      );
                return (
                    <CustomTooltip title={tooltipText}>
                        <Tag color={isSequential ? 'orange' : 'pink'}>
                            <span className="flex items-center gap-1">
                                <span>{formatEnumLabel(value)}</span>
                            </span>
                        </Tag>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('releaseExecution.isDeliveryStep.title'),
            dataIndex: 'isDeliveryStep',
            key: 'isDeliveryStep',
            width: 150,
            align: 'center',
            render: (value) => {
                if (typeof value !== 'boolean') return '-';

                if (!value) {
                    return '-';
                }

                return (
                    <CustomTooltip
                        title={messages(
                            'releaseExecution.isDeliveryStep.tooltip'
                        )}
                    >
                        <span className="flex items-center justify-center">
                            <Check size={SIZE_ICON} color="green" />
                        </span>
                    </CustomTooltip>
                );
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
                        <Popconfirm
                            title={messages('releaseExecution.confirm.retryTitle')}
                            description={messages('releaseExecution.confirm.retryDescription')}
                            onConfirm={() => {
                                retryStep({
                                    stepId: record.id,
                                });
                            }}
                            okText={messages('common.yes')}
                            cancelText={messages('common.no')}
                        >
                            <CustomTooltip title={messages('common.retry')}>
                                <IconButton>
                                    <RotateCcw size={SIZE_ICON} />
                                </IconButton>
                            </CustomTooltip>
                        </Popconfirm>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Table<ReleaseSubmitStepData>
                rowKey="id"
                size="small"
                pagination={false}
                dataSource={dataSource}
                columns={columns}
                loading={isPending}
                showHeader={showHeader}
                expandable={{
                    rowExpandable: (record) => !!record.childSteps?.length,
                    expandedRowRender: (record) => (
                        <div className="rounded-md">
                            <ReleaseSubmitStepTable
                                dataSource={record.childSteps}
                                onViewDetail={onViewDetail}
                                showHeader={false}
                            />
                        </div>
                    ),
                }}
                rowClassName={'group'}
            />
            <StepLogsModal
                open={logsModalVisible}
                onClose={() => setLogsModalVisible(false)}
                logs={selectedLogs}
            />
        </>
    );
}
