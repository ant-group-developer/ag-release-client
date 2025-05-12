import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import CreateButton from '@/components/ui/button/create-button';
import { OnSearchType } from '@/components/ui/input/search';
import TableLayoutSegmented from '@/components/ui/semented/table-layout-semented';
import { LAYOUT_TABLE } from '@/enums/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { OpenModalProps } from '@/hooks/use-modal';
import usePermissionStore from '@/hooks/use-permission';
import { COLUMN_ORDER_DISPLAY, TYPE_MODAL_ORDER } from '../../enums';
import { DataFilterOrder, OrderData } from '../../types';
import ColumnOrderDisplayDropdown from '../dropdown/column-display-dropdown';
import OrderSuperFilter from './order-super-filter';

type Props = {
    lastTimeOrderUpdated: string;
    handleRefresh: () => void;
    layoutTable: LAYOUT_TABLE;
    toggleLayoutTable: () => void;
    dataFilter: DataFilterOrder;
    openModal: OpenModalProps<TYPE_MODAL_ORDER, OrderData>;
    onSearch: OnSearchType;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    visibleColumns: COLUMN_ORDER_DISPLAY[];
    handleSetVisibleColumns: (columns: COLUMN_ORDER_DISPLAY[]) => void;
    onChangeFilter: OnChangeFilter<DataFilterOrder>;
};
export default function OrderHeader({
    openModal,
    dataFilter,
    onSearch,
    onChangeFilter,
    canClearFilter,
    removeFilter,
    visibleColumns,
    handleSetVisibleColumns,
    layoutTable,
    toggleLayoutTable,
    lastTimeOrderUpdated,
    handleRefresh,
}: Props) {
    const { canCreate } = usePermissionStore((state) => state.permission.order);

    return (
        <AppHeader className="px-4 py-1">
            {/* <AppHeaderGroup> */}
            <OrderSuperFilter
                onChangeFilter={onChangeFilter}
                dataFilter={dataFilter}
                canClearFilter={canClearFilter}
                removeFilter={removeFilter}
            />
            {/* </AppHeaderGroup> */}
            <AppHeaderGroup position="end" className="flex-1 flex-nowrap">
                <Refresh
                    lastTimeUpdated={lastTimeOrderUpdated}
                    handleRefresh={handleRefresh}
                />
                <ColumnOrderDisplayDropdown
                    visible={layoutTable === LAYOUT_TABLE.LIST}
                    visibleColumns={visibleColumns}
                    handleSetVisibleColumns={handleSetVisibleColumns}
                />

                <TableLayoutSegmented
                    value={layoutTable}
                    onChange={toggleLayoutTable}
                />

                {/* <DateSelect
                        selectClassName="w-[150px]"
                        rangeClassName="w-[250px]"
                        externalOnChange={(fromDate, toDate) =>
                            onChangeFilter({
                                startDate: fromDate,
                                endDate: toDate,
                            })
                        }
                        value={`${dataFilter.startDate},${dataFilter.endDate}`}
                    /> */}
                <CreateButton
                    canCreate={canCreate}
                    onClick={() => openModal(TYPE_MODAL_ORDER.CREATE, null)}
                />
            </AppHeaderGroup>
        </AppHeader>
    );
}
