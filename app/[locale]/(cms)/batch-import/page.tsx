'use client';

import AppLoader from '@/components/app-loader';
import AppContainer from '@/components/cms/app-container';
import AppHeader from '@/components/cms/app-header';
import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import BatchImportTable from '@/modules/batch-import/components/batch-import-table';
import { useGetBatchImportLogs } from '@/modules/batch-import/hooks/use-get-batch-import-logs';
import { BatchImportLogFilter } from '@/modules/batch-import/types/data';
import { ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, message, Select, Space } from 'antd';
import dayjs from 'dayjs';

const STATUS_OPTIONS = [
    { label: 'All Statuses', value: '' },
    { label: '🔄 Validating', value: 'validating' },
    { label: '✅ Validated', value: 'validated' },
    { label: '❌ Validation Failed', value: 'validation_failed' },
    { label: '⏳ Uploading', value: 'uploading' },
    { label: '🟢 Uploaded', value: 'uploaded' },
    { label: '🔴 Failed', value: 'failed' },
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
                        onChange={onSearch}
                        defaultValue={dataFilter.keyword}
                        placeholder="Search by Batch ID or UPC..."
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
