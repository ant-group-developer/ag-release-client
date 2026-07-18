'use client';

import AppHeader from '@/components/cms/app-header';
import AppSearch from '@/components/ui/input/search';
import { ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, message, Select, Space, theme } from 'antd';
import dayjs from 'dayjs';
import { BatchImportStatus } from '../enums/batch-import-status.enum';
import { BatchImportLogFilter } from '../types/data';

const STATUS_OPTIONS = [
    { label: 'All Statuses', value: '' },
    { label: '🔄 Validating', value: BatchImportStatus.VALIDATING },
    { label: '✅ Validated', value: BatchImportStatus.VALIDATED },
    {
        label: '❌ Validation Failed',
        value: BatchImportStatus.VALIDATION_FAILED,
    },
    { label: '⏳ Uploading', value: BatchImportStatus.UPLOADING },
    { label: '🟢 Uploaded', value: BatchImportStatus.UPLOADED },
    { label: '🔴 Failed', value: BatchImportStatus.FAILED },
];

/**
 * Generate a batch ID from the current timestamp.
 * Format: YYYYMMDDHHmmssSSS (e.g. 20251211111052956)
 */
function generateBatchId(): string {
    return dayjs().format('YYYYMMDDHHmmssSSS');
}

interface BatchImportHeaderProps {
    dataFilter: BatchImportLogFilter;
    onChangeFilter: (filter: Partial<BatchImportLogFilter>) => void;
    isFetching: boolean;
    refetch: () => void;
}

function BatchImportHeader({
    dataFilter,
    onChangeFilter,
    isFetching,
    refetch,
}: BatchImportHeaderProps) {
    const { token } = theme.useToken();

    return (
        <AppHeader
            style={{
                paddingTop: 8,
                paddingBottom: 8,
            }}
        >
            <Space>
                <AppSearch
                    onChange={(e) =>
                        onChangeFilter({ batchId: e.target.value?.trim() })
                    }
                    defaultValue={dataFilter.batchId}
                    placeholder="Batch ID"
                    style={{ width: 250 }}
                />
                <AppSearch
                    onChange={(e) =>
                        onChangeFilter({ upc: e.target.value?.trim() })
                    }
                    defaultValue={dataFilter.upc}
                    placeholder="UPC"
                    style={{ width: 200 }}
                />
                <AppSearch
                    onChange={(e) =>
                        onChangeFilter({
                            tenantCode: e.target.value?.trim(),
                        })
                    }
                    defaultValue={dataFilter.tenantCode}
                    placeholder="Tenant"
                    style={{ width: 150 }}
                />
                <Select
                    placeholder="All Statuses"
                    allowClear
                    style={{ width: 200 }}
                    options={STATUS_OPTIONS}
                    value={dataFilter.status}
                    onChange={(value) =>
                        onChangeFilter({ status: value || undefined })
                    }
                />
                <Button
                    icon={<ThunderboltOutlined />}
                    onClick={() => {
                        const batchId = generateBatchId();
                        navigator.clipboard.writeText(batchId);
                        message.success(`Batch ID copied: ${batchId}`);
                    }}
                >
                    Generate Batch ID
                </Button>
                <Button
                    icon={<ReloadOutlined spin={isFetching} />}
                    onClick={() => refetch()}
                >
                    Refresh
                </Button>
            </Space>
        </AppHeader>
    );
}

export default BatchImportHeader;
