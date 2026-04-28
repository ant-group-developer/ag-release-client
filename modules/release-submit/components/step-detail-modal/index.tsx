import JsonViewer from '@/components/ui/json-viewer';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { DspData } from '@/modules/dsp/types';
import { Avatar, Card, Collapse, Descriptions, Tag, Typography } from 'antd';
import {
    formatDurationShort,
    formatEnumLabel,
    getReleaseSubmitLogLevelColor,
    getReleaseSubmitStepStatusColor,
} from '../../helpers';
import { ReleaseSubmitLogsData, ReleaseSubmitStepData } from '../../types';

type Props = Omit<AppModalProps, 'children'> & {
    logs?: ReleaseSubmitLogsData[];
    step?: ReleaseSubmitStepData | null;
};

export default function ReleaseSubmitStepDetailModal({
    logs = [],
    step,
    ...props
}: Props) {
    console.log('🚀 ~ ReleaseSubmitStepDetailModal ~ step:', step);
    if (!step) return null;

    const stepLogs = logs.filter((log) => log.releaseSubmitStepId === step.id);
    const metadataJson = getJsonContent(step.metadata);
    const metadataText = getTextContent(step.metadata);

    const dsps = step?.metadata?.input?.dsps as DspData[];

    return (
        <AppModal
            {...props}
            title={
                <div className="flex items-center gap-2">
                    <span>{formatEnumLabel(step.type)}</span>
                    <Tag color={getReleaseSubmitStepStatusColor(step.status)}>
                        {formatEnumLabel(step.status)}
                    </Tag>
                    {step.dsp?.name && <Tag>{step.dsp.name}</Tag>}
                </div>
            }
            footer={null}
            className="!top-12 !w-[75vw]"
            styles={{
                body: {
                    maxHeight: 'calc(100vh - 160px)',
                    overflowY: 'auto',
                },
            }}
        >
            <div className="space-y-4">
                <Card size="small">
                    <Descriptions
                        size="small"
                        column={2}
                        items={[
                            {
                                key: 'type',
                                label: 'Step type',
                                children: formatEnumLabel(step.type),
                            },
                            {
                                key: 'status',
                                label: 'Status',
                                children: (
                                    <Tag
                                        color={getReleaseSubmitStepStatusColor(
                                            step.status
                                        )}
                                        className="mr-0"
                                    >
                                        {formatEnumLabel(step.status)}
                                    </Tag>
                                ),
                            },
                            {
                                key: 'dsp',
                                label: 'DSP',
                                children: (
                                    <Avatar.Group
                                        max={{ count: 5 }}
                                        size="small"
                                    >
                                        {dsps?.map((dsp) => (
                                            <CustomTooltip
                                                key={dsp?.code}
                                                title={dsp?.name}
                                            >
                                                <Avatar
                                                    src={dsp?.picture}
                                                    size="small"
                                                >
                                                    {String(dsp?.name)
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </Avatar>
                                            </CustomTooltip>
                                        ))}
                                    </Avatar.Group>
                                ),
                            },
                            {
                                key: 'retry',
                                label: 'Retry count',
                                children: step.retryCount ?? 0,
                            },
                            {
                                key: 'startedAt',
                                label: 'Started',
                                children: step.startedAt
                                    ? formattedDate(
                                          step.startedAt,
                                          DATE_FORMAT.DATE_MINUTE
                                      )
                                    : '-',
                            },
                            {
                                key: 'completedAt',
                                label: 'Completed',
                                children: step.completedAt
                                    ? formattedDate(
                                          step.completedAt,
                                          DATE_FORMAT.DATE_MINUTE
                                      )
                                    : '-',
                            },
                            {
                                key: 'duration',
                                label: 'Duration',
                                children:
                                    formatDurationShort(
                                        step.startedAt,
                                        step.completedAt
                                    ) || '-',
                            },
                        ]}
                    />
                </Card>

                {(metadataJson || metadataText) && (
                    <Card size="small" title="Metadata">
                        {metadataJson ? (
                            <JsonViewer
                                src={metadataJson}
                                collapsed={true}
                                style={{ maxHeight: 'unset' }}
                            />
                        ) : (
                            <pre className="overflow-x-auto whitespace-pre-wrap break-all text-xs">
                                {metadataText}
                            </pre>
                        )}
                    </Card>
                )}

                <Card
                    size="small"
                    title={
                        <div className="flex items-center gap-2">
                            <span>Logs</span>
                            <Tag className="mr-0">{stepLogs.length}</Tag>
                        </div>
                    }
                >
                    {stepLogs.length > 0 ? (
                        <Collapse
                            ghost
                            items={stepLogs.map((log) => {
                                const dataJson = getJsonContent(log.data);
                                const dataText = getTextContent(log.data);

                                return {
                                    key: log.id,
                                    label: (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Tag
                                                color={getReleaseSubmitLogLevelColor(
                                                    log.level
                                                )}
                                                className="mr-0"
                                            >
                                                {formatEnumLabel(log.level)}
                                            </Tag>
                                            <Typography.Text>
                                                {log.message}
                                            </Typography.Text>
                                            <Typography.Text type="secondary">
                                                {formattedDate(
                                                    log.createdAt,
                                                    DATE_FORMAT.DATE_MINUTE
                                                )}
                                            </Typography.Text>
                                        </div>
                                    ),
                                    children: (
                                        <div className="space-y-3 pt-1">
                                            <Typography.Text className="whitespace-pre-wrap break-all">
                                                {log.message}
                                            </Typography.Text>
                                            {(dataJson || dataText) &&
                                                (dataJson ? (
                                                    <JsonViewer
                                                        src={dataJson}
                                                        collapsed={1}
                                                        style={{
                                                            maxHeight: 'unset',
                                                        }}
                                                    />
                                                ) : (
                                                    <pre className="overflow-x-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100">
                                                        {dataText}
                                                    </pre>
                                                ))}
                                        </div>
                                    ),
                                };
                            })}
                        />
                    ) : (
                        <Typography.Text type="secondary">
                            No logs.
                        </Typography.Text>
                    )}
                </Card>
            </div>
        </AppModal>
    );
}

const getJsonContent = (value: unknown) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') return null;
    if (typeof value === 'object') return value;

    return null;
};

const getTextContent = (value: unknown) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') return '';

    return String(value);
};
