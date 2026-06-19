import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_CHANNELS } from '../../enums';
import { ChannelDataFilter } from '../../types';

type Props = Pick<UseFilterProps<ChannelDataFilter>, 'dataFilter' | 'onSearch'>;

export default function ChannelsHeader({ dataFilter, onSearch }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { isAdmin } = useAuth();

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
                    <PermissionGate permission={PERMISSION.CHANNEL.CREATE}>
                        <CreateButton
                            canCreate={isAdmin}
                            text={messages('channel.add')}
                            onClick={() =>
                                openModal(TYPE_MODAL_CHANNELS.CREATE)
                            }
                        />
                    </PermissionGate>
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
