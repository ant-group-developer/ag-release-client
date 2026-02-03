'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTableScrollY } from '@/hooks/use-table-scroll-y';

import DistributionHeaderV2 from '@/modules/distribution/components/header/index-v2';
import DetailDistributionModal from '@/modules/distribution/components/modal/detail-distribution';
import DistributionTable from '@/modules/distribution/components/table';
import { TYPE_MODAL_DISTRIBUTION } from '@/modules/distribution/enum';
import { DistributionDataFilter } from '@/modules/distribution/types';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesDataFilter } from '@/modules/releases/types';
import { PageContainer } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';
type Props = {};

export default function Distribution({}: Props) {
    // hooks - state
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const scrollY = useTableScrollY();
    const messages = useTranslations();

    const {
        dataFilter,
        onChangeFilter,
        canClearFilter,
        removeFilter,
        onChangePage,
    } = useFilter<DistributionDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
    });
    const typeModal = useModalStore((state) => state.typeModal);

    // apis
    const { releasesData, isFetching, dataUpdatedAt, refetch } =
        useGetListReleases(dataFilter as ReleasesDataFilter);

    // func
    const handleRefresh = () => {
        refetch();
    };
    const handleSelectedRow = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys: selectedRow,
        onChange: handleSelectedRow,
        columnWidth: 30,
    };

    return (
        <AppPageWrapper>
            <PageContainer title={messages('distribution.label')}>
                {/* <div className="flex justify-between border-b">
                    <DistributionStatus
                        onChangeFilter={onChangeFilter}
                        value={dataFilter.status ?? DISTRIBUTION_STATUS.ALL}
                    />
                    <div className="flex items-center gap-4 px-4 font-medium">
                        <Button className="" type="primary">
                            <span>
                                {messages('distribution.batchDistribution')}
                            </span>
                        </Button>
                        <Button danger>
                            <span>
                                {messages('distribution.batchTakeDown')}
                            </span>
                        </Button>
                    </div>
                </div> */}

                <DistributionHeaderV2
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    dataUpdatedAt={dataUpdatedAt}
                />

                {/* <DistributionHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                /> */}
                <DistributionTable
                    sticky
                    dataSource={releasesData?.items}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    pagination={{
                        pageSize: dataFilter.pageSize,
                        current: releasesData.metadata.page,
                        total: releasesData.metadata.totalItems,
                    }}
                    loading={isFetching}
                    rowSelection={rowSelection}
                    options={{
                        fullScreen: true,
                        reload: () => {
                            handleRefresh();
                        },
                    }}
                />

                {typeModal === TYPE_MODAL_DISTRIBUTION.DETAIL && (
                    <DetailDistributionModal open />
                )}

                <AppPagination
                    align="end"
                    className="rounded-b-md bg-white"
                    current={releasesData.metadata.page}
                    pageSize={dataFilter.pageSize}
                    total={releasesData.metadata.totalItems}
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
