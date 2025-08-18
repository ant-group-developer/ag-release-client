import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import CreateButton from '@/components/ui/button/create-button';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { UserAddOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_USER } from '../enums';
import { DataFilterUser } from '../types/data';
import UserHeaderFilter from './user-header-filter';

type Props = {
    handleRefresh: () => void;
    handleSync: () => void;
    lastUpdatedAt: string;
} & Pick<
    UseFilterProps<DataFilterUser>,
    'onChangeFilter' | 'canClearFilter' | 'removeFilter' | 'dataFilter'
>;

export default function UserHeader({
    dataFilter,
    canClearFilter,
    lastUpdatedAt,
    onChangeFilter,
    removeFilter,
    handleRefresh,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    return (
        <AppHeader className="app-header">
            <AppHeaderGroup>
                <UserHeaderFilter
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
                        text={messages('action.create.title', {
                            label: messages('user.label'),
                        })}
                        onClick={() => openModal(TYPE_MODAL_USER.CREATE)}
                    />
                    <CreateButton
                        canCreate={true}
                        text={messages('action.invite.title', {
                            label: messages('user.label'),
                        })}
                        onClick={() => openModal(TYPE_MODAL_USER.INVITE)}
                        ghost
                        icon={<UserAddOutlined />}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
