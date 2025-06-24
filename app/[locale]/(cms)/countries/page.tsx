'use client';
import AppPagination from '@/components/ui/pagination';
import { useFilter } from '@/hooks/use-filter';
import CountriesHeader from '@/modules/countries/components/header';
import { CountriesTable } from '@/modules/countries/components/table';
import { fakeCountryData } from '@/modules/countries/constants';
import { CountryDataFilter } from '@/modules/countries/types';

export default function Countries({}: {}) {
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<CountryDataFilter>({
        page: 1,
        pageSize: 21,
    });

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
                    dataSource={fakeCountryData}
                    scroll={{ x: 600, y: 400 }}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={fakeCountryData.length}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 32]}
            />
        </div>
    );
}
