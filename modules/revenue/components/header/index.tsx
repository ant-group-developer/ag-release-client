import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import useModalStore from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';

import { RevenueDataFilter } from '../../types';
import RevenueSuperFilter from './super-filter';

type Props = {
    dataFilter: RevenueDataFilter;
    onChangeFilter: OnChangeFilter<RevenueDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
    dataUpdatedAt: number | null;
};

export default function RevenueHeader({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
    handleRefresh,
    dataUpdatedAt,
}: Props) {
    const { layoutTable, toggleLayoutTable } = useTableLayoutToggle();
    const openModal = useModalStore((state) => state.openModal);
    const messages = useTranslations();
    return (
        <AppHeader className="app-header">
            <AppHeaderGroup>
                <RevenueSuperFilter
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                />
            </AppHeaderGroup>

            {/* <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                </div>
            </AppHeaderGroup> */}
        </AppHeader>
    );
}
