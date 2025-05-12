import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import ExportExcelButton from '@/components/ui/button/export-button';
import { ExportFileExcel } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import { OnChangeFilter, RemoveFilter, TOnSearch } from '@/hooks/use-filter';
import { useTranslations } from 'next-intl';
import { useExportExcelOrder } from '../../hooks/use-export-excel-order';
import { FilterOrderManagement } from '../../types';
import OrderManagementSuperFilter from './header-super-filter';

type Props = {
    dataFilter: FilterOrderManagement;
    onChangFilter: OnChangeFilter<FilterOrderManagement>;
    onSearch: TOnSearch;
    removeFilter: RemoveFilter;
    canClearFilter: boolean;
};

export default function OrderManagementHeader({
    dataFilter,
    onChangFilter,
    onSearch,
    removeFilter,
    canClearFilter,
}: Props) {
    const messages = useTranslations();
    const { refetch, isLoading } = useExportExcelOrder(dataFilter);
    const handleExportFile = async () => {
        const { data } = await refetch();
        if (!data)
            return showNotification(
                'error',
                messages('message.exportExcelFailed')
            );
        ExportFileExcel(data, 'list_order.xlsx');
    };

    return (
        <div>
            <AppHeader className="px-4 py-1">
                <AppHeaderGroup>
                    <OrderManagementSuperFilter
                        dataFilter={dataFilter}
                        onChangeFilter={onChangFilter}
                        onSearch={onSearch}
                        removeFilter={removeFilter}
                        canClearFilter={canClearFilter}
                    />
                </AppHeaderGroup>
                <AppHeaderGroup position="end" className="flex-1">
                    <ExportExcelButton
                        loading={isLoading}
                        onClick={() => handleExportFile()}
                    />
                </AppHeaderGroup>
            </AppHeader>
        </div>
    );
}
