import JsonViewer from '@/components/ui/json-viewer';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { Card, Collapse, Empty, Space, Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import {
    formatDurationShort,
    formatEnumLabel,
    getReleaseSubmitLogLevelColor,
    getReleaseSubmitStepStatusColor,
} from '../../helpers';
import { ReleaseSubmitLogsData, ReleaseSubmitStepData } from '../../types';

type Props = {
    dataSource: ReleaseSubmitStepData[];
    logs?: ReleaseSubmitLogsData[];
    nested?: boolean;
};

export default function ReleaseSubmitStepList({
    dataSource,
    logs = [],
    nested = false,
}: Props) {
    const messages = useTranslations();
    if (!dataSource?.length) {
        return <Empty />;
    }

    return (
        <div className={nested ? 'space-y-3' : 'space-y-4'}>
            {dataSource.map((record) => {
                const stepLogs = logs.filter(
                    (log) => log.releaseExecutionStepId === record.id
                );
                const durationText =
                    formatDurationShort(
                        record?.startedAt,
                        record?.completedAt,
                        messages('releaseExecution.detail.columns.completedIn')
                    ) || '-';
                const metadataText = getTextContent(record.metadata);
                const metadataJson = getJsonContent(record.metadata);
                const hasExtraContent =
                    !!metadataText ||
                    !!metadataJson ||
                    stepLogs.length > 0 ||
                    !!record.childSteps?.length;

                return (
                    <Card
                        key={record.id}
                        size="small"
                        className={
                            nested
                                ? 'border-slate-200 shadow-none'
                                : 'border-slate-200 shadow-sm'
                        }
                        styles={{
                            body: {
                                padding: nested ? 14 : 18,
                            },
                        }}
                    >
                        <div className="space-y-4">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                    <Space>
                                        <span
                                            className="inline-block h-2.5 w-2.5 rounded-full"
                                            style={{
                                                backgroundColor: getStepAccent(
                                                    record.status
                                                ),
                                            }}
                                        />
                                        <Typography.Text
                                            strong
                                            className="text-base"
                                        >
                                            {formatEnumLabel(record.type)}
                                        </Typography.Text>
                                        <Tag
                                            color={getReleaseSubmitStepStatusColor(
                                                record.status
                                            )}
                                            className="mr-0"
                                        >
                                            {formatEnumLabel(record.status)}
                                        </Tag>
                                        {record.dsp?.name && (
                                            <Tag className="mr-0">
                                                {record.dsp.name}
                                            </Tag>
                                        )}
                                    </Space>
                                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                        <span>
                                            Started:{' '}
                                            {record.startedAt
                                                ? formattedDate(
                                                      record.startedAt,
                                                      DATE_FORMAT.DATE_MINUTE
                                                  )
                                                : '-'}
                                        </span>
                                        <span>
                                            Completed:{' '}
                                            {record.completedAt
                                                ? formattedDate(
                                                      record.completedAt,
                                                      DATE_FORMAT.DATE_MINUTE
                                                  )
                                                : '-'}
                                        </span>
                                        <span>Duration: {durationText}</span>
                                        <span>
                                            Retry: {record.retryCount ?? 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {hasExtraContent ? (
                                <div className="space-y-3 border-t border-slate-100 pt-4">
                                    {(metadataText || metadataJson) && (
                                        <section>
                                            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                                                Metadata
                                            </div>
                                            <div className="rounded-lg bg-slate-50 p-3">
                                                {metadataJson ? (
                                                    <JsonViewer
                                                        src={metadataJson}
                                                        collapsed={2}
                                                        style={{
                                                            maxHeight: 'unset',
                                                        }}
                                                    />
                                                ) : (
                                                    <pre className="overflow-x-auto whitespace-pre-wrap break-all text-xs">
                                                        {metadataText}
                                                    </pre>
                                                )}
                                            </div>
                                        </section>
                                    )}

                                    {stepLogs.length > 0 && (
                                        <section>
                                            <Collapse
                                                ghost
                                                items={[
                                                    {
                                                        key: `${record.id}-logs`,
                                                        label: (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                                                                    Logs
                                                                </span>
                                                                <Tag className="mr-0">
                                                                    {
                                                                        stepLogs.length
                                                                    }
                                                                </Tag>
                                                            </div>
                                                        ),
                                                        children: (
                                                            <div className="space-y-2 pt-1">
                                                                {stepLogs.map(
                                                                    (log) => {
                                                                        const dataText =
                                                                            getTextContent(
                                                                                log?.data
                                                                            );
                                                                        const dataJson =
                                                                            getJsonContent(
                                                                                log?.data
                                                                            );

                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    log.id
                                                                                }
                                                                                className="rounded-lg border border-slate-200 bg-white p-3"
                                                                            >
                                                                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                                                                    <Tag
                                                                                        color={getReleaseSubmitLogLevelColor(
                                                                                            log.level
                                                                                        )}
                                                                                        className="mr-0"
                                                                                    >
                                                                                        {formatEnumLabel(
                                                                                            log.level
                                                                                        )}
                                                                                    </Tag>
                                                                                    <Typography.Text type="secondary">
                                                                                        {formattedDate(
                                                                                            log.createdAt,
                                                                                            DATE_FORMAT.DATE_MINUTE
                                                                                        )}
                                                                                    </Typography.Text>
                                                                                </div>
                                                                                <Typography.Text className="whitespace-pre-wrap break-all">
                                                                                    {
                                                                                        log.message
                                                                                    }
                                                                                </Typography.Text>
                                                                                {(dataText ||
                                                                                    dataJson) && (
                                                                                    <div className="mt-3">
                                                                                        {dataJson ? (
                                                                                            <JsonViewer
                                                                                                src={
                                                                                                    dataJson
                                                                                                }
                                                                                                collapsed={
                                                                                                    2
                                                                                                }
                                                                                                style={{
                                                                                                    maxHeight:
                                                                                                        'unset',
                                                                                                }}
                                                                                            />
                                                                                        ) : (
                                                                                            <pre className="overflow-x-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100">
                                                                                                {
                                                                                                    dataText
                                                                                                }
                                                                                            </pre>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        ),
                                                    },
                                                ]}
                                            />
                                        </section>
                                    )}

                                    {record.childSteps?.length > 0 && (
                                        <section>
                                            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                                                Child steps
                                            </div>
                                            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
                                                <ReleaseSubmitStepList
                                                    dataSource={
                                                        record.childSteps
                                                    }
                                                    logs={logs}
                                                    nested
                                                />
                                            </div>
                                        </section>
                                    )}
                                </div>
                            ) : (
                                <Typography.Text type="secondary">
                                    No metadata or logs.
                                </Typography.Text>
                            )}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}

const getStepAccent = (status?: ReleaseSubmitStepData['status']) => {
    switch (status) {
        case 'SUCCESS':
            return '#16a34a';
        case 'FAILED':
        case 'CANCELLED':
            return '#dc2626';
        case 'RUNNING':
            return '#2563eb';
        case 'PENDING':
            return '#f59e0b';
        case 'NEW':
            return '#0ea5e9';
        default:
            return '#94a3b8';
    }
};

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
