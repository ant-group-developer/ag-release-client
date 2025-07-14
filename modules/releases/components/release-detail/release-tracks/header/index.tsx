import AppHeader from '@/components/cms/app-header';
import useModalStore from '@/hooks/use-modal';

type Props = {
    // dataFilter: TrackDataFilter;
    // onChangeFilter: OnChangeFilter<TrackDataFilter>;
    // canClearFilter: boolean;
    // removeFilter: RemoveFilter;
    // handleRefresh: () => void;
};

export default function ListTracksReleaseHeader(
    {
        // dataFilter,
        // onChangeFilter,
        // canClearFilter,
        // removeFilter,
        // handleRefresh,
    }: Props
) {
    // const { layoutTable, toggleLayoutTable } = useTableLayoutToggle();
    const openModal = useModalStore((state) => state.openModal);
    const typeModal = useModalStore((state) => state.typeModal);
    return (
        <AppHeader className="px-4 py-1">
            <div></div>
            {/* <AppHeaderGroup>
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
            </AppHeaderGroup> */}
        </AppHeader>
    );
}
