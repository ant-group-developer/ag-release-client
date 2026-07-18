'use client';

import AppLoader from '@/components/app-loader';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import BatchImportHeader from '@/modules/batch-import/components/batch-import-header';
import BatchImportTable from '@/modules/batch-import/components/batch-import-table';
import { useGetBatchImportLogs } from '@/modules/batch-import/hooks/use-get-batch-import-logs';
import { BatchImportLogFilter } from '@/modules/batch-import/types/data';
import { PageContainer } from '@ant-design/pro-components';

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
        <PageContainer title="Batch Import Logs">
            {/* Filter Header */}

            {/* Table */}
            <BatchImportTable
                sticky
                dataSource={dataLogs}
                loading={isFetching}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: dataFilter.page ?? 1,
                }}
                title={() => (
                    <BatchImportHeader
                        dataFilter={dataFilter}
                        onChangeFilter={onChangeFilter}
                        isFetching={isFetching}
                        refetch={refetch}
                    />
                )}
            />

            <AppPagination
                showTotalText
                pageSize={PAGE_SIZE}
                onChange={onChangePage}
                current={dataFilter.page}
                total={totalRecord}
            />
        </PageContainer>
    );
}

export default BatchImportPage;
