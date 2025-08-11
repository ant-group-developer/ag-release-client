'use client';
import AppContent from '@/components/ant-music/app-content';
import AppPagination from '@/components/ui/pagination';
import { LAYOUT_TABLE, SESSION_STORAGE_KEY } from '@/enums/common';
import { getScrollYHeight } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import { ReleasesDataFilter } from '@/modules/releases/types';
import TracksHeader from '@/modules/tracks/components/header';
import TracksTable from '@/modules/tracks/components/table';
import TracksGridTable from '@/modules/tracks/components/table/grid-table';
import { defaultVisibleColumnsTracks } from '@/modules/tracks/constants';
import { TRACKS_COLUMNS_DISPLAY } from '@/modules/tracks/enums';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { useWindowSize } from '@uidotdev/usehooks';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
type Props = {};

export default function Tracks({}: Props) {
    // Hook - state
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
    const {
        dataFilter,
        onSearch,
        onChangePage,
        onChangeFilter,
        canClearFilter,
        removeFilter,
    } = useFilter<ReleasesDataFilter>({
        page: 1,
        pageSize: 21,
    });
    const { layoutTable } = useTableLayoutToggle();
    const { height, width } = useWindowSize();

    // Apis
    const { tracksData, isFetching, dataUpdatedAt, refetch } =
        useGetListTracks(dataFilter);

    const handleChangeVisibleColumns = (columns: TRACKS_COLUMNS_DISPLAY[]) => {
        setVisibleColumns(columns);
    };

    // func
    const handleRefresh = () => {
        refetch();
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
        <AppContent className="h-[calc(100vh-64px-123px)] overflow-hidden">
            <div className="flex-1">
                <TracksHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    handleChangeVisibleColumns={handleChangeVisibleColumns}
                    visibleColumn={visibleColumns}
                    dataUpdatedAt={dataUpdatedAt}
                />
                {layoutTable === LAYOUT_TABLE.LIST && (
                    <TracksTable
                        visibleColumns={visibleColumns}
                        dataSource={tracksData?.items}
                        scroll={{ y: getScrollYHeight(height, width, 163, 39) }}
                        loading={isFetching}
                    />
                )}

                {layoutTable === LAYOUT_TABLE.GRID && (
                    <TracksGridTable
                        data={tracksData?.items}
                        loading={isFetching}
                    />
                )}
            </div>

            <AppPagination
                className="border-t"
                align="end"
                current={tracksData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={tracksData?.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 32]}
            />
        </AppContent>
    );
}
