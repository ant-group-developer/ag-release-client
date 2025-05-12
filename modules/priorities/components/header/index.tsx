import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import { OpenModalProps } from '@/hooks/use-modal';
import usePermissionStore from '@/hooks/use-permission';
import { TYPE_MODAL_PRIORITY } from '../../enums';
import { PriorityData } from '../../types';

type Props = {
    openModal: OpenModalProps<TYPE_MODAL_PRIORITY, PriorityData>;
};

export default function PrioritiesHeader({ openModal }: Props) {
    const canCreate = usePermissionStore(
        (state) => state.permission.priority.canCreate
    );
    return (
        <AppHeader>
            <AppHeaderGroup position="end">
                <CreateButton
                    canCreate={canCreate}
                    onClick={() => openModal(TYPE_MODAL_PRIORITY.CREATE)}
                />
            </AppHeaderGroup>
        </AppHeader>
    );
}
