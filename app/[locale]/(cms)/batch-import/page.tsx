'use client';

import AppLoader from '@/components/app-loader';
import AppContainer from '@/components/cms/app-container';
import AppHeader from '@/components/cms/app-header';
import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import BatchImportTable from '@/modules/batch-import/components/batch-import-table';
import { BatchImportStatus } from '@/modules/batch-import/enums/batch-import-status.enum';
import { useGetBatchImportLogs } from '@/modules/batch-import/hooks/use-get-batch-import-logs';
import { BatchImportLogFilter } from '@/modules/batch-import/types/data';
import { ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, message, Select, Space } from 'antd';
import dayjs from 'dayjs';

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

function BatchImportPage() {
    const defaultFilter: BatchImportLogFilter = {
        page: 1,
        pageSize: PAGE_SIZE,
    };

    const { dataFilter, onSearch, onChangePage, onChangeFilter, isReady } =
        useFilter<BatchImportLogFilter>(defaultFilter);

    const { dataLogs, totalRecord, isFetching, refetch } =
        useGetBatchImportLogs(dataFilter, isReady);

    if (!isReady) {
        return <AppLoader className="bg-white" />;
    }

    return (
        <AppContainer appTitle="Batch Import Logs">
            {/* Filter Header */}
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

            {/* Table */}
            <BatchImportTable
                sticky
                dataSource={dataLogs}
                loading={isFetching}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: dataFilter.page ?? 1,
                }}
            />

            <AppPagination
                showTotalText
                pageSize={PAGE_SIZE}
                onChange={onChangePage}
                current={dataFilter.page}
                total={totalRecord}
            />
        </AppContainer>
    );
}

export default BatchImportPage;
