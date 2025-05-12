import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import { OnSearchType } from '@/components/ui/input/search';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { OpenModalProps } from '@/hooks/use-modal';
import usePermissionStore from '@/hooks/use-permission';
import { TYPE_MODAL_TOPIC } from '../../enums';
import { DataFilterTopic } from '../../types';
import TopicSuperFilter from './topic-super-filter';

type Props = {
    dataFilter: DataFilterTopic;
    openModal: OpenModalProps<TYPE_MODAL_TOPIC, DataFilterTopic>;
    onSearch: OnSearchType;
    onChangeFilter: OnChangeFilter<DataFilterTopic>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export default function TopicHeader({
    dataFilter,
    openModal,
    onSearch,
    onChangeFilter,
    canClearFilter,
    removeFilter,
}: Props) {
    const { canCreate } = usePermissionStore((state) => state.permission.topic);

    return (
        <AppHeader className="px-4 py-1">
            <AppHeaderGroup>
                <TopicSuperFilter
                    onChangeFilter={onChangeFilter}
                    dataFilter={dataFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                />
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <CreateButton
                    onClick={() => openModal(TYPE_MODAL_TOPIC.CREATE, null)}
                    canCreate={canCreate}
                />
            </AppHeaderGroup>
        </AppHeader>
    );
}
