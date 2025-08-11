import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import TableLayoutSegmented from '@/components/ui/semented/table-layout-semented';
import { DATE_FORMAT, LAYOUT_TABLE } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import { TRACKS_COLUMNS_DISPLAY } from '@/modules/tracks/enums';
import { TrackDataFilter } from '../../types';
import ShowColumnOptionDropdown from '../dropdown/show-column-option-dropdown';
import TracksSuperFilter from './tracks-super-filter';

type Props = {
    dataFilter: TrackDataFilter;
    onChangeFilter: OnChangeFilter<TrackDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
    visibleColumn: TRACKS_COLUMNS_DISPLAY[];
    handleChangeVisibleColumns: (columns: TRACKS_COLUMNS_DISPLAY[]) => void;
    dataUpdatedAt: number | null;
};

export default function TracksHeader({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
    handleRefresh,
    visibleColumn,
    handleChangeVisibleColumns,
    dataUpdatedAt,
}: Props) {
    const { layoutTable, toggleLayoutTable } = useTableLayoutToggle();
    return (
        <AppHeader className="app-header">
            <AppHeaderGroup>
                <TracksSuperFilter
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
                            dataUpdatedAt,
                            DATE_FORMAT.HOUR_MINUTE_SECOND
                        )}
                    />

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
