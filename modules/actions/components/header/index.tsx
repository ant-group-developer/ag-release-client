import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_ACTIONS } from '../../enums';
import { ActionsDataFilter } from '../../types';

type Props = Pick<UseFilterProps<ActionsDataFilter>, 'dataFilter' | 'onSearch'>;

export default function ActionsHeader({ dataFilter, onSearch }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    return (
        <AppHeader className="app-header p-2">
            <AppHeaderGroup>
                <div>
                    <AppSearch
                        className="max-w-52"
                        onChange={onSearch}
                        defaultValue={dataFilter.keyword}
                    />
                </div>
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    <CreateButton
                        canCreate={true}
                        text={messages('common.create')}
                        onClick={() => openModal(TYPE_MODAL_ACTIONS.CREATE)}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
