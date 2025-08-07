'use client';
import AppContent from '@/components/ant-music/app-content';
import AppPagination from '@/components/ui/pagination';
import { LAYOUT_TABLE, SESSION_STORAGE_KEY } from '@/enums/common';
import { getScrollYHeight } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import TracksHeader from '@/modules/tracks/components/header';
import TracksTable from '@/modules/tracks/components/table';
import TracksGridTable from '@/modules/tracks/components/table/grid-table';
import { defaultVisibleColumnsTracks } from '@/modules/tracks/constants';
import { TRACKS_COLUMNS_DISPLAY } from '@/modules/tracks/enums';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { TrackDataFilter } from '@/modules/tracks/types';
import { useWindowSize } from '@uidotdev/usehooks';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
type Props = {};

export default function Tracks({}: Props) {
    // hooks - state
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
    const params = useParams();
    const { layoutTable } = useTableLayoutToggle();
    const artistId = params['artist-id'] as string;
    const {
        dataFilter,
        onSearch,
        onChangePage,
        onChangeFilter,
        canClearFilter,
        removeFilter,
    } = useFilter<TrackDataFilter>({
        page: 1,
        pageSize: 21,
        artistId: artistId,
    });
    const { height, width } = useWindowSize();

    // apis
    const { tracksData, dataUpdatedAt, refetch } = useGetListTracks(dataFilter);

    // func
    const handleChangeVisibleColumns = (columns: TRACKS_COLUMNS_DISPLAY[]) => {
        setVisibleColumns(columns);
    };
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
                        scroll={{
                            y: getScrollYHeight(height, width, 121, 39),
                        }}
                    />
                )}

                {layoutTable === LAYOUT_TABLE.GRID && (
                    <TracksGridTable data={tracksData?.items} />
                )}
            </div>

            <AppPagination
                className="border-t"
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={[].length}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 32]}
            />
        </AppContent>
    );
}
