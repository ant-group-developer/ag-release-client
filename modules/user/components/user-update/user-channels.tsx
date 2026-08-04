import IconButton from '@/components/ui/button/icon-button';
import AppTable from '@/components/ui/table/normal-table';
import { SIZE_ICON } from '@/constants/common';
import { formattedDate, getIndex } from '@/helpers/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { usePermission } from '@/hooks/use-permission';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import ChannelThumbImage from '@/modules/channels/components/image/channel-thumb-image';
import {
    useAddChannelAccess,
    useRemoveChannelAccess,
} from '@/modules/channels/hooks/use-channel-access';
import { useGetChannelsByUser } from '@/modules/channels/hooks/use-get-channels-by-user';
import { useGetListSimpleChannel } from '@/modules/channels/hooks/use-get-list-simple-channel';
import { UserChannelData } from '@/modules/channels/types';
import {
    Button,
    Popconfirm,
    Select,
    Space,
    Table,
    Tooltip,
    Typography,
    theme,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Plus, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useUserDetail } from '../../hooks/use-get-user';
import { UserData } from '../../types/data';

type Props = {
    dataEdit: UserData;
};

function UserChannels({ dataEdit }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const userId = dataEdit.id;
    const { dataUser } = useUserDetail(userId);

    const { isAdmin, isTenantOwnerOrAdmin } = useAuth();
    const { hasPermission } = usePermission();
    const canManageChannel =
        isAdmin ||
        isTenantOwnerOrAdmin ||
        hasPermission(PERMISSION.CHANNEL.UPDATE) ||
        hasPermission(PERMISSION.CHANNEL.DELETE);

    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
        null
    );

    const { userChannelsData, isLoading: isLoadingUserChannels } =
        useGetChannelsByUser(userId);
    const { channelsData, isLoading: isLoadingSimpleChannels } =
        useGetListSimpleChannel();
    const { addAccess, isPending: isAdding } = useAddChannelAccess({
        userId,
    });
    const { removeAccess, isPending: isRemoving } = useRemoveChannelAccess({
        userId,
    });

    const channelOptions = useMemo(() => {
        if (!channelsData.length) return [];

        const assignedIds = new Set(
            userChannelsData.map((item) => item.channelId)
        );
        const tenantMap = new Map(
            dataUser?.tenantUser?.map((item) => [
                item.tenant.id,
                item.tenant.name,
            ])
        );

        const options: {
            label: string;
            value: string;
            name: string;
            workspaceName?: string;
        }[] = [];

        for (const c of channelsData) {
            if (assignedIds.has(c.id)) continue;

            const wsName = c.tenantId ? tenantMap.get(c.tenantId) : undefined;
            if (c.tenantId && !wsName) continue;

            options.push({
                label: wsName ? `${c.name} (${wsName})` : c.name,
                value: c.id,
                name: c.name,
                workspaceName: wsName,
            });
        }

        return options;
    }, [channelsData, userChannelsData, dataUser]);

    const handleAddChannel = () => {
        if (!selectedChannelId) return;
        addAccess(
            { channelId: selectedChannelId, userIds: [userId] },
            {
                onSuccess: () => {
                    setSelectedChannelId(null);
                },
            }
        );
    };

    const columns: ColumnsType<UserChannelData> = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_, __, index) => getIndex(100, 1, index),
        },
        {
            title: messages('channel.label'),
            key: 'name',
            dataIndex: ['channel', 'name'],
            ellipsis: true,
            align: 'left',
            width: 250,
            render: (_, record) => {
                const channel = record.channel;
                const name = channel?.name || '-';
                const youtubeUrl = channel?.youtubeChannelId
                    ? `https://www.youtube.com/channel/${channel.youtubeChannelId}`
                    : undefined;

                return (
                    <Space className="max-w-full">
                        <ChannelThumbImage
                            thumbUrl={channel?.thumbUrl}
                            name={name}
                        />
                        <div className="flex max-w-full items-center gap-1">
                            {youtubeUrl ? (
                                <Tooltip
                                    title={messages('common.viewOnYoutube')}
                                >
                                    <Typography.Link
                                        href={youtubeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={
                                            {
                                                color: token.colorText,
                                                '--hover-color':
                                                    token.colorLink,
                                            } as React.CSSProperties
                                        }
                                        className="truncate font-medium hover:!text-[var(--hover-color)] hover:underline"
                                    >
                                        {name}
                                    </Typography.Link>
                                </Tooltip>
                            ) : (
                                <Typography.Text className="truncate font-medium">
                                    {name}
                                </Typography.Text>
                            )}
                            <span
                                data-stop-row-click="true"
                                className="inline-block align-middle"
                            >
                                <Typography.Text
                                    copyable={{
                                        text: name,
                                        tooltips: false,
                                    }}
                                />
                            </span>
                        </div>
                    </Space>
                );
            },
        },
        {
            title: 'YouTube Channel ID',
            key: 'youtubeChannelId',
            dataIndex: ['channel', 'youtubeChannelId'],
            ellipsis: true,
            align: 'left',
            width: 220,
            render: (_, record) => {
                const value = record.channel?.youtubeChannelId;
                if (!value) return '-';
                const youtubeUrl = `https://www.youtube.com/channel/${value}`;
                return (
                    <div className="flex max-w-full items-center gap-1">
                        <Tooltip title={messages('common.viewOnYoutube')}>
                            <Typography.Link
                                href={youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={
                                    {
                                        color: token.colorTextDescription,
                                        '--hover-color': token.colorLink,
                                    } as React.CSSProperties
                                }
                                className="truncate hover:!text-[var(--hover-color)] hover:underline"
                            >
                                {value}
                            </Typography.Link>
                        </Tooltip>
                        <span
                            data-stop-row-click="true"
                            className="inline-block align-middle"
                        >
                            <Typography.Text
                                copyable={{
                                    text: value,
                                    tooltips: false,
                                }}
                            />
                        </span>
                    </div>
                );
            },
        },
        {
            title: messages('common.joinedAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 150,
            render: (value, record) => (
                <Typography.Text className="truncate whitespace-normal">
                    {formattedDate(value || record.channel?.createdAt)}
                </Typography.Text>
            ),
        },
    ];

    if (canManageChannel) {
        columns.push({
            key: 'action',
            fixed: 'right',
            width: 80,
            align: 'center',
            render: (_, record) => {
                return (
                    <Space>
                        <Popconfirm
                            title={messages('remove.confirmTitle')}
                            description={messages('remove.confirmMessage', {
                                value: record.channel?.name || '',
                            })}
                            onConfirm={() => removeAccess(record.id)}
                            okText={messages('common.remove')}
                            cancelText={messages('common.cancel')}
                            okButtonProps={{
                                danger: true,
                                loading: isRemoving,
                            }}
                        >
                            <IconButton disabled={isRemoving}>
                                <Trash size={SIZE_ICON} color="red" />
                            </IconButton>
                        </Popconfirm>
                    </Space>
                );
            },
        });
    }

    return (
        <div className="flex flex-col gap-4">
            {canManageChannel && (
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <Select
                            showSearch
                            allowClear
                            placeholder={
                                messages.has('placeholder.select')
                                    ? messages('placeholder.select', {
                                          value: messages(
                                              'channel.label'
                                          ).toLowerCase(),
                                      })
                                    : messages('common.select')
                            }
                            value={selectedChannelId}
                            onChange={(val) => setSelectedChannelId(val)}
                            filterOption={(input, option) => {
                                const searchTarget = option?.workspaceName
                                    ? `${option.name} ${option.workspaceName}`
                                    : (option?.name ?? '');
                                return toNonAccentVietnamese(searchTarget)
                                    .toLowerCase()
                                    .includes(
                                        toNonAccentVietnamese(
                                            input
                                        ).toLowerCase()
                                    );
                            }}
                            options={channelOptions}
                            loading={isLoadingSimpleChannels}
                            className="w-full"
                        />
                    </div>
                    <Button
                        type="primary"
                        icon={<Plus size={SIZE_ICON} />}
                        onClick={handleAddChannel}
                        loading={isAdding}
                        disabled={!selectedChannelId}
                    >
                        {messages('common.add')}
                    </Button>
                </div>
            )}

            <AppTable
                className="rounded-lg border"
                columns={columns}
                dataSource={userChannelsData}
                loading={isLoadingUserChannels}
                rowKey="id"
                scroll={{ x: 0, y: 'calc(100vh - 420px)' }}
                summary={() => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={4}>
                                <Typography.Text
                                    type="secondary"
                                    className="text-xs"
                                >
                                    {messages('common.total')}:{' '}
                                    {userChannelsData.length}{' '}
                                    {messages('channel.label').toLowerCase()}
                                </Typography.Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
        </div>
    );
}

export default UserChannels;
