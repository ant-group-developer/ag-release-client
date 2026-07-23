'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import BulkSubmitModal from '@/modules/release-distribution/components/bulk-submit-modal';
import ExportModal from '@/modules/release-distribution/components/export-modal';
import ReleaseDistributionHeader from '@/modules/release-distribution/components/header';
import ReleaseDistributionTable from '@/modules/release-distribution/components/table/release-distribution-table';
import { RELEASE_CI_DATA_COLUMNS_DISPLAY } from '@/modules/release-distribution/enums';
import { useAutoSyncCi } from '@/modules/release-distribution/hooks/use-auto-sync-ci';
import { useCreateMissingReleaseCiData } from '@/modules/release-distribution/hooks/use-create-missing-release-ci-data';
import { useExportReleaseCiData } from '@/modules/release-distribution/hooks/use-export-release-ci-data';
import { useGetListReleaseCiData } from '@/modules/release-distribution/hooks/use-get-list-release-ci-data';
import { ReleaseCiDataFilter } from '@/modules/release-distribution/types';
import { RELEASE_TYPE } from '@/modules/releases/enums';
import {
    DownloadOutlined,
    PlusOutlined,
    SendOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { Key, useMemo, useState } from 'react';

export default function ReleaseDistributionPage() {
    const {
        dataFilter,
        onChangePage,
        onChangeFilter,
        canClearFilter,
        removeFilter,
        defaultFilter,
    } = useFilter<ReleaseCiDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
        orderBy: ORDER.DESC,
        fieldOrder: RELEASE_CI_DATA_COLUMNS_DISPLAY.CREATED_AT,
        type: RELEASE_TYPE.AUDIO,
        isImportedFromReport: 'false',
    });

    const messages = useTranslations();
    const { token } = theme.useToken();
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isBulkSubmitModalOpen, setIsBulkSubmitModalOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    // apis
    const {
        releaseCiDataList,
        isFetching: isReleaseDataLoading,
        refetch,
    } = useGetListReleaseCiData(dataFilter);
    const { createMissingReleaseCiData, isPending: isBulkCreating } =
        useCreateMissingReleaseCiData();
    const { autoSyncCi, isPending: isAutoSyncing } = useAutoSyncCi();
    const { exportReleaseCiData, isPending: isExporting } =
        useExportReleaseCiData();

    const selectedReleaseIds = useMemo(() => {
        if (!releaseCiDataList?.items) return [];
        return releaseCiDataList.items
            .filter((item) => selectedRowKeys.includes(item.id))
            .map((item) => item.releaseId || item.release?.id)
            .filter(Boolean) as string[];
    }, [releaseCiDataList?.items, selectedRowKeys]);

    const handleRefresh = () => {
        refetch();
    };

    const handleBulkCreate = () => {
        createMissingReleaseCiData({
            onSuccess: () => {
                // refetch();
            },
        });
    };

    const handleAutoSync = () => {
        autoSyncCi({
            onSuccess: () => {
                // refetch();
            },
        });
    };

    const handleExport = () => {
        setIsExportModalOpen(true);
    };

    const handleConfirmExport = async (values: ReleaseCiDataFilter) => {
        try {
            await exportReleaseCiData(values);
            setIsExportModalOpen(false);
        } catch (error) {
            // Error is handled by toastPromise
        }
    };

    const onChangeSort = (pagination: any, filters: any, sort: any) => {
        const orderBy = setSortOrder(sort, ORDER.ASC);
        const fieldOrder = sort.columnKey ?? sort.field;
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
        onChange: (keys: Key[]) => {
            setSelectedRowKeys(keys);
        },
        preserveSelectedRowKeys: true,
    };

    return (
        <AppPageWrapper>
            <PageContainer
                title={messages('release.releaseDistribution')}
                extra={[
                    <Button
                        key="export"
                        icon={<DownloadOutlined />}
                        loading={isExporting}
                        onClick={handleExport}
                    >
                        {messages('common.export')}
                    </Button>,
                    <Button
                        key="auto-sync-ci"
                        icon={<SyncOutlined />}
                        loading={isAutoSyncing}
                        onClick={handleAutoSync}
                    >
                        {messages('common.autoSyncCi')}
                    </Button>,
                    <Button
                        key="bulk-create"
                        type="primary"
                        icon={<PlusOutlined />}
                        loading={isBulkCreating}
                        onClick={handleBulkCreate}
                    >
                        {messages('common.bulkCreate')}
                    </Button>,
                ]}
            >
                <ReleaseDistributionTable
                    rowSelection={rowSelection}
                    tableAlertOptionRender={() => (
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={() => setIsBulkSubmitModalOpen(true)}
                        >
                            {messages('release.bulkSubmit')}
                        </Button>
                    )}
                    headerTitle={
                        <ReleaseDistributionHeader
                            dataFilter={dataFilter}
                            defaultFilter={defaultFilter}
                            onChangeFilter={onChangeFilter}
                            canClearFilter={canClearFilter}
                            removeFilter={removeFilter}
                        />
                    }
                    sticky
                    dataSource={releaseCiDataList?.items}
                    loading={isReleaseDataLoading}
                    onChangeFilter={onChangeFilter}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: releaseCiDataList?.metadata?.page ?? 1,
                    }}
                    onChange={onChangeSort}
                    dataFilter={dataFilter}
                    options={{
                        reload: () => {
                            handleRefresh();
                        },
                    }}
                />

                <AppPagination
                    className="rounded-b-md"
                    style={{ backgroundColor: token.colorBgContainer }}
                    align="end"
                    current={releaseCiDataList?.metadata?.page}
                    pageSize={dataFilter.pageSize}
                    total={releaseCiDataList?.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                <ExportModal
                    open={isExportModalOpen}
                    onCancel={() => setIsExportModalOpen(false)}
                    onOk={handleConfirmExport}
                    confirmLoading={isExporting}
                />

                <BulkSubmitModal
                    open={isBulkSubmitModalOpen}
                    selectedReleaseIds={selectedReleaseIds}
                    onCancel={() => setIsBulkSubmitModalOpen(false)}
                    onSuccess={() => {
                        setSelectedRowKeys([]);
                        refetch();
                    }}
                />
            </PageContainer>
        </AppPageWrapper>
    );
}
