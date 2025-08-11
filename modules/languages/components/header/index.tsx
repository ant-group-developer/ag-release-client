import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import CreateButton from '@/components/ui/button/create-button';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_LANGUAGES } from '../../enums';
import { LanguageDataFilter } from '../../types';
import LanguageSuperFilter from './language-super-filter';

type Props = {
    dataFilter: LanguageDataFilter;
    onChangeFilter: OnChangeFilter<LanguageDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
    lastUpdatedAt: string;
};

export default function LanguagesHeader({
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
                <LanguageSuperFilter
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
                        text={messages('language.add')}
                        onClick={() => openModal(TYPE_MODAL_LANGUAGES.CREATE)}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
