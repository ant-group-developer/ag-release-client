import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { BackupDatabaseLogDataFilter } from '@/modules/backup-dabatase/types';
import { useTranslations } from 'next-intl';
import RolesSuperFilter from './backup-database-super-filter';

type Props = {
    dataFilter: BackupDatabaseLogDataFilter;
    onChangeFilter: OnChangeFilter<BackupDatabaseLogDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
    lastUpdatedAt: string;
};

export default function BackupDatabaseHeader({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
    handleRefresh,
    lastUpdatedAt,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    return (
        <AppHeader className="app-header">
            <AppHeaderGroup>
                <RolesSuperFilter
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
                        lastTimeUpdated={lastUpdatedAt}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
