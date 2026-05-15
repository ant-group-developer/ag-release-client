'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import DistributionJobsHeader from '@/modules/distribution-jobs/components/header';
import DistributionJobsTable from '@/modules/distribution-jobs/components/table';
import DistributionJobsTableAlertAction from '@/modules/distribution-jobs/components/table-alert-action';
import { useAutoSendEmailDistributionJobs } from '@/modules/distribution-jobs/hooks/use-auto-send-email';
import { useConfirmCompletedDistributionJobs } from '@/modules/distribution-jobs/hooks/use-confirm-completed';
import { useDownloadExcelDistributionJobs } from '@/modules/distribution-jobs/hooks/use-download-excel';
import { useGetListDistributionJobs } from '@/modules/distribution-jobs/hooks/use-get-list';
import {
    DISTRIBUTION_JOB_STATUS,
    DISTRIBUTION_JOB_TYPE,
    DistributionJobData,
    DistributionJobFilter,
} from '@/modules/distribution-jobs/types';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';

export default function DistributionJobsPage() {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<DistributionJobData[]>([]);
    // const [openConfirmCompleted, setOpenConfirmCompleted] = useState(false);

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<DistributionJobFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
            orderBy: ORDER.DESC,
            fieldOrder: 'job.createdAt',
        });

    const { distributionJobsData, isFetching, refetch } =
        useGetListDistributionJobs(dataFilter);

    const { autoSendEmail, isPending: isAutoSendingEmail } =
        useAutoSendEmailDistributionJobs();
    const { downloadExcel, isPending: isDownloadingExcel } =
        useDownloadExcelDistributionJobs();
    const { confirmCompleted, isPending: isConfirmingCompleted } =
        useConfirmCompletedDistributionJobs();

    const onAutoSendEmail = () => {
        const filteredIds = selectedRows
            .filter((row) => row.type === DISTRIBUTION_JOB_TYPE.EMAIL_STATE51)
            .map((row) => row.id);

        if (filteredIds.length === 0) return;

        autoSendEmail({
            ids: filteredIds,
            onSuccess: () => {
                setSelectedRowKeys([]);
                setSelectedRows([]);
            },
        });
    };

    const onDownloadExcel = () => {
        const filteredIds = selectedRows
            .filter((row) => row.type === DISTRIBUTION_JOB_TYPE.ADMIN_EXPORT)
            .map((row) => row.id);

        if (filteredIds.length === 0) return;

        downloadExcel({
            ids: filteredIds,
            onSuccess: () => {
                setSelectedRowKeys([]);
                setSelectedRows([]);
            },
        });
    };

    const onConfirmCompleted = () => {
        confirmCompleted({
            ids: selectedRowKeys,
            exportIdFromCi: '',
            onSuccess: () => {
                setSelectedRowKeys([]);
                setSelectedRows([]);
                // setOpenConfirmCompleted(false);
            },
        });
    };

    const onChangeSort = (pagination: any, filters: any, sort: any) => {
        const orderBy = setSortOrder(sort, ORDER.ASC);
        const fieldOrder = sort.field;
        onChangeFilter(
            {
                orderBy,
                fieldOrder,
            },
            false
        );
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: Key[], rows: DistributionJobData[]) => {
            setSelectedRowKeys(keys);
            setSelectedRows(rows);
        },
        getCheckboxProps: (record: DistributionJobData) => ({
            disabled:
                record.status === DISTRIBUTION_JOB_STATUS.COMPLETED ||
                record.status === DISTRIBUTION_JOB_STATUS.SKIPPED,
        }),
    };

    return (
        <AppPageWrapper>
            <PageContainer title={messages('distributionJobs.label')}>
                <DistributionJobsTable
                    headerTitle={
                        <DistributionJobsHeader
                            dataFilter={dataFilter}
                            onChangeFilter={onChangeFilter}
                            onSearch={onSearch}
                        />
                    }
                    sticky
                    dataSource={distributionJobsData?.items}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: distributionJobsData?.metadata?.page ?? 1,
                    }}
                    rowSelection={rowSelection}
                    tableAlertOptionRender={() => (
                        <DistributionJobsTableAlertAction
                            isAutoSendingEmail={isAutoSendingEmail}
                            onAutoSendEmail={onAutoSendEmail}
                            isDownloadingExcel={isDownloadingExcel}
                            onDownloadExcel={onDownloadExcel}
                            isConfirmingCompleted={isConfirmingCompleted}
                            onConfirmCompleted={onConfirmCompleted}
                        />
                    )}
                    options={{
                        reload: () => refetch(),
                        setting: false,
                        density: false,
                    }}
                    onChange={onChangeSort}
                />

                {/* <ConfirmCompletedModal
                    open={openConfirmCompleted}
                    onCancel={() => setOpenConfirmCompleted(false)}
                    onConfirm={onConfirmCompleted}
                    loading={isConfirmingCompleted}
                /> */}

                <AppPagination
                    className="rounded-b-md"
                    style={{ backgroundColor: token.colorBgContainer }}
                    align="end"
                    current={
                        distributionJobsData?.metadata?.page ??
                        dataFilter.page ??
                        1
                    }
                    pageSize={dataFilter.pageSize}
                    total={
                        distributionJobsData?.metadata?.totalItems ??
                        distributionJobsData?.items?.length ??
                        0
                    }
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />
            </PageContainer>
        </AppPageWrapper>
    );
}
