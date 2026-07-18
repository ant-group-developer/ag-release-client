'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import {
    PAGE_SIZE,
    PAGE_SIZE_EXTRA_LARGE,
    PAGE_SIZE_OPTIONS,
} from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import PriceTiersHeader from '@/modules/price_tiers/components/header';
import PriceTiersFormModal from '@/modules/price_tiers/components/modal/price-tiers-form';
import PriceTiersTable from '@/modules/price_tiers/components/table';
import {
    PRICE_TIERS_TABLE_KEY,
    TYPE_MODAL_PRICE_TIERS,
} from '@/modules/price_tiers/enums';
import { useBulkUpdatePriceTiers } from '@/modules/price_tiers/hooks/use-bulk-update-tiers';
import { useDeletePriceTiers } from '@/modules/price_tiers/hooks/use-delete-price-tiers';
import { useGetListPriceTiers } from '@/modules/price_tiers/hooks/use-get-list-tiers';
import {
    PriceTiersData,
    PriceTiersDataFilter,
} from '@/modules/price_tiers/types';
import { PageContainer } from '@ant-design/pro-components';
import { TableProps } from 'antd';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

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
            pageSize: PAGE_SIZE_EXTRA_LARGE,
            orderBy: ORDER.ASC,
            fieldOrder: PRICE_TIERS_TABLE_KEY.CODE,
        });
    const { priceTiersData, dataUpdatedAt, refetch, isLoading } =
        useGetListPriceTiers(dataFilter);
    // const { isLoading } = useLoadingStatus({
    //     queryKeys: [priceTiersQueryKeys.lists()],
    //     mutationKeys: [priceTiersQueryKeys.all],
    // });
    const { deletePriceTiers } = useDeletePriceTiers();
    const { updatePriceTiersOrder, isPending: isUpdatingOrder } =
        useBulkUpdatePriceTiers();

    const [localData, setLocalData] = useState<PriceTiersData[]>([]);
    const [isReordered, setIsReordered] = useState(false);

    useEffect(() => {
        setLocalData(priceTiersData?.items || []);
        setIsReordered(false);
    }, [priceTiersData?.items]);

    const handleDragEnd = (newData: PriceTiersData[]) => {
        setLocalData(newData);
        setIsReordered(true);
    };

    const handleSaveOrder = () => {
        const payload = localData.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));

        updatePriceTiersOrder({
            priceTiers: payload,
            onSuccess: () => {
                setIsReordered(false);
                setSelectedRowKeys([]);
            },
        });
    };

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
                            isReordered={isReordered}
                            onSaveOrder={handleSaveOrder}
                            isUpdatingOrder={isUpdatingOrder}
                        />
                    )}
                    sticky
                    dataSource={
                        localData.length ? localData : priceTiersData?.items
                    }
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: priceTiersData.metadata.page,
                        total: priceTiersData.metadata.totalItems,
                    }}
                    loading={isLoading}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                    rowSelection={rowSelection}
                    onDragEnd={handleDragEnd}
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
