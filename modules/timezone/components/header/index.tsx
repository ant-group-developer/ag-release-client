import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import CreateButton from '@/components/ui/button/create-button';
import useModalStore from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_TIMEZONE } from '../../enums';
import TimezoneSuperFilter from './timezone-super-filter';

type Props = {
    dataFilter: any;
    onChangeFilter: any;
    canClearFilter: boolean;
    removeFilter: any;
    handleRefresh: () => void;
    lastUpdatedAt: string;
};

export default function TimezoneHeader({
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
                <TimezoneSuperFilter
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
                    <CreateButton
                        canCreate={true}
                        text={messages('timezone.add')}
                        onClick={() => openModal(TYPE_MODAL_TIMEZONE.CREATE)}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
