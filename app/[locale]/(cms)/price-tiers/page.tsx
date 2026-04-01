'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import useModalStore from '@/hooks/use-modal';
import PriceTiersHeader from '@/modules/price_tiers/components/header';
import PriceTiersFormModal from '@/modules/price_tiers/components/modal/price-tiers-form';
import PriceTiersTable from '@/modules/price_tiers/components/table';
import { priceTiersQueryKeys } from '@/modules/price_tiers/constants/query-keys';
import { TYPE_MODAL_PRICE_TIERS } from '@/modules/price_tiers/enums';
import { useDeletePriceTiers } from '@/modules/price_tiers/hooks/use-delete-price-tiers';
import { useGetListPriceTiers } from '@/modules/price_tiers/hooks/use-get-list-tiers';
import {
    PriceTiersData,
    PriceTiersDataFilter,
} from '@/modules/price_tiers/types';
import { PageContainer } from '@ant-design/pro-components';

import { useTranslations } from 'next-intl';

type Props = {};

export default function PriceTiers({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<PriceTiersData>((state) => state.dataEdit);

    // apis
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<PriceTiersDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const { priceTiersData, dataUpdatedAt, refetch } =
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
        <AppPageWrapper>
            <PageContainer title={messages('price.prices')}>
                <PriceTiersTable
                    title={() => (
                        <PriceTiersHeader
                            dataFilter={dataFilter}
                            onSearch={onSearch}
                            onChangeFilter={onChangeFilter}
                        />
                    )}
                    sticky
                    dataSource={priceTiersData.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: priceTiersData.metadata.page,
                        total: priceTiersData.metadata.totalItems,
                    }}
                    loading={isLoading}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />

                <AppPagination
                    align="end"
                    current={priceTiersData?.metadata?.page}
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
            </PageContainer>
        </AppPageWrapper>
    );
}
