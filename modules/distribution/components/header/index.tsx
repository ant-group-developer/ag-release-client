import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { DistributionDataFilter } from '../../types';
import DistributionSuperFilter from './distribution-super-filter';

type Props = {
    dataFilter: DistributionDataFilter;
    onChangeFilter: OnChangeFilter<DistributionDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
};

export default function DistributionHeader({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
    handleRefresh,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    return (
        <AppHeader className="app-header">
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
                    {/* 
                    <ShowColumnOptionDropdown
                        visibleColumns={visibleColumn}
                        handleSetVisibleColumns={handleChangeVisibleColumns}
                    /> */}
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
