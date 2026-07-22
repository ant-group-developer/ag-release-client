import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { DspData } from '@/modules/dsp/types';
import { Avatar, Badge, Popconfirm, Table, Tag, theme, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Eye, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
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

const getKeysUpToDepth = (
    data: any[],
    depth: number,
    maxDepth: number
): React.Key[] => {
    if (!data || depth >= maxDepth) return [];
    let keys: React.Key[] = [];
    data.forEach((item) => {
        if (item.id) {
            keys.push(item.id);
        }
        if (item.childSteps && item.childSteps.length > 0) {
            keys = keys.concat(
                getKeysUpToDepth(item.childSteps, depth + 1, maxDepth)
            );
        }
    });
    return keys;
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
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const [lastSourceId, setLastSourceId] = useState<string | null>(null);

    useEffect(() => {
        if (dataSource && dataSource.length > 0) {
            const currentSourceId = dataSource.map((item) => item.id).join(',');
            if (currentSourceId !== lastSourceId) {
                const keys = getKeysUpToDepth(dataSource, 0, 2);
                setExpandedRowKeys(keys);
                setLastSourceId(currentSourceId);
            }
        } else {
            setLastSourceId(null);
        }
    }, [dataSource, lastSourceId]);

    const formatTreeData = (data: ReleaseSubmitStepData[]): any[] => {
        if (!data) return [];
        return data.map((item) => {
            if (item.childSteps && item.childSteps.length > 0) {
                return {
                    ...item,
                    childSteps: formatTreeData(item.childSteps),
                };
            }
            const { childSteps, ...rest } = item;
            return rest;
        });
    };

    const formattedDataSource = formatTreeData(dataSource);

    const columns: ColumnsType<ReleaseSubmitStepData> = [
        {
            title: messages('releaseExecution.detail.columns.stepType'),
            dataIndex: 'type',
            key: 'type',
            width: 250,
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
            title: `${messages(
                'releaseExecution.detail.columns.startedAt'
            )} / ${messages('releaseExecution.detail.columns.completedAt')}`,
            key: 'executionTime',
            width: 300,
            render: (_, record) => {
                const startedAt = formattedDate(
                    record.startedAt,
                    DATE_FORMAT.DATE_MINUTE
                );

                if (!startedAt) return '-';
                return (
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        <span>{startedAt}</span> -
                        {record.completedAt ? (
                            <span>
                                {formattedDate(
                                    record.completedAt,
                                    DATE_FORMAT.DATE_MINUTE
                                )}
                            </span>
                        ) : (
                            <Badge status="processing" />
                        )}
                    </span>
                );
            },
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
        // {
        //     title: messages('releaseExecution.isDeliveryStep.title'),
        //     dataIndex: 'isDeliveryStep',
        //     key: 'isDeliveryStep',
        //     width: 150,
        //     align: 'center',
        //     render: (value) => {
        //         if (typeof value !== 'boolean') return '-';

        //         if (!value) {
        //             return '-';
        //         }

        //         return (
        //             <CustomTooltip
        //                 title={messages(
        //                     'releaseExecution.isDeliveryStep.tooltip'
        //                 )}
        //             >
        //                 <span className="flex items-center justify-center">
        //                     <Check size={SIZE_ICON} color="green" />
        //                 </span>
        //             </CustomTooltip>
        //         );
        //     },
        // },
        {
            title: messages('releaseExecution.detail.columns.status'),
            dataIndex: 'status',
            key: 'status',
            width: 140,
            align: 'center',
            render: (value) => (
                <Tag color={getReleaseSubmitStepStatusColor(value)}>
                    {formatEnumLabel(value)}
                </Tag>
            ),
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
                            title={messages(
                                'releaseExecution.confirm.retryTitle'
                            )}
                            description={messages(
                                'releaseExecution.confirm.retryDescription'
                            )}
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
                dataSource={formattedDataSource}
                columns={columns}
                loading={isPending}
                showHeader={showHeader}
                expandable={{
                    childrenColumnName: 'childSteps',
                    indentSize: 24,
                    expandedRowKeys,
                    onExpandedRowsChange: (keys) =>
                        setExpandedRowKeys(keys as React.Key[]),
                }}
                rowClassName={'group'}
                className="table-tree-with-lines"
                scroll={{
                    y: '65vh',
                }}
            />
            <StepLogsModal
                open={logsModalVisible}
                onClose={() => setLogsModalVisible(false)}
                logs={selectedLogs}
            />
        </>
    );
}
