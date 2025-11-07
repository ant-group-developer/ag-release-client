'use client';
import AppContent from '@/components/ant-music/app-content';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { LAYOUT_TABLE } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import { useArtistContext } from '@/modules/artist/hooks/use-artist-context';
import ReleasesHeaderV2 from '@/modules/releases/components/header/index-v2';
import ReleasesTable from '@/modules/releases/components/table';
import ReleasesGridTable from '@/modules/releases/components/table/grid-table';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesDataFilter } from '@/modules/releases/types';
import { theme } from 'antd';
import { useParams } from 'next/navigation';
type Props = {};

export default function Releases({}: Props) {
    const params = useParams();
    const { token } = theme.useToken();
    const { layoutTable } = useTableLayoutToggle();
    const artistId = params['artist-id'] as string;
    const { headerLayoutHeight } = useArtistContext();
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
    const handleRefresh = () => {
        refetch();
    };

    return (
        <AppContent>
            <div
                className="sticky top-32 z-10 mb-4"
                style={{
                    background: token.colorBgContainer,
                }}
            >
                {/* <ReleasesHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    handleChangeVisibleColumns={handleChangeVisibleColumns}
                    visibleColumn={visibleColumns}
                    dataUpdatedAt={dataUpdatedAt}
                /> */}
            </div>

            <ReleasesHeaderV2
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
                canClearFilter={canClearFilter}
                removeFilter={removeFilter}
                handleRefresh={handleRefresh}
                // handleChangeVisibleColumns={handleChangeVisibleColumns}
                // visibleColumn={visibleColumns}
                dataUpdatedAt={dataUpdatedAt}
            />

            {layoutTable === LAYOUT_TABLE.LIST && (
                <ReleasesTable
                    className="rounded-t-lg px-4"
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                    sticky={{ offsetHeader: headerLayoutHeight }}
                    dataSource={releasesData.items}
                    onChangeFilter={onChangeFilter}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: releasesData.metadata.currentPage,
                    }}
                    dataFilter={dataFilter}
                />
            )}

            {layoutTable === LAYOUT_TABLE.GRID && (
                <ReleasesGridTable data={releasesData.items} loading={false} />
            )}

            <AppPagination
                align="end"
                className="rounded-b-lg"
                style={{
                    background: token.colorBgContainer,
                }}
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
