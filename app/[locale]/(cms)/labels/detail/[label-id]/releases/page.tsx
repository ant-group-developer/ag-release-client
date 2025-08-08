'use client';
import AppContent from '@/components/ant-music/app-content';
import AppPagination from '@/components/ui/pagination';
import { LAYOUT_TABLE, SESSION_STORAGE_KEY } from '@/enums/common';
import { getScrollYHeight } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import ReleasesHeader from '@/modules/releases/components/header';
import ReleasesTable from '@/modules/releases/components/table';
import ReleasesGridTable from '@/modules/releases/components/table/grid-table';
import { defaultVisibleColumnsReleases } from '@/modules/releases/constants';
import { RELEASES_COLUMNS_DISPLAY } from '@/modules/releases/enums';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesDataFilter } from '@/modules/releases/types';
import { useWindowSize } from '@uidotdev/usehooks';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
type Props = {};

export default function Releases({}: Props) {
    // Hooks - state
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
    const labelId = params['label-id'];
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
        labelId: labelId as string,
    });
    const { height, width } = useWindowSize();
    const { layoutTable } = useTableLayoutToggle();

    const handleChangeVisibleColumns = (
        columns: RELEASES_COLUMNS_DISPLAY[]
    ) => {
        setVisibleColumns(columns);
    };

    // Apis
    const { releasesData, dataUpdatedAt, refetch, isFetching } =
        useGetListReleases(dataFilter);

    // func
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
        <AppContent className="h-[calc(100vh-64px-123px)] overflow-hidden">
            <div className="flex-1">
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
                {layoutTable === LAYOUT_TABLE.LIST && (
                    <ReleasesTable
                        visibleColumns={visibleColumns}
                        dataSource={releasesData?.items}
                        scroll={{ y: getScrollYHeight(height, width, 163, 39) }}
                        onChangeFilter={onChangeFilter}
                        loading={isFetching}
                    />
                )}

                {layoutTable === LAYOUT_TABLE.GRID && (
                    <ReleasesGridTable
                        data={releasesData?.items}
                        loading={false}
                    />
                )}
            </div>

            <AppPagination
                className="border-t"
                align="end"
                current={releasesData.metadata.currentPage}
                pageSize={dataFilter.pageSize}
                total={releasesData?.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 35]}
            />
        </AppContent>
    );
}
