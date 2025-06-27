import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_DSP } from '../../enums';
import { DspDataFilter } from '../../types';
import DspSuperFilter from './dsp-super-filter';

type Props = {
    dataFilter: DspDataFilter;
    onChangeFilter: OnChangeFilter<DspDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
};

export default function DspHeader({
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
                <DspSuperFilter
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                />
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    <CreateButton
                        canCreate={true}
                        text="Thêm DSP"
                        onClick={() => openModal(TYPE_MODAL_DSP.CREATE)}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
