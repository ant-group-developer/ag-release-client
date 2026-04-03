'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import PriceTiersHeader from '@/modules/price_tiers/components/header';
import PriceTiersFormModal from '@/modules/price_tiers/components/modal/price-tiers-form';
import PriceTiersTable from '@/modules/price_tiers/components/table';
import { TYPE_MODAL_PRICE_TIERS } from '@/modules/price_tiers/enums';
import { useDeletePriceTiers } from '@/modules/price_tiers/hooks/use-delete-price-tiers';
import { useGetListPriceTiers } from '@/modules/price_tiers/hooks/use-get-list-tiers';
import {
    PriceTiersData,
    PriceTiersDataFilter,
} from '@/modules/price_tiers/types';
import { PageContainer } from '@ant-design/pro-components';
import { TableProps } from 'antd';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = {};

export default function PriceTiers({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<PriceTiersData>((state) => state.dataEdit);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // apis
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<PriceTiersDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
            orderBy: ORDER.ASC,
            fieldOrder: 'order',
        });
    const { priceTiersData, dataUpdatedAt, refetch, isLoading } =
        useGetListPriceTiers(dataFilter);
    // const { isLoading } = useLoadingStatus({
    //     queryKeys: [priceTiersQueryKeys.lists()],
    //     mutationKeys: [priceTiersQueryKeys.all],
    // });
    const { deletePriceTiers } = useDeletePriceTiers();

    //const
    const rowSelection: TableProps<PriceTiersData>['rowSelection'] = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(selectedRowKeys);
        },
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
        <AppPageWrapper>
            <PageContainer title={messages('price.prices')}>
                <PriceTiersTable
                    title={() => (
                        <PriceTiersHeader
                            dataFilter={dataFilter}
                            onSearch={onSearch}
                            onChangeFilter={onChangeFilter}
                            selectedRowKeys={selectedRowKeys}
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
                    rowSelection={rowSelection}
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
                    typeModal === TYPE_MODAL_PRICE_TIERS.UPDATE ||
                    typeModal === TYPE_MODAL_PRICE_TIERS.BULK_UPDATE) && (
                    <PriceTiersFormModal
                        selectedRowKeys={selectedRowKeys}
                        onSuccess={() => setSelectedRowKeys([])}
                    />
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
