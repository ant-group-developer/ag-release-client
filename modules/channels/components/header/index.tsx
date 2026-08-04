import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import TenantSelectActive from '@/components/ui/select/tenant-select-active';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { HistoryOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Select, Space } from 'antd';
import { useTranslations } from 'next-intl';
import { CHANNEL_STATUS, TYPE_MODAL_CHANNELS } from '../../enums';
import { ChannelDataFilter } from '../../types';

type Props = Pick<
    UseFilterProps<ChannelDataFilter>,
    'dataFilter' | 'onSearch' | 'onChangeFilter'
> & {
    handleRefresh: () => void;
    isFetching?: boolean;
    onShowYoutubeChannelSyncRuns?: () => void;
};

export default function ChannelsHeader({
    dataFilter,
    onSearch,
    onChangeFilter,
    handleRefresh,
    isFetching,
    onShowYoutubeChannelSyncRuns,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { isAdmin } = useAuth();

    const statusOptions = Object.values(CHANNEL_STATUS).map((status) => {
        const translationKey = `channel.status.${status.toUpperCase()}`;
        const label = messages.has(translationKey as any)
            ? messages(translationKey as any)
            : status;
        return {
            label,
            value: status,
        };
    });

    const isActiveOptions = [
        {
            label: messages('common.isActive'),
            value: 'true',
        },
        {
            label: messages('common.isInactive'),
            value: 'false',
        },
    ];

    return (
        <AppHeader className="app-header p-2">
            <AppHeaderGroup>
                <Space wrap>
                    <AppSearch
                        className="max-w-52"
                        onChange={onSearch}
                        defaultValue={dataFilter.keyword}
                    />
                    <TenantSelectActive
                        className="w-52"
                        placeholder={messages('tenant.selectTitle')}
                        allowClear
                        value={dataFilter.tenantId}
                        onChange={(tenantId) =>
                            onChangeFilter?.({
                                tenantId,
                            })
                        }
                    />
                    <Select
                        className="w-40"
                        placeholder={messages('common.status')}
                        allowClear
                        value={dataFilter.status}
                        options={statusOptions}
                        onChange={(status) =>
                            onChangeFilter?.({
                                status,
                            })
                        }
                    />
                    <Select
                        className="w-40"
                        placeholder={messages('common.isActive')}
                        allowClear
                        value={
                            dataFilter.isActive !== undefined &&
                            dataFilter.isActive !== null
                                ? String(dataFilter.isActive)
                                : undefined
                        }
                        options={isActiveOptions}
                        onChange={(isActive) =>
                            onChangeFilter?.({
                                isActive,
                            })
                        }
                    />
                </Space>
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    <Button
                        icon={<SyncOutlined />}
                        onClick={handleRefresh}
                        loading={isFetching}
                    >
                        {messages('common.refresh')}
                    </Button>
                    {isAdmin && onShowYoutubeChannelSyncRuns && (
                        <Button
                            icon={<HistoryOutlined />}
                            onClick={onShowYoutubeChannelSyncRuns}
                        >
                            {messages('channel.youtubeSyncRuns.button')}
                        </Button>
                    )}
                    <PermissionGate permission={PERMISSION.CHANNEL.CREATE}>
                        <CreateButton
                            canCreate={true}
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
