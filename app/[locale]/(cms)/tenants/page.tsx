'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import CreateButton from '@/components/ui/button/create-button';
import { PAGE_SIZE } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { removeEmptyChildren } from '@/helpers/array';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTableScrollY } from '@/hooks/use-table-scroll-y';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import CreateTenantModal from '@/modules/tenant/components/tenant-create';
import TenantHeaderV2 from '@/modules/tenant/components/tenant-header-v2';
import TenantTable from '@/modules/tenant/components/tenant-table';
import { TENANT_ORDER_BY, TYPE_MODAL_TENANT } from '@/modules/tenant/enums';
import { useTenantList } from '@/modules/tenant/hooks/use-get-tenant';
import { DataFilterTenant } from '@/modules/tenant/types/data';
import { checkTenantType } from '@/modules/user/utils/role';
import { PageContainer } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';

type Props = {};

export default function TenantPage({}: Props) {
    // hooks - state
    const scrollY = useTableScrollY();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const openModal = useModalStore((state) => state.openModal);
    const messages = useTranslations();
    const {
        profile: { tenantType },
    } = useAuth();
    const { isTypeWhiteLabel } = checkTenantType(tenantType);

    // apis
    const { dataFilter, canClearFilter, onChangeFilter, removeFilter } =
        useFilter<DataFilterTenant>({
            page: 1,
            pageSize: PAGE_SIZE,
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
        <AppPageWrapper>
            <PageContainer
                title={messages('tenant.label')}
                extra={
                    <div>
                        {isTypeWhiteLabel && (
                            <CreateButton
                                canCreate={true}
                                text={messages('action.create.title', {
                                    label: messages('tenant.label'),
                                })}
                                onClick={() =>
                                    openModal(TYPE_MODAL_TENANT.CREATE)
                                }
                            />
                        )}
                    </div>
                }
            >
                {/* <TenantHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={() => refetch()}
                    lastUpdatedAt={formattedDate(dataUpdatedAt || new Date())}
                /> */}

                <TenantHeaderV2
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
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
            </PageContainer>
        </AppPageWrapper>
    );
}
