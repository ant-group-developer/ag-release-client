import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import CreateButton from '@/components/ui/button/create-button';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_LABEL } from '../../enum';
import { LabelDataFilter } from '../../types';
import LabelsSuperFilter from './labels-super-filter';

type Props = {
    dataFilter: LabelDataFilter;
    onChangeFilter: OnChangeFilter<LabelDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
};

export default function LabelsHeader({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
    handleRefresh,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    return (
        <AppHeader className="px-4 py-1">
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
                        lastTimeUpdated={formattedDate(
                            new Date(),
                            DATE_FORMAT.HOUR_MINUTE
                        )}
                    />
                    <CreateButton
                        canCreate={true}
                        text={messages('labels.create')}
                        onClick={() => openModal(TYPE_MODAL_LABEL.CREATE)}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
