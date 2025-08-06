import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import CreateButton from '@/components/ui/button/create-button';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import LabelsSuperFilter from '@/modules/labels/components/header/labels-super-filter';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_USER } from '../../enums';
import { DataFilterUser } from '../../types/data';

type Props = {
    handleRefresh: () => void;
    lastUpdatedAt: string;
} & Pick<
    UseFilterProps<DataFilterUser>,
    'onChangeFilter' | 'canClearFilter' | 'removeFilter' | 'dataFilter'
>;

export default function UserHeader({
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
        <AppHeader>
            <AppHeaderGroup>
                <LabelsSuperFilter
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
                        text={messages('action.create.button')}
                        onClick={() => openModal(TYPE_MODAL_USER.CREATE)}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
