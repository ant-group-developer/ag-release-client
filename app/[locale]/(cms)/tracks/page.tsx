'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { LAYOUT_TABLE, ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import AcrCloudScanHistoryModal from '@/modules/acr-cloud/components/modal/acr-scan-history-modal';
import AcrCloudScanModal from '@/modules/acr-cloud/components/modal/acr-scan-modal';
import AcrCloudScanResultModal from '@/modules/acr-cloud/components/modal/acr-scan-result-modal';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import { ReleasesDataFilter } from '@/modules/releases/types';
import { TRACK_SORT_FIELD } from '@/modules/tracks/enums';

import TrackHeader from '@/modules/tracks/components/header';
import TracksTable from '@/modules/tracks/components/table';
import TracksGridTable from '@/modules/tracks/components/table/grid-table';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';

type Props = {};

export default function Tracks({}: Props) {
    // State - hook
    const messages = useTranslations();
    const { token } = theme.useToken();
    const typeModal = useModalStore((state) => state.typeModal);
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);

    const { hasPermission } = usePermission();
    const canScan = hasPermission(PERMISSION.TRACK.SCAN);

    const { layoutTable } = useTableLayoutToggle();
    const {
        dataFilter,
        onSearch,
        onChangePage,
        onChangeFilter,
        canClearFilter,
        removeFilter,
    } = useFilter<ReleasesDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
        orderBy: ORDER.DESC,
        fieldOrder: TRACK_SORT_FIELD.CREATED_AT,
    });
    const {
        tracksData,
        isFetching: isTrackDataLoading,
        dataUpdatedAt,
        refetch,
    } = useGetListTracks(dataFilter);

    const handleRefresh = () => {
        refetch();
    };
    const handleSelectedRow = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };
    const handleResetSelectedRow = () => {
        setSelectedRow([]);
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

    // const
    const rowSelection = canScan
        ? {
              selectedRowKeys: selectedRow,
              onChange: handleSelectedRow,
              columnWidth: 30,
          }
        : false;

    return (
        <AppPageWrapper>
            <PageContainer title={messages('common.tracks')}>
                {/* <div
                    className="sticky top-0 z-50 mb-4 rounded-lg"
                    style={{ backgroundColor: token.colorBgContainer }}
                >
                    <TrackActions
                        selectedRowKeys={selectedRow}
                        resetSelectedRows={handleResetSelectedRow}
                    />
                </div> */}
                {layoutTable === LAYOUT_TABLE.LIST && (
                    <TracksTable
                        headerTitle={
                            <TrackHeader
                                dataFilter={dataFilter}
                                onChangeFilter={onChangeFilter}
                                canClearFilter={canClearFilter}
                                removeFilter={removeFilter}
                            />
                        }
                        sticky
                        dataSource={tracksData.items}
                        pagination={{
                            pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                            current: tracksData.metadata.page,
                        }}
                        loading={isTrackDataLoading}
                        rowSelection={rowSelection}
                        onChange={onChangeSort}
                        dataFilter={dataFilter}
                        options={{
                            reload: () => {
                                handleRefresh();
                            },
                        }}
                    />
                )}

                {layoutTable === LAYOUT_TABLE.GRID && (
                    <TracksGridTable
                        data={tracksData?.items}
                        loading={isTrackDataLoading}
                    />
                )}

                <AppPagination
                    className="rounded-b-md"
                    style={{ backgroundColor: token.colorBgContainer }}
                    align="end"
                    current={tracksData?.metadata?.page}
                    pageSize={dataFilter?.pageSize}
                    total={tracksData?.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {typeModal === TYPE_MODAL_TRACK.ACR_CLOUD_SCAN && (
                    <AcrCloudScanModal
                        selectedTrackIds={selectedRow}
                        handleResetSelectedRow={handleResetSelectedRow}
                    />
                )}

                {typeModal === TYPE_MODAL_TRACK.ACR_CLOUD_SCAN_HISTORY && (
                    <AcrCloudScanHistoryModal />
                )}

                {typeModal === TYPE_MODAL_TRACK.ACR_CLOUD_SCAN_RESULT && (
                    <AcrCloudScanResultModal />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
