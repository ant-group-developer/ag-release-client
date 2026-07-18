import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import AppPagination from '@/components/ui/pagination';
import AppTable from '@/components/ui/table/normal-table';
import { formattedDate, formattedNumber, getIndex } from '@/helpers/common';
import { Descriptions, Popover, Tag, Tooltip } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ENRICH_HISTORY_STATUS, ENRICH_SCAN_STATUS } from '../../enums';
import { useGetEnrichHistory } from '../../hooks/use-get-enrich-history';
import { EnrichHistoryItem } from '../../types/payload';

const getChangeTypeLabel = (value: any, t: any): string => {
    if (!value) return '-';
    return t(`reportConfigs.enrichDataImport.historyChangeType.${value}`);
};

const getStatusLabel = (status: any, t: any): string => {
    if (!status) return '-';
    return t(`reportConfigs.enrichDataImport.historyStatus.${status}`);
};

const getStatusColor = (status: any): string => {
    switch (status) {
        case ENRICH_HISTORY_STATUS.APPLIED:
            return 'success';
        case ENRICH_HISTORY_STATUS.DRY_RUN:
            return 'warning';
        case ENRICH_HISTORY_STATUS.ERROR:
            return 'error';
        default:
            return 'default';
    }
};

const ENRICH_SCAN_SESSION_STATUS_COLORS: Record<ENRICH_SCAN_STATUS, string> = {
    [ENRICH_SCAN_STATUS.PENDING]: 'warning',
    [ENRICH_SCAN_STATUS.PROCESSING]: 'processing',
    [ENRICH_SCAN_STATUS.COMPLETED]: 'success',
    [ENRICH_SCAN_STATUS.FAILED]: 'error',
    [ENRICH_SCAN_STATUS.CANCELED]: 'magenta',
};

const getSessionStatusTagColor = (status: string) => {
    return (
        ENRICH_SCAN_SESSION_STATUS_COLORS[status as ENRICH_SCAN_STATUS] ||
        'default'
    );
};

const getSessionStatusLabel = (status: string, t: any) => {
    switch (status) {
        case ENRICH_SCAN_STATUS.PENDING:
            return t('reportConfigs.importResult.statusPending');
        case ENRICH_SCAN_STATUS.PROCESSING:
            return t('reportConfigs.importResult.statusProcessing');
        case ENRICH_SCAN_STATUS.COMPLETED:
            return t('reportConfigs.importResult.statusCompleted');
        case ENRICH_SCAN_STATUS.FAILED:
            return t('reportConfigs.importResult.statusFailed');
        case ENRICH_SCAN_STATUS.CANCELED:
            return t('reportConfigs.importResult.statusCanceled');
        default:
            return status;
    }
};

const renderFormattedValue = (value: string) => {
    if (!value) return '-';
    if (value === 'null') return 'null';

    let parsed: any = null;
    const trimmed = value.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
            parsed = JSON.parse(value);
        } catch (e) {
            // normal string, do nothing
        }
    }

    if (parsed) {
        return (
            <pre className="m-0 max-h-[300px] max-w-[500px] overflow-auto whitespace-pre-wrap rounded border bg-gray-50 p-2 text-left font-mono text-xs">
                {JSON.stringify(parsed, null, 2)}
            </pre>
        );
    }

    return <div className="max-w-[400px] break-all">{value}</div>;
};

interface Props {
    open: boolean;
    onClose: () => void;
    scanId: string | null;
}

