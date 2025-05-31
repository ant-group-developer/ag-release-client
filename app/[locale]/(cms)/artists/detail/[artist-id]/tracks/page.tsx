'use client';
import AppPagination from '@/components/ui/pagination';
import { LAYOUT_TABLE, SCREEN, SESSION_STORAGE_KEY } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import { ReleasesDataFilter } from '@/modules/releases/types';
import TracksHeader from '@/modules/tracks/components/header';
import TracksTable from '@/modules/tracks/components/table';
import TracksGridTable from '@/modules/tracks/components/table/grid-table';
import { defaultVisibleColumnsTracks } from '@/modules/tracks/constants';
import { fakeTrackData } from '@/modules/tracks/constants/mockdata';
import { TRACKS_COLUMNS_DISPLAY } from '@/modules/tracks/enums';
import { useWindowSize } from '@uidotdev/usehooks';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
type Props = {};

export default function Tracks({}: Props) {
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

    const handleChangeVisibleColumns = (columns: TRACKS_COLUMNS_DISPLAY[]) => {
        setVisibleColumns(columns);
    };
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

    const isSmallDevice = Number(width) <= SCREEN.MD;

    const scrollY = () => {
        if (isSmallDevice) return undefined;
        if (!height) return undefined;
        const minHeight = 300;
        const appHeaderHeight = 64;
        const pageHeaderHeight = 46;
        const pageFilterHeight = 49;
        const titleHeaderHeight = 39;
        const appPaginationHeight = 57;
        const headerFooterHeight =
            appHeaderHeight +
            pageHeaderHeight +
            pageFilterHeight +
            titleHeaderHeight +
            appPaginationHeight;
        const value = height - headerFooterHeight;
        if (value > minHeight) return value;
        return minHeight;
    };

    const { layoutTable } = useTableLayoutToggle();

    const handleRefresh = () => {};

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
                        dataSource={fakeTrackData}
                        scroll={{ x: SCREEN.XXL, y: scrollY() }}
                    />
                )}

                {layoutTable === LAYOUT_TABLE.GRID && (
                    <TracksGridTable data={fakeTrackData} loading={false} />
                )}
            </div>

            <AppPagination
                className="border-t"
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={fakeTrackData.length}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 32]}
            />
        </div>
    );
}
