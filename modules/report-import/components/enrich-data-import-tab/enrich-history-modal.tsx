import AppPagination from '@/components/ui/pagination';
import AppTable from '@/components/ui/table/normal-table';
import { formattedNumber, getIndex } from '@/helpers/common';
import { Descriptions, Modal, Popover, Tag, Tooltip } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useGetEnrichHistory } from '../../hooks/use-get-enrich-history';
import { EnrichHistoryItem } from '../../types/payload';
import { ENRICH_CHANGE_TYPE, ENRICH_HISTORY_STATUS } from '../../enums';

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
            <pre className="m-0 text-left text-xs max-h-[300px] max-w-[500px] overflow-auto whitespace-pre-wrap bg-gray-50 p-2 rounded border font-mono">
                {JSON.stringify(parsed, null, 2)}
            </pre>
        );
    }

    return (
        <div className="max-w-[400px] break-all">
            {value}
        </div>
    );
};

interface Props {
    open: boolean;
    onClose: () => void;
    scanId: string | null;
}

export default function EnrichHistoryModal({ open, onClose, scanId }: Props) {
    const messages = useTranslations();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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
    const items = data?.items || [];
    const totalItems = data?.metadata?.totalItems || 0;

    const renderNumber = (value: number | null | undefined) => {
        return value !== undefined && value !== null
            ? formattedNumber(value)
            : '0';
    };

    const columns: ColumnType<EnrichHistoryItem>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 70,
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
                'reportConfigs.enrichDataImport.historyColumns.oldValue'
            ),
            key: 'oldValue',
            dataIndex: 'oldValue',
            width: 180,
            align: 'center',
            render: (value: string) => {
                if (!value) return '-';
                return (
                    <Popover
                        content={renderFormattedValue(value)}
                        trigger="hover"
                    >
                        <div className="mx-auto max-w-[180px] cursor-pointer truncate">
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
            width: 180,
            align: 'center',
            render: (value: string) => {
                if (!value) return '-';
                return (
                    <Popover
                        content={renderFormattedValue(value)}
                        trigger="hover"
                    >
                        <div className="mx-auto max-w-[180px] cursor-pointer truncate">
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
        <Modal
            title={messages('reportConfigs.enrichDataImport.historyModalTitle')}
            open={open}
            onCancel={onClose}
            footer={null}
            width={'60vw'}
            centered
        >
            <div className="flex flex-col gap-4">
                {summary && (
                    <Descriptions
                        size="small"
                        bordered
                        column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}
                    >
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.totalReleases'
                            )}
                        >
                            {renderNumber(summary.totalReleases)}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.totalDone'
                            )}
                        >
                            {renderNumber(summary.totalDone)}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.totalRemaining'
                            )}
                        >
                            {renderNumber(summary.totalRemaining)}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.successCount'
                            )}
                        >
                            {renderNumber(summary.successCount)}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.failedCount'
                            )}
                        >
                            {renderNumber(summary.failedCount)}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.notFoundCount'
                            )}
                        >
                            {renderNumber(summary.notFoundCount)}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.pendingCount'
                            )}
                        >
                            {renderNumber(summary.pendingCount)}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.processingCount'
                            )}
                        >
                            {renderNumber(summary.processingCount)}
                        </Descriptions.Item>
                    </Descriptions>
                )}

                <div className="flex flex-col">
                    <AppTable
                        dataSource={items}
                        columns={columns}
                        loading={isLoading}
                        pagination={false}
                        rowKey="id"
                        scroll={{ x: 800, y: 400 }}
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
        </Modal>
    );
}
