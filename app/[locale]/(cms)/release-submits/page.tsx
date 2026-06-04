'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { TYPE_MODAL_RELEASE_EXECUTION } from '@/modules/release-executions/enums';
import ReleaseSubmitDetailModal from '@/modules/release-submit/components/detail-modal';
import ReleaseSubmitHeader from '@/modules/release-submit/components/header';
import ReleaseSubmitSnapshotModal from '@/modules/release-submit/components/snapshot-modal';
import ReleaseSubmitTable from '@/modules/release-submit/components/table';
import { useGetListReleaseSubmits } from '@/modules/release-submit/hooks/use-get-list';
import { ReleaseSubmitFilter } from '@/modules/release-submit/types';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function ReleaseSubmitsPage() {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const typeModal = useModalStore((state) => state.typeModal);
    const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const { isDark } = useThemeMode();

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<ReleaseSubmitFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
            orderBy: ORDER.DESC,
            fieldOrder: 'submit.createdAt',
        });

    const { releaseSubmitsData, isFetching, refetch } =
        useGetListReleaseSubmits(dataFilter);

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

    // const statusSummary = Object.values(RELEASE_EXECUTION_STATUS).map(
    //     (status) => ({
    //         status,
    //         count:
    //             releaseSubmitsData?.metadata?.statusCounts?.[status] ??
    //             releaseSubmitsData?.items?.filter(
    //                 (item) => item.status === status
    //             ).length ??
    //             0,
    //     })
    // );

    return (
        <AppPageWrapper>
            <PageContainer title={messages('releaseExecution.label')}>
                {/* <ReleaseSubmitStatusSummary
                    items={statusSummary}
                    loading={isFetching}
                /> */}

                <ReleaseSubmitTable
                    headerTitle={
                        <ReleaseSubmitHeader
                            dataFilter={dataFilter}
                            onChangeFilter={onChangeFilter}
                            onSearch={onSearch}
                        />
                    }
                    sticky
                    dataSource={releaseSubmitsData?.items}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: releaseSubmitsData?.metadata?.page ?? 1,
                    }}
                    options={{
                        reload: () => refetch(),
                        setting: false,
                        density: false,
                    }}
                    onChange={onChangeSort}
                    onViewSnapshot={(record) => {
                        setSelectedRecord(record);
                        setSnapshotModalOpen(true);
                    }}
                />

                <AppPagination
                    className="rounded-b-md"
                    style={{ backgroundColor: token.colorBgContainer }}
                    align="end"
                    current={
                        releaseSubmitsData?.metadata?.page ??
                        dataFilter.page ??
                        1
                    }
                    pageSize={dataFilter.pageSize}
                    total={
                        releaseSubmitsData?.metadata?.totalItems ??
                        releaseSubmitsData?.items?.length ??
                        0
                    }
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {typeModal === TYPE_MODAL_RELEASE_EXECUTION.DETAIL && (
                    <ReleaseSubmitDetailModal open />
                )}

                <ReleaseSubmitSnapshotModal
                    open={snapshotModalOpen}
                    onCancel={() => {
                        setSnapshotModalOpen(false);
                        setSelectedRecord(null);
                    }}
                    record={selectedRecord}
                />
            </PageContainer>
        </AppPageWrapper>
    );
}
