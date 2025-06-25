'use client';
import AppPagination from '@/components/ui/pagination';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import CountriesHeader from '@/modules/countries/components/header';
import CountriesFormModal from '@/modules/countries/components/modal/countries-form';
import { CountriesTable } from '@/modules/countries/components/table';
import { fakeCountriesData } from '@/modules/countries/constants';
import { TYPE_MODAL_COUNTRIES } from '@/modules/countries/enums';
import { CountriesDataFilter } from '@/modules/countries/types';

export default function Countries({}: {}) {
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

    const handleRefresh = () => {};

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <CountriesHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                />
                <CountriesTable
                    dataSource={fakeCountriesData}
                    scroll={{ x: 600, y: 400 }}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={fakeCountriesData.length}
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
        </div>
    );
}
