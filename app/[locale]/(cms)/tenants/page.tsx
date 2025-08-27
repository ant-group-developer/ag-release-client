'use client';
import { PAGE_SIZE } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { removeEmptyChildren } from '@/helpers/array';
import { formattedDate, setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTableScrollY } from '@/hooks/use-table-scroll-y';
import CreateTenantModal from '@/modules/tenant/components/tenant-create';
import TenantHeader from '@/modules/tenant/components/tenant-header';
import TenantTable from '@/modules/tenant/components/tenant-table';
import { TENANT_ORDER_BY, TYPE_MODAL_TENANT } from '@/modules/tenant/enums';
import { useTenantList } from '@/modules/tenant/hooks/use-get-tenant';
import { DataFilterTenant } from '@/modules/tenant/types/data';

type Props = {};

export default function TenantPage({}: Props) {
    // hooks - state
    const scrollY = useTableScrollY();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);

    // apis
    const { dataFilter, canClearFilter, onChangeFilter, removeFilter } =
        useFilter<DataFilterTenant>({
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
        <div>
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
                scroll={{
                    y: scrollY,
                }}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: data.metadata.currentPage,
                    total: data.metadata.totalItems,
                }}
                loading={isFetching}
                dataFilter={dataFilter}
                onChange={onChangeSort}
            />

            {/* <AppPagination
                className="border-b "
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
