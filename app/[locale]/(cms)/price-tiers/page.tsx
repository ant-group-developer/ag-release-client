'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { formattedDate, setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import useModalStore from '@/hooks/use-modal';
import { useTableScrollY } from '@/hooks/use-table-scroll-y';
import PriceTiersHeader from '@/modules/price_tiers/components/header';
import PriceTiersFormModal from '@/modules/price_tiers/components/modal/price-tiers-form';
import { PriceTiersTable } from '@/modules/price_tiers/components/table';
import { priceTiersQueryKeys } from '@/modules/price_tiers/constants/query-keys';
import { TYPE_MODAL_PRICE_TIERS } from '@/modules/price_tiers/enums';
import { useDeletePriceTiers } from '@/modules/price_tiers/hooks/use-delete-price-tiers';
import { useGetListPriceTiers } from '@/modules/price_tiers/hooks/use-get-list-tiers';
import {
    PriceTiersData,
    PriceTiersDataFilter,
} from '@/modules/price_tiers/types';

import { useTranslations } from 'next-intl';

type Props = {};

export default function PriceTiers({}: Props) {
    // hooks - state
    const scrollY = useTableScrollY();
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<PriceTiersData>((state) => state.dataEdit);

    // apis
    const {
        dataFilter,
        canClearFilter,
        onChangeFilter,
        onChangePage,
        removeFilter,
    } = useFilter<PriceTiersDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
    });
    const { priceTiersData, dataUpdatedAt, refetch, isFetching } =
        useGetListPriceTiers(dataFilter);
    const { isLoading } = useLoadingStatus({
        queryKeys: [priceTiersQueryKeys.lists()],
        mutationKeys: [priceTiersQueryKeys.all],
    });
    const { deletePriceTiers } = useDeletePriceTiers();

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
            <PriceTiersHeader
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
                canClearFilter={canClearFilter}
                removeFilter={removeFilter}
                handleRefresh={() => refetch()}
                lastUpdatedAt={formattedDate(dataUpdatedAt || new Date())}
            />

            <PriceTiersTable
                dataSource={priceTiersData.items}
                scroll={{
                    y: scrollY,
                }}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: priceTiersData.metadata.currentPage,
                    total: priceTiersData.metadata.totalItems,
                }}
                loading={isLoading}
                dataFilter={dataFilter}
                onChange={onChangeSort}
            />

            <AppPagination
                className="border-b border-t"
                align="end"
                current={priceTiersData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={priceTiersData.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {(typeModal === TYPE_MODAL_PRICE_TIERS.CREATE ||
                typeModal === TYPE_MODAL_PRICE_TIERS.UPDATE) && (
                <PriceTiersFormModal />
            )}

            {typeModal === TYPE_MODAL_PRICE_TIERS.DELETE && (
                <AppConfirm
                    open
                    modalTitle={messages('action.delete.title', {
                        label: `${messages('price.label').toLowerCase()} "${dataEdit?.amount}"`,
                    })}
                    paragraph={messages('action.delete.alert', {
                        label: `${messages('price.label').toLowerCase()}  "${dataEdit?.amount}"`,
                    })}
                    onCancel={closeModal}
                    onOk={() =>
                        deletePriceTiers({
                            id: dataEdit?.id,
                            onSuccess: () => closeModal(),
                        })
                    }
                />
            )}
        </div>
    );
}
