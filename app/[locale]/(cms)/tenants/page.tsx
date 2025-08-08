'use client';
import { PAGE_SIZE } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { removeEmptyChildren } from '@/helpers/array';
import {
    formattedDate,
    getScrollYHeight,
    setSortOrder,
} from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import CreateTenantModal from '@/modules/tenant/components/tenant-create';
import TenantHeader from '@/modules/tenant/components/tenant-header';
import TenantTable from '@/modules/tenant/components/tenant-table';
import { TENANT_ORDER_BY, TYPE_MODAL_TENANT } from '@/modules/tenant/enums';
import { useTenantList } from '@/modules/tenant/hooks/use-get-tenant';
import { DataFilterTenant } from '@/modules/tenant/types/data';
import { useWindowSize } from '@uidotdev/usehooks';

type Props = {};

export default function TenantPage({}: Props) {
    // hooks - state
    const { height, width } = useWindowSize();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);

    // apis
    const {
        dataFilter,
        canClearFilter,
        onChangeFilter,
        onChangePage,
        removeFilter,
    } = useFilter<DataFilterTenant>({
        page: 1,
        pageSize: 21,
        fieldOrder: TENANT_ORDER_BY.UPDATED_AT,
        orderBy: ORDER.DESC,
    });
    const { data, dataUpdatedAt, refetch, isFetching } =
        useTenantList(dataFilter);

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
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <TenantHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={() => refetch()}
                    lastUpdatedAt={formattedDate(dataUpdatedAt || new Date())}
                />
                <TenantTable
                    dataSource={removeEmptyChildren(data.items)}
                    scroll={{ y: getScrollYHeight(height, width, 40, 47) }}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: data.metadata.currentPage,
                        total: data.metadata.totalItems,
                    }}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
            </div>

            {/* <AppPagination
                className="border-b border-t"
                align="end"
                current={data?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={data.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            /> */}

            {typeModal === TYPE_MODAL_TENANT.CREATE && (
                <CreateTenantModal open onCancel={closeModal} />
            )}
        </div>
    );
}
