'use client';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/common';
import { LAYOUT_TABLE, SCREEN, SESSION_STORAGE_KEY } from '@/enums/common';
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
    // State - hook
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
        pageSize: 21,
    });
    const { height, width } = useWindowSize();
    const { tracksData, isLoading: isTrackDataLoading } = useGetListTracks({});

    // constant
    const isSmallDevice = Number(width) <= SCREEN.MD;

    // Function
    const handleChangeVisibleColumns = (columns: TRACKS_COLUMNS_DISPLAY[]) => {
        setVisibleColumns(columns);
    };
    const handleRefresh = () => {};
    const scrollY = () => {
        if (isSmallDevice) return undefined;
        if (!height) return undefined;
        const minHeight = 300;
        // const headerFooterHeight = 216;
        const headerFooterHeight = 210;
        const value = height - headerFooterHeight;
        if (value > minHeight) return value;
        return minHeight;
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
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <TracksHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    handleChangeVisibleColumns={handleChangeVisibleColumns}
                    visibleColumn={visibleColumns}
                />
                {layoutTable === LAYOUT_TABLE.LIST && (
                    <TracksTable
                        visibleColumns={visibleColumns}
                        dataSource={tracksData.items}
                        scroll={{ x: SCREEN.XXL, y: scrollY() }}
                        loading={isTrackDataLoading}
                    />
                )}

                {layoutTable === LAYOUT_TABLE.GRID && (
                    <TracksGridTable
                        data={tracksData.items}
                        loading={isTrackDataLoading}
                    />
                )}
            </div>

            <AppPagination
                className="border-b border-t"
                align="end"
                current={tracksData.metadata.currentPage}
                pageSize={dataFilter.pageSize}
                total={tracksData.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </div>
    );
}
