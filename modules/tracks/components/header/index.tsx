import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import IconButton from '@/components/ui/button/icon-button';
import TableLayoutSegmented from '@/components/ui/semented/table-layout-semented';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { LAYOUT_TABLE } from '@/enums/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import { TRACKS_COLUMNS_DISPLAY } from '@/modules/tracks/enums';
import { CalendarSearch } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
    const openModal = useModalStore((state) => state.openModal);
    const messages = useTranslations();
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
                    {/* <Refresh
                        handleRefresh={handleRefresh}
                        lastTimeUpdated={formattedDate(
                            dataUpdatedAt,
                            DATE_FORMAT.HOUR_MINUTE_SECOND
                        )}
                    /> */}

                    {/* <div>
                        <IconButton
                            onClick={() =>
                                openModal(TYPE_MODAL_TRACK.ACR_CLOUD_SCAN)
                            }
                        >
                            <ScanSearch size={SIZE_ICON} />
                        </IconButton>
                    </div> */}

                    <div>
                        <IconButton
                            onClick={() =>
                                openModal(
                                    TYPE_MODAL_TRACK.ACR_CLOUD_SCAN_HISTORY
                                )
                            }
                        >
                            <CustomTooltip title={messages('common.filter')}>
                                <CalendarSearch size={SIZE_ICON} />
                            </CustomTooltip>
                        </IconButton>
                    </div>

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
