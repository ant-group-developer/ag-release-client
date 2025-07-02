import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import CreateButton from '@/components/ui/button/create-button';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_ARTIST_ROLE } from '../../enums';
import { ArtistRoleDataFilter } from '../../types';
import ArtistRoleSuperFilter from './artist-role-super-filter';

type Props = {
    dataFilter: ArtistRoleDataFilter;
    onChangeFilter: OnChangeFilter<ArtistRoleDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
    lastUpdatedAt: string;
};

export default function ArtistRoleHeader({
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
        <AppHeader className="px-4 py-1">
            <AppHeaderGroup>
                <ArtistRoleSuperFilter
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
                        text={messages('role.add')}
                        onClick={() => openModal(TYPE_MODAL_ARTIST_ROLE.CREATE)}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
