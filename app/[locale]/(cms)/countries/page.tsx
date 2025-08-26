'use client';
import AppContainer from '@/components/app-container';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import CountriesHeader from '@/modules/countries/components/header';
import CountriesFormModal from '@/modules/countries/components/modal/countries-form';
import { CountriesTable } from '@/modules/countries/components/table';
import { fakeCountriesData } from '@/modules/countries/constants';
import { TYPE_MODAL_COUNTRIES } from '@/modules/countries/enums';
import { useDeleteCountry } from '@/modules/countries/hooks/use-delete-country';
import { useGetListCountries } from '@/modules/countries/hooks/use-get-list-countries';
import { CountriesData, CountriesDataFilter } from '@/modules/countries/types';
import { DeleteVariables } from '@/types/api';
import { useTranslations } from 'next-intl';

export default function Countries({}: {}) {
    // hooks - state
    const messages = useTranslations();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<CountriesDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
    });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit);

    // api
    const { countriesData, isLoading, refetch, lastUpdatedAt } =
        useGetListCountries(dataFilter);
    const { deleteCountry } = useDeleteCountry();

    // func
    const handleDeleteCountry = () => {
        const variables: DeleteVariables<CountriesData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteCountry(variables);
    };
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
        <AppContainer title={messages('country.label')}>
            <CountriesHeader
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
                canClearFilter={canClearFilter}
                removeFilter={removeFilter}
                handleRefresh={handleRefresh}
                lastUpdatedAt={lastUpdatedAt}
            />
            <CountriesTable
                sticky
                dataSource={countriesData.items ?? fakeCountriesData}
                loading={isLoading}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: countriesData.metadata.currentPage,
                    total: countriesData.metadata.totalItems,
                }}
                dataFilter={dataFilter}
                onChange={onChangeSort}
            />
            <AppPagination
                className="border-t"
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={
                    countriesData?.metadata?.totalItems ??
                    fakeCountriesData.length
                }
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {(typeModal === TYPE_MODAL_COUNTRIES.CREATE ||
                typeModal === TYPE_MODAL_COUNTRIES.UPDATE) && (
                <CountriesFormModal />
            )}

            {typeModal === TYPE_MODAL_COUNTRIES.DELETE && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    onOk={() => {
                        handleDeleteCountry();
                    }}
                    modalTitle={`${messages('delete.confirmTitle')}`}
                    paragraph={`${messages('delete.confirmMessage', { value: dataEdit?.name })}`}
                />
            )}
        </AppContainer>
    );
}
