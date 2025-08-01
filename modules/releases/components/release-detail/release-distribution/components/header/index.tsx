import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { DISTRIBUTION_COLUMNS_DISPLAY } from '@/modules/distribution/enum';
import { DistributionDataFilter } from '@/modules/distribution/types';
import { useTranslations } from 'next-intl';
import DistributionSuperFilter from './distribution-super-filter';

type Props = {
    dataFilter: DistributionDataFilter;
    onChangeFilter: OnChangeFilter<DistributionDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
    handleChangeVisibleColumns: (
        columns: DISTRIBUTION_COLUMNS_DISPLAY[]
    ) => void;
    visibleColumn: DISTRIBUTION_COLUMNS_DISPLAY[];
};

export default function DistributionHeader({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
    handleRefresh,
    handleChangeVisibleColumns,
    visibleColumn,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    return (
        <AppHeader>
            <AppHeaderGroup>
                <DistributionSuperFilter
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
                            DATE_FORMAT.HOUR_MINUTE_SECOND
                        )}
                    />

                    {/* <ShowColumnOptionDropdown
                        visibleColumns={visibleColumn}
                        handleSetVisibleColumns={handleChangeVisibleColumns}
                    /> */}
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
