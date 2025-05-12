import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import usePermissionStore from '@/hooks/use-permission';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_PRODUCT_TYPE } from '../../enums';

type Props = {
    openModal: (type: string, data?: any) => void;
};

export default function ProductTypesHeader({ openModal }: Props) {
    const messages = useTranslations();
    const canCreate = usePermissionStore(
        (state) => state.permission.productType.canCreate
    );

    return (
        <AppHeader>
            <AppHeaderGroup position="end">
                <CreateButton
                    canCreate={canCreate}
                    onClick={() => openModal(TYPE_MODAL_PRODUCT_TYPE.CREATE)}
                >
                    {messages('productType.action.create')}
                </CreateButton>
            </AppHeaderGroup>
        </AppHeader>
    );
}
