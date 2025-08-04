'use client';
import AppContainer from '@/components/ant-music/app-container';
import AppPagination from '@/components/ui/pagination';
import { LAYOUT_TABLE, SCREEN, SESSION_STORAGE_KEY } from '@/enums/common';
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
import { useEffect, useState } from 'react';
type Props = {};

export default function Releases({}: Props) {
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

    const handleChangeVisibleColumns = (
        columns: RELEASES_COLUMNS_DISPLAY[]
    ) => {
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

    const { releasesData, dataUpdatedAt } = useGetListReleases(dataFilter);

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
        <AppContainer className="!p-0">
            {/* <div className="border-b px-8 py-4">
                <div className="flex items-center gap-2">
                    <div className="overflow-hidden rounded-full">
                        <Image
                            src="https://cdn.revelator.com/images/fd0359c6-3cb8-426c-bcdf-db7e113627b7/file_w160.jpg?_=5/30/2025"
                            alt="artist-detail-header"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    </div>
                    <span className="font-bold">Ant Remix</span>
                </div>
            </div> */}
            <div className="flex h-full flex-col justify-between overflow-hidden">
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
                            dataSource={releasesData.items}
                            scroll={{ x: SCREEN.XXL, y: scrollY() }}
                            onChangeFilter={onChangeFilter}
                        />
                    )}

                    {layoutTable === LAYOUT_TABLE.GRID && (
                        <ReleasesGridTable
                            data={releasesData.items}
                            loading={false}
                        />
                    )}
                </div>

                <AppPagination
                    className="border-t"
                    align="end"
                    current={releasesData.metadata.currentPage}
                    pageSize={dataFilter.pageSize}
                    total={releasesData.metadata.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={[21, 28, 35]}
                />
            </div>
        </AppContainer>
    );
}
