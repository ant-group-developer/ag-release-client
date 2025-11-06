'use client';
import AppContent from '@/components/ant-music/app-content';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { LAYOUT_TABLE, SESSION_STORAGE_KEY } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import { ReleasesDataFilter } from '@/modules/releases/types';
import TrackHeaderV2 from '@/modules/tracks/components/header/index-v2';
import TracksTable from '@/modules/tracks/components/table';
import TracksGridTable from '@/modules/tracks/components/table/grid-table';
import { defaultVisibleColumnsTracks } from '@/modules/tracks/constants';
import { TRACKS_COLUMNS_DISPLAY } from '@/modules/tracks/enums';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { useWindowSize } from '@uidotdev/usehooks';
import { theme } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
type Props = {};

export default function Tracks({}: Props) {
    // Hook - state
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
        <AppContent>
            <div
                className="sticky top-44 z-10"
                style={{
                    background: token.colorBgContainer,
                }}
            ></div>

            <TrackHeaderV2
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
                canClearFilter={canClearFilter}
                removeFilter={removeFilter}
                handleRefresh={handleRefresh}
                dataUpdatedAt={dataUpdatedAt}
            />

            {layoutTable === LAYOUT_TABLE.LIST && (
                <TracksTable
                    sticky={{ offsetHeader: 163 }}
                    dataSource={tracksData?.items}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter?.pageSize ?? PAGE_SIZE,
                        current: tracksData?.metadata?.currentPage,
                    }}
                    dataFilter={dataFilter}
                />
            )}

            {layoutTable === LAYOUT_TABLE.GRID && (
                <TracksGridTable
                    data={tracksData?.items}
                    loading={isFetching}
                />
            )}

            <AppPagination
                className="rounded-b-lg"
                style={{ background: token.colorBgContainer }}
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
