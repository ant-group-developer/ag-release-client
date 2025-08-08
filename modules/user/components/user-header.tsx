import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import CreateButton from '@/components/ui/button/create-button';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
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
    handleSync,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    return (
        <AppHeader>
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
                    {/* <CustomTooltip title={messages('user.syncData')}>
                        <IconButton
                            onClick={handleSync}
                            shape="square"
                            variant="filled"
                        >
                            <CloudDownload size={SIZE_ICON} />
                        </IconButton>
                    </CustomTooltip> */}
                    <CreateButton
                        canCreate={true}
                        text={messages('action.create.title', {
                            label: messages('user.label'),
                        })}
                        onClick={() => openModal(TYPE_MODAL_USER.CREATE)}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