export default function EnrichHistoryModal({ open, onClose, scanId }: Props) {
    const messages = useTranslations();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);

    const { data, isLoading } = useGetEnrichHistory({
        scanId,
        page,
        pageSize,
    });

    useEffect(() => {
        if (open) {
            setPage(1);
        }
    }, [open]);

    const summary = data?.summary;
    const session = data?.session;
    const items = data?.items || [];

    const totalItems = data?.metadata?.totalItems || 0;

    const columns: ColumnType<EnrichHistoryItem>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 60,
            align: 'center',
            render: (_, __, index) => getIndex(pageSize, page, index),
        },
        {
            title: messages(
                'reportConfigs.enrichDataImport.historyColumns.isrc'
            ),
            key: 'isrc',
            dataIndex: 'isrc',
            width: 150,
            align: 'center',
            render: (value) => value || '-',
        },
        {
            title: messages(
                'reportConfigs.enrichDataImport.historyColumns.fieldName'
            ),
            key: 'fieldName',
            dataIndex: 'fieldName',
            width: 150,
            align: 'center',
            render: (value) => value || '-',
        },
        {
            title: messages(
                'reportConfigs.enrichDataImport.historyColumns.oldValue'
            ),
            key: 'oldValue',
            dataIndex: 'oldValue',
            width: 400,
            align: 'center',
            render: (value: string) => {
                if (!value) return '-';
                return (
                    <Popover
                        content={renderFormattedValue(value)}
                        trigger="hover"
                    >
                        <div className="mx-auto max-w-[400px] cursor-pointer truncate">
                            {value}
                        </div>
                    </Popover>
                );
            },
        },
        {
            title: messages(
                'reportConfigs.enrichDataImport.historyColumns.newValue'
            ),
            key: 'newValue',
            dataIndex: 'newValue',
            width: 400,
            align: 'center',
            render: (value: string) => {
                if (!value) return '-';
                return (
                    <Popover
                        content={renderFormattedValue(value)}
                        trigger="hover"
                    >
                        <div className="mx-auto max-w-[400px] cursor-pointer truncate">
                            {value}
                        </div>
                    </Popover>
                );
            },
        },
        {
            title: messages(
                'reportConfigs.enrichDataImport.historyColumns.changeType'
            ),
            key: 'changeType',
            dataIndex: 'changeType',
            width: 120,
            align: 'center',
            render: (value: any) => {
                const label = getChangeTypeLabel(value, messages);
                return label !== '-' ? <Tag color="blue">{label}</Tag> : '-';
            },
        },
        {
            title: messages(
                'reportConfigs.enrichDataImport.historyColumns.status'
            ),
            key: 'status',
            dataIndex: 'status',
            width: 120,
            align: 'center',
            render: (status: any, record) => {
                const label = getStatusLabel(status, messages);
                const color = getStatusColor(status);
                const content = <Tag color={color}>{label}</Tag>;

                if (record.errorMessage) {
                    return (
                        <Tooltip title={record.errorMessage}>{content}</Tooltip>
                    );
                }

                return content;
            },
        },
    ];

    return (
        <FullScreenModal
            title={messages('reportConfigs.enrichDataImport.historyModalTitle')}
            open={open}
            onCancel={onClose}
            footer={null}
            styles={{
                body: {
                    padding: '12px 24px',
                },
            }}
        >
            <div className="flex flex-col gap-4">
                {(summary || session) && (
                    <Descriptions
                        size="small"
                        bordered
                        column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}
                    >
                        {session && (
                            <>
                                <Descriptions.Item
                                    label={messages(
                                        'reportConfigs.importResult.startTime'
                                    )}
                                >
                                    {session.startedAt
                                        ? formattedDate(session.startedAt)
                                        : '-'}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={messages(
                                        'reportConfigs.enrichDataImport.finishedAt'
                                    )}
                                >
                                    {session.finishedAt
                                        ? formattedDate(session.finishedAt)
                                        : '-'}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={messages(
                                        'reportConfigs.importResult.duration'
                                    )}
                                >
                                    {session.duration || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={messages('common.status')}
                                >
                                    <Tag
                                        color={getSessionStatusTagColor(
                                            session.status
                                        )}
                                    >
                                        {getSessionStatusLabel(
                                            session.status,
                                            messages
                                        )}
                                    </Tag>
                                </Descriptions.Item>
                            </>
                        )}
                        {summary && (
                            <>
                                <Descriptions.Item
                                    label={messages(
                                        'reportConfigs.enrichDataImport.totalReleases'
                                    )}
                                >
                                    {formattedNumber(summary.totalReleases)}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={messages(
                                        'reportConfigs.enrichDataImport.totalDone'
                                    )}
                                >
                                    {formattedNumber(summary.totalDone)}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={messages(
                                        'reportConfigs.enrichDataImport.totalRemaining'
                                    )}
                                >
                                    {formattedNumber(summary.totalRemaining)}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={messages(
                                        'reportConfigs.enrichDataImport.successCount'
                                    )}
                                >
                                    {formattedNumber(summary.successCount)}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={messages(
                                        'reportConfigs.enrichDataImport.failedCount'
                                    )}
                                >
                                    {formattedNumber(summary.failedCount)}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={messages(
                                        'reportConfigs.enrichDataImport.notFoundCount'
                                    )}
                                >
                                    {formattedNumber(summary.notFoundCount)}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={messages(
                                        'reportConfigs.enrichDataImport.pendingCount'
                                    )}
                                >
                                    {formattedNumber(summary.pendingCount)}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={messages(
                                        'reportConfigs.enrichDataImport.processingCount'
                                    )}
                                >
                                    {formattedNumber(summary.processingCount)}
                                </Descriptions.Item>
                            </>
                        )}
                    </Descriptions>
                )}

                <div className="flex flex-col">
                    <AppTable
                        sticky={{
                            offsetHeader: -12,
                        }}
                        dataSource={items}
                        columns={columns}
                        loading={isLoading}
                        pagination={false}
                        rowKey="id"
                        scroll={{ x: 800 }}
                    />
                    <AppPagination
                        current={page}
                        pageSize={pageSize}
                        total={totalItems}
                        onChange={(p, ps) => {
                            setPage(p);
                            if (ps) setPageSize(ps);
                        }}
                        showTotalText
                        className="mt-4"
                    />
                </div>
            </div>
        </FullScreenModal>
    );
}
