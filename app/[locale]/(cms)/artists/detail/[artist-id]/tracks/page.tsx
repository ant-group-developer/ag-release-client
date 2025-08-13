'use client';
import AppContent from '@/components/ant-music/app-content';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { LAYOUT_TABLE, SESSION_STORAGE_KEY } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import TracksHeader from '@/modules/tracks/components/header';
import TracksTable from '@/modules/tracks/components/table';
import TracksGridTable from '@/modules/tracks/components/table/grid-table';
import { defaultVisibleColumnsTracks } from '@/modules/tracks/constants';
import { TRACKS_COLUMNS_DISPLAY } from '@/modules/tracks/enums';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { TrackDataFilter } from '@/modules/tracks/types';
import { theme } from 'antd';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
type Props = {};

export default function Tracks({}: Props) {
    // hooks - state
    const { token } = theme.useToken();
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
        pageSize: PAGE_SIZE,
        artistId: artistId,
    });

    // apis
    const { tracksData, dataUpdatedAt, refetch, isFetching } =
        useGetListTracks(dataFilter);

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
        <AppContent>
            <div
                className="sticky top-44 z-10 border-t"
                style={{
                    background: token.colorBgContainer,
                }}
            >
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
            </div>
            {layoutTable === LAYOUT_TABLE.LIST && (
                <TracksTable
                    sticky={{ offsetHeader: 216 }}
                    visibleColumns={visibleColumns}
                    dataSource={tracksData?.items}
                    loading={isFetching}
                    pagination={{
                        current: tracksData?.metadata?.currentPage,
                        pageSize: dataFilter?.pageSize ?? PAGE_SIZE,
                    }}
                />
            )}

            {layoutTable === LAYOUT_TABLE.GRID && (
                <TracksGridTable
                    data={tracksData?.items}
                    loading={isFetching}
                />
            )}

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
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </AppContent>
    );
}
