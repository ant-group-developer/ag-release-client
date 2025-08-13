'use client';
import AppContent from '@/components/ant-music/app-content';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { LAYOUT_TABLE, SESSION_STORAGE_KEY } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import ReleasesHeader from '@/modules/releases/components/header';
import ReleasesTable from '@/modules/releases/components/table';
import ReleasesGridTable from '@/modules/releases/components/table/grid-table';
import { defaultVisibleColumnsReleases } from '@/modules/releases/constants';
import { RELEASES_COLUMNS_DISPLAY } from '@/modules/releases/enums';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesDataFilter } from '@/modules/releases/types';
import { theme } from 'antd';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
type Props = {};

export default function Releases({}: Props) {
    // hooks - state
    const [visibleColumns, setVisibleColumns] = useState<
        RELEASES_COLUMNS_DISPLAY[]
    >(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem(
                SESSION_STORAGE_KEY.VISIBLE_COLUMNS_RELEASES
            );
            if (!stored) return defaultVisibleColumnsReleases;
            const { value, timestamp } = JSON.parse(stored) as {
                value: RELEASES_COLUMNS_DISPLAY[];
                timestamp: string;
            };

            if (dayjs().diff(dayjs(timestamp), 'day') >= 10) {
                sessionStorage.removeItem(
                    SESSION_STORAGE_KEY.VISIBLE_COLUMNS_RELEASES
                );
                return defaultVisibleColumnsReleases;
            }

            return value;
        }
        return defaultVisibleColumnsReleases;
    });
    const params = useParams();
    const { token } = theme.useToken();
    const { layoutTable } = useTableLayoutToggle();
    const artistId = params['artist-id'] as string;
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
        artistId: artistId,
    });

    // apis
    const { releasesData, dataUpdatedAt, refetch, isFetching } =
        useGetListReleases(dataFilter);

    // func
    const handleChangeVisibleColumns = (
        columns: RELEASES_COLUMNS_DISPLAY[]
    ) => {
        setVisibleColumns(columns);
    };
    const handleRefresh = () => {
        refetch();
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(
                SESSION_STORAGE_KEY.VISIBLE_COLUMNS_RELEASES,
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
                <ReleasesHeader
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
                <ReleasesTable
                    sticky={{ offsetHeader: 216 }}
                    visibleColumns={visibleColumns}
                    dataSource={releasesData.items}
                    onChangeFilter={onChangeFilter}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: releasesData.metadata.currentPage,
                    }}
                />
            )}

            {layoutTable === LAYOUT_TABLE.GRID && (
                <ReleasesGridTable data={releasesData.items} loading={false} />
            )}

            <AppPagination
                className="border-b"
                align="end"
                current={releasesData.metadata.currentPage}
                pageSize={dataFilter.pageSize}
                total={releasesData.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </AppContent>
    );
}
