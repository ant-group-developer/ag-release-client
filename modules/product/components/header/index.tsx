import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import { OnSearchType } from '@/components/ui/input/search';
import TableLayoutSegmented from '@/components/ui/semented/table-layout-semented';
import { LAYOUT_TABLE } from '@/enums/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { CloseModalProps, OpenModalProps } from '@/hooks/use-modal';
import { Key } from 'react';
import { COLUMN_PRODUCT_DISPLAY, TYPE_MODAL_PRODUCT } from '../../enums';
import { DataFilterProduct, ProductData } from '../../types';
import ColumnProductDisplayDropdown from '../dropdown/column-display-dropdown';
import ProductSuperFilter from './product-super-filter';

type Props = {
    lastTimeProductUpdated: string;
    handleRefresh: () => void;
    dataFilter: DataFilterProduct;
    openModal: OpenModalProps<TYPE_MODAL_PRODUCT, ProductData>;
    closeModal: CloseModalProps;
    onSearch: OnSearchType;
    onChangeFilter: OnChangeFilter<DataFilterProduct>;
    selectedRowKeys: Key[];
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    visibleColumns: COLUMN_PRODUCT_DISPLAY[];
    handleSetVisibleColumns: (columns: COLUMN_PRODUCT_DISPLAY[]) => void;
    layoutTable: LAYOUT_TABLE;
    toggleLayoutTable: () => void;
};

export default function ProductHeader({
    openModal,
    closeModal,
    dataFilter,
    onSearch,
    onChangeFilter,
    selectedRowKeys,
    canClearFilter,
    removeFilter,
    visibleColumns,
    handleSetVisibleColumns,
    layoutTable,
    toggleLayoutTable,
    lastTimeProductUpdated,
    handleRefresh,
}: Props) {
    return (
        <div>
            <AppHeader className="px-4 py-1">
                <AppHeaderGroup>
                    <ProductSuperFilter
                        onChangeFilter={onChangeFilter}
                        dataFilter={dataFilter}
                        openModal={openModal}
                        onSearch={onSearch}
                        canClearFilter={canClearFilter}
                        removeFilter={removeFilter}
                    />
                </AppHeaderGroup>

                <AppHeaderGroup position="end" className="flex-1">
                    <div className="flex items-center gap-2">
                        <Refresh
                            handleRefresh={handleRefresh}
                            lastTimeUpdated={lastTimeProductUpdated}
                        />
                        <ColumnProductDisplayDropdown
                            visible={layoutTable === LAYOUT_TABLE.LIST}
                            visibleColumns={visibleColumns}
                            handleSetVisibleColumns={handleSetVisibleColumns}
                        />

                        <TableLayoutSegmented
                            className="!mr-2"
                            value={layoutTable}
                            onChange={toggleLayoutTable}
                        />
                    </div>
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
                </AppHeaderGroup>
            </AppHeader>
        </div>
    );
}
