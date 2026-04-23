'use client';
import AppContent from '@/components/ant-music/app-content';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { LAYOUT_TABLE } from '@/enums/common';
import { useElementHeightById } from '@/hooks/use-element-height-by-id';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import ReleasesHeaderV2 from '@/modules/releases/components/header';
import ReleasesTable from '@/modules/releases/components/table';
import ReleasesGridTable from '@/modules/releases/components/table/grid-table';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesDataFilter } from '@/modules/releases/types';
import { theme } from 'antd';
import { useParams } from 'next/navigation';
type Props = {};

export default function Releases({}: Props) {
    // Hooks - state
    const { token } = theme.useToken();

    const params = useParams();
    const labelId = params['label-id'];
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
        pageSize: PAGE_SIZE,
        labelId: labelId as string,
    });
    // const { height, width } = useWindowSize();
    const { layoutTable } = useTableLayoutToggle();

    // Apis
    const { releasesData, dataUpdatedAt, refetch, isFetching } =
        useGetListReleases(dataFilter);

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

            <ReleasesHeaderV2
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
                canClearFilter={canClearFilter}
                removeFilter={removeFilter}
                // handleRefresh={handleRefresh}
                // dataUpdatedAt={dataUpdatedAt}
            />

            {layoutTable === LAYOUT_TABLE.LIST && (
                <ReleasesTable
                    className="rounded-t-lg"
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                    sticky={{ offsetHeader: headerLayoutHeight }}
                    dataSource={releasesData?.items}
                    onChangeFilter={onChangeFilter}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter?.pageSize ?? PAGE_SIZE,
                        current: releasesData?.metadata?.page,
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
                <ReleasesGridTable data={releasesData?.items} loading={false} />
            )}

            <AppPagination
                className="rounded-b-lg"
                style={{ background: token.colorBgContainer }}
                align="end"
                current={releasesData.metadata.page}
                pageSize={dataFilter.pageSize}
                total={releasesData?.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </AppContent>
    );
}
