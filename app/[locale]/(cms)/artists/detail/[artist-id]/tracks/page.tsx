'use client';
import AppContent from '@/components/ant-music/app-content';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { LAYOUT_TABLE } from '@/enums/common';
import { useElementHeightById } from '@/hooks/use-element-height-by-id';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import TrackHeaderV2 from '@/modules/tracks/components/header';
import TracksTable from '@/modules/tracks/components/table';
import TracksGridTable from '@/modules/tracks/components/table/grid-table';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { TrackDataFilter } from '@/modules/tracks/types';
import { theme } from 'antd';
import { useParams } from 'next/navigation';
type Props = {};

export default function Tracks({}: Props) {
    // hooks - state
    const { token } = theme.useToken();

    const params = useParams();
    const { layoutTable } = useTableLayoutToggle();
    const artistId = params['artist-id'] as string;
    const headerLayoutHeight = useElementHeightById('artist-header');

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

    const handleRefresh = () => {
        refetch();
    };

    return (
        <AppContent>
            <div
                className="sticky top-44 z-10 mb-4"
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
                    sticky={{ offsetHeader: headerLayoutHeight }}
                    dataSource={tracksData?.items}
                    loading={isFetching}
                    pagination={{
                        current: tracksData?.metadata?.page,
                        pageSize: dataFilter?.pageSize ?? PAGE_SIZE,
                    }}
                    dataFilter={dataFilter}
                    options={{
                        reload: () => {
                            handleRefresh();
                        },
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
                align="end"
                className="rounded-b-lg"
                style={{
                    background: token.colorBgContainer,
                }}
                current={tracksData?.metadata?.page}
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
