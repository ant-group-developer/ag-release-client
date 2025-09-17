'use client';
import AppContainer from '@/components/app-container';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { TenantTiersHeader } from '@/modules/tenant-tiers/components/header';
import TenantTiersFormModal from '@/modules/tenant-tiers/components/modal/tenant-tiers-form';
import TenantTiersTable from '@/modules/tenant-tiers/components/table';
import { TYPE_MODAL_TENANT_TIERS } from '@/modules/tenant-tiers/enums';
import { useDeleteTenantTiers } from '@/modules/tenant-tiers/hooks/use-delete';
import { useGetListTenantTiers } from '@/modules/tenant-tiers/hooks/use-get-list';
import {
    TenantTiersData,
    TenantTiersDataFilter,
} from '@/modules/tenant-tiers/types';
import { DeleteVariables } from '@/types/api';
import { useLocale, useTranslations } from 'next-intl';

type Props = {};

export default function TenantTiers({}: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<TenantTiersDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<TenantTiersData>((state) => state.dataEdit);

    // apis
    const { tenantTiersData, isFetching, refetch } =
        useGetListTenantTiers(dataFilter);
    const { deleteTenantTiers } = useDeleteTenantTiers();

    // func
    const handleDelete = () => {
        const variables: DeleteVariables<TenantTiersData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteTenantTiers(variables);
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
        <AppContainer title={messages('tenantTier.label')}>
            <TenantTiersHeader dataFilter={dataFilter} onSearch={onSearch} />
            <TenantTiersTable
                sticky
                dataSource={tenantTiersData?.items}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: tenantTiersData.metadata.currentPage,
                    total: tenantTiersData.metadata.totalItems,
                }}
                loading={isFetching}
                dataFilter={dataFilter}
                onChange={onChangeSort}
            />

            {(typeModal === TYPE_MODAL_TENANT_TIERS.CREATE ||
                typeModal === TYPE_MODAL_TENANT_TIERS.EDIT) && (
                <TenantTiersFormModal onCancel={closeModal} />
            )}

            {typeModal === TYPE_MODAL_TENANT_TIERS.DELETE && (
                <AppConfirm
                    open
                    onOk={() => handleDelete()}
                    onCancel={closeModal}
                    modalTitle={`${messages('common.delete')} ${messages('tenantTier.label').toLowerCase()}`}
                    paragraph={messages('delete.confirmMessage', {
                        value: getNameByLocale(
                            dataEdit?.nameEn,
                            dataEdit?.nameVi,
                            locale
                        ),
                    })}
                />
            )}

            <AppPagination
                align="end"
                current={tenantTiersData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={tenantTiersData.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </AppContainer>
    );
}
