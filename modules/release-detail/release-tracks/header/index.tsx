import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import { TrackDataFilter } from '@/modules/tracks/types';
import ListTracksReleaseSuperFilter from './tracks-super-filter';

type Props = {
    dataFilter: TrackDataFilter;
    onChangeFilter: OnChangeFilter<TrackDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
};

export default function ListTracksReleaseHeader({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
    handleRefresh,
}: Props) {
    const { layoutTable, toggleLayoutTable } = useTableLayoutToggle();
    return (
        <AppHeader className="px-4 py-1">
            <AppHeaderGroup>
                <ListTracksReleaseSuperFilter
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
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
