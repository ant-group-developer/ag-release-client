'use client';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { LAYOUT_TABLE, ORDER, SESSION_STORAGE_KEY } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import useModalStore from '@/hooks/use-modal';
import AcrCloudScanHistoryModal from '@/modules/acr-cloud/components/modal/acr-scan-history-modal';
import AcrCloudScanModal from '@/modules/acr-cloud/components/modal/acr-scan-modal';
import AcrCloudScanResultModal from '@/modules/acr-cloud/components/modal/acr-scan-result-modal';
import { TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import { ReleasesDataFilter } from '@/modules/releases/types';
import TracksHeader from '@/modules/tracks/components/header';

import TracksTable from '@/modules/tracks/components/table';
import TracksGridTable from '@/modules/tracks/components/table/grid-table';
import TrackActions from '@/modules/tracks/components/track-actions';
import { defaultVisibleColumnsTracks } from '@/modules/tracks/constants';
import { TRACKS_COLUMNS_DISPLAY } from '@/modules/tracks/enums';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import dayjs from 'dayjs';
import { Key, useEffect, useState } from 'react';

type Props = {};

export default function Tracks({}: Props) {
    // State - hook
    const typeModal = useModalStore((state) => state.typeModal);
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<
        TRACKS_COLUMNS_DISPLAY[]
    >(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem(
                SESSION_STORAGE_KEY.VISIBLE_COLUMNS_TRACKS
            );
            if (!stored) return defaultVisibleColumnsTracks;
            const { value, timestamp } = JSON.parse(stored) as {
                value: TRACKS_COLUMNS_DISPLAY[];
                timestamp: string;
            };

            if (dayjs().diff(dayjs(timestamp), 'day') >= 10) {
                sessionStorage.removeItem(
                    SESSION_STORAGE_KEY.VISIBLE_COLUMNS_TRACKS
                );
                return defaultVisibleColumnsTracks;
            }

            return value;
        }
        return defaultVisibleColumnsTracks;
    });
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
    });
    const {
        tracksData,
        isFetching: isTrackDataLoading,
        dataUpdatedAt,
        refetch,
    } = useGetListTracks(dataFilter);

    // Function
    const handleChangeVisibleColumns = (columns: TRACKS_COLUMNS_DISPLAY[]) => {
        setVisibleColumns(columns);
    };
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
    const rowSelection = {
        selectedRowKeys: selectedRow,
        onChange: handleSelectedRow,
        columnWidth: 10,
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(
                SESSION_STORAGE_KEY.VISIBLE_COLUMNS_TRACKS,
                JSON.stringify({
                    value: visibleColumns,
                    timestamp: dayjs().toISOString(),
                })
            );
        }
    }, [visibleColumns]);

    return (
        <div>
            <div className="app-header">
                <TracksHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    dataUpdatedAt={dataUpdatedAt}
                    handleChangeVisibleColumns={handleChangeVisibleColumns}
                    visibleColumn={visibleColumns}
                />
                <TrackActions
                    selectedRowKeys={selectedRow}
                    resetSelectedRows={handleResetSelectedRow}
                />
            </div>
            {layoutTable === LAYOUT_TABLE.LIST && (
                <TracksTable
                    sticky
                    visibleColumns={visibleColumns}
                    dataSource={tracksData.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: tracksData.metadata.currentPage,
                    }}
                    loading={isTrackDataLoading}
                    rowSelection={rowSelection}
                    onChange={onChangeSort}
                    dataFilter={dataFilter}
                />
            )}

            {layoutTable === LAYOUT_TABLE.GRID && (
                <TracksGridTable
                    data={tracksData?.items}
                    loading={isTrackDataLoading}
                />
            )}

            <AppPagination
                className="border-b border-t"
                align="end"
                current={tracksData?.metadata?.currentPage}
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
        </div>
    );
}
