'use client';
import AppContent from '@/components/ant-music/app-content';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { LAYOUT_TABLE } from '@/enums/common';
import { useElementHeightById } from '@/hooks/use-element-height-by-id';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import { ReleasesDataFilter } from '@/modules/releases/types';
import TrackHeaderV2 from '@/modules/tracks/components/header/index-v2';
import TracksTable from '@/modules/tracks/components/table';
import TracksGridTable from '@/modules/tracks/components/table/grid-table';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { theme } from 'antd';
type Props = {};

export default function Tracks({}: Props) {
    // Hook - state
    const { token } = theme.useToken();
    const headerLayoutHeight = useElementHeightById('label-header');
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
    // const { height, width } = useWindowSize();

    // Apis
    const { tracksData, isFetching, dataUpdatedAt, refetch } =
        useGetListTracks(dataFilter);

    // func
    const handleRefresh = () => {
        refetch();
    };

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
                    sticky={{ offsetHeader: headerLayoutHeight }}
                    dataSource={tracksData?.items}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter?.pageSize ?? PAGE_SIZE,
                        current: tracksData?.metadata?.page,
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
                className="rounded-b-lg"
                style={{ background: token.colorBgContainer }}
                align="end"
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
