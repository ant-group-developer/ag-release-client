'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { SCREEN } from '@/enums/common';
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
import { useWindowSize } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';

export default function Countries({}: {}) {
    const messages = useTranslations();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<CountriesDataFilter>({
        page: 1,
        pageSize: 21,
    });

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit);

    const { CountriesData } = useGetListCountries(dataFilter);

    const { deleteCountry } = useDeleteCountry();

    const handleDeleteCountry = () => {
        const variables: DeleteVariables<CountriesData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteCountry(variables);
    };

    const { height, width } = useWindowSize();
    const isSmallDevice = Number(width) <= SCREEN.MD;
    const scrollY = () => {
        if (isSmallDevice) return undefined;
        if (!height) return undefined;
        const minHeight = 300;
        const appHeaderHeight = 65;
        const pageHeaderHeight = 53;
        const tableHeaderHeight = 39;
        const paginationHeight = 55;
        const value =
            height -
            appHeaderHeight -
            pageHeaderHeight -
            tableHeaderHeight -
            paginationHeight;

        return value > minHeight ? value : minHeight;
    };

    const modalTitle = `${messages('delete.confirmTitle')}`;
    const modalParagraph = `${messages('delete.confirmMessage', { value: dataEdit?.name })}`;

    const handleRefresh = () => {};

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <CountriesHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                />
                <CountriesTable
                    dataSource={CountriesData.items ?? fakeCountriesData}
                    scroll={{ x: SCREEN.MD, y: scrollY() }}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={
                    CountriesData?.metadata?.totalItems ??
                    fakeCountriesData.length
                }
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 32]}
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
                    modalTitle={modalTitle}
                    paragraph={modalParagraph}
                />
            )}
        </div>
    );
}
