'use client';
import AppContainer from '@/components/app-container';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import CurrenciesHeader from '@/modules/currencies/components/header';
import CurrenciesFormModal from '@/modules/currencies/components/modal/currencies-form';
import { CurrenciesTable } from '@/modules/currencies/components/table';
import { TYPE_MODAL_CURRENCIES } from '@/modules/currencies/enums';
import { useDeleteCurrency } from '@/modules/currencies/hooks/use-delete-currency';
import { useGetListCurrencies } from '@/modules/currencies/hooks/use-get-list-currencies';
import {
    CurrenciesData,
    CurrenciesDataFilter,
} from '@/modules/currencies/types';

import { useTranslations } from 'next-intl';

type Props = {};

export default function Currencies({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<CurrenciesData>((state) => state.dataEdit);

    // apis
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<CurrenciesDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const { currenciesData, dataUpdatedAt, refetch, isFetching } =
        useGetListCurrencies(dataFilter);
    const { deleteCurrency } = useDeleteCurrency();

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
        <AppContainer title={messages('currencies.currencies')}>
            <CurrenciesHeader dataFilter={dataFilter} onSearch={onSearch} />
            <CurrenciesTable
                sticky
                dataSource={currenciesData.items}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: currenciesData.metadata.page,
                    total: currenciesData.metadata.totalItems,
                }}
                loading={isFetching}
                dataFilter={dataFilter}
                onChange={onChangeSort}
            />

            <AppPagination
                align="end"
                current={currenciesData?.metadata?.page}
                pageSize={dataFilter.pageSize}
                total={currenciesData.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {(typeModal === TYPE_MODAL_CURRENCIES.CREATE ||
                typeModal === TYPE_MODAL_CURRENCIES.UPDATE) && (
                <CurrenciesFormModal />
            )}

            {typeModal === TYPE_MODAL_CURRENCIES.DELETE && (
                <AppConfirm
                    open
                    modalTitle={messages('action.delete.title', {
                        label: dataEdit?.name,
                    })}
                    paragraph={messages('action.delete.alert', {
                        label: dataEdit?.name,
                    })}
                    onCancel={closeModal}
                    onOk={() =>
                        deleteCurrency({
                            id: dataEdit?.id,
                            onSuccess: () => closeModal(),
                        })
                    }
                />
            )}
        </AppContainer>
    );
}
