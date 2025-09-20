'use client';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER, SCREEN } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import RevenueHeader from '@/modules/revenue/components/header';
import RevenueTable from '@/modules/revenue/components/table';
import { useGetListRevenue } from '@/modules/revenue/hooks/use-get-list-tracks';
import { RevenueDataFilter } from '@/modules/revenue/types';

import { theme } from 'antd';

type Props = {};

export default function Revenue({}: Props) {
    // State - hook
    const { token } = theme.useToken();
    const typeModal = useModalStore((state) => state.typeModal);
    const {
        dataFilter,
        onSearch,
        onChangePage,
        onChangeFilter,
        canClearFilter,
        removeFilter,
    } = useFilter<RevenueDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
    });
    const {
        revenueData,
        isFetching: isTrackDataLoading,
        dataUpdatedAt,
        refetch,
    } = useGetListRevenue(dataFilter);

    // Function
    const handleRefresh = () => {
        refetch();
    };
    const onChangeSort = (pagination: any, filters: any, sort: any) => {
        const orderBy = setSortOrder(sort, ORDER.ASC);
        const fieldOrder = sort.field;
        onChangeFilter(
            {
                orderBy,
                fieldOrder,
            },
            false
        );
    };

    return (
        <div>
            <div className="app-header">
                <RevenueHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    dataUpdatedAt={dataUpdatedAt}
                />
            </div>

            <RevenueTable
                sticky
                dataSource={revenueData.items}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: revenueData.metadata.currentPage,
                }}
                loading={isTrackDataLoading}
                onChange={onChangeSort}
                dataFilter={dataFilter}
                scroll={{ x: SCREEN.XXL }}
            />

            <AppPagination
                className="border-b"
                align="end"
                current={revenueData?.metadata?.currentPage}
                pageSize={dataFilter?.pageSize}
                total={revenueData?.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </div>
    );
}
