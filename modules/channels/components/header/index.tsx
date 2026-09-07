import AppSearch from '@/components/ui/input/search';
import TenantSelectActive from '@/components/ui/select/tenant-select-active';
import { UseFilterProps } from '@/hooks/use-filter';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { HistoryOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Select, Space } from 'antd';
import { useTranslations } from 'next-intl';
import { CHANNEL_STATUS } from '../../enums';
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
        <div className="flex flex-wrap items-center justify-between gap-2 p-2">
            <Space
                wrap
                className="w-full sm:w-auto [&_.ant-space-item]:w-full sm:[&_.ant-space-item]:w-auto"
            >
                <AppSearch
                    wrapperClassName="w-full sm:w-52"
                    className="w-full"
                    onChange={onSearch}
                    defaultValue={dataFilter.keyword}
                />
                <TenantSelectActive
                    className="!w-full sm:!w-52"
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
                    className="!w-full sm:!w-40"
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
                    className="!w-full sm:!w-40"
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

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                {isAdmin && onShowYoutubeChannelSyncRuns && (
                    <Button
                        icon={<HistoryOutlined />}
                        onClick={onShowYoutubeChannelSyncRuns}
                        className="w-full sm:w-auto"
                    >
                        {messages('channel.youtubeSyncRuns.button')}
                    </Button>
                )}
                <Button
                    icon={<SyncOutlined />}
                    onClick={handleRefresh}
                    loading={isFetching}
                    className="w-full sm:w-auto"
                >
                    {messages('common.refresh')}
                </Button>
            </div>
        </div>
    );
}
