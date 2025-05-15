import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import TableLayoutSegmented from '@/components/ui/semented/table-layout-semented';
import { DATE_FORMAT, LAYOUT_TABLE } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import { RELEASES_COLUMNS_DISPLAY } from '../../enums';
import { ReleasesDataFilter } from '../../types';
import ShowColumnOptionDropdown from '../dropdown/show-column-option-dropdown';
import ReleasesSuperFilter from './releases-super-filter';

type Props = {
    dataFilter: ReleasesDataFilter;
    onChangeFilter: OnChangeFilter<ReleasesDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
    visibleColumn: RELEASES_COLUMNS_DISPLAY[];
    handleChangeVisibleColumns: (columns: RELEASES_COLUMNS_DISPLAY[]) => void;
};

export default function ReleasesHeader({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
    handleRefresh,
    visibleColumn,
    handleChangeVisibleColumns,
}: Props) {
    const { layoutTable, toggleLayoutTable } = useTableLayoutToggle();
    return (
        <AppHeader className="px-4 py-1">
            <AppHeaderGroup>
                <ReleasesSuperFilter
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                />
            </AppHeaderGroup>

            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    <Refresh
                        handleRefresh={handleRefresh}
                        lastTimeUpdated={formattedDate(
                            new Date(),
                            DATE_FORMAT.HOUR_MINUTE
                        )}
                    />
                    {/* <ColumnProductDisplayDropdown
                            visible={layoutTable === LAYOUT_TABLE.LIST}
                            visibleColumns={visibleColumns}
                            handleSetVisibleColumns={handleSetVisibleColumns}
                        /> */}

                    {layoutTable === LAYOUT_TABLE.LIST && (
                        <ShowColumnOptionDropdown
                            visibleColumns={visibleColumn}
                            handleSetVisibleColumns={handleChangeVisibleColumns}
                        />
                    )}

                    <TableLayoutSegmented
                        className="!mr-2"
                        value={layoutTable}
                        onChange={toggleLayoutTable}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
