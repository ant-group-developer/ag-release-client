import AppTable from '@/components/ui/table/normal-table';
import { formattedDate, getIndex } from '@/helpers/common';
import ChannelThumbImage from '@/modules/channels/components/image/channel-thumb-image';
import { useGetChannelsByUser } from '@/modules/channels/hooks/use-get-channels-by-user';
import { UserChannelData } from '@/modules/channels/types';
import { Input, Space, Table, Tooltip, Typography, theme } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { UserData } from '../../types/data';

type Props = {
    dataEdit: UserData;
};

function UserChannels({ dataEdit }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const userId = dataEdit.id;

    const { userChannelsData, isLoading } = useGetChannelsByUser(userId);
    const [search, setSearch] = useState('');

    const filteredData = useMemo(() => {
        if (!search.trim()) return userChannelsData;
        const keyword = search.toLowerCase();
        return userChannelsData.filter((item: UserChannelData) => {
            const channel = item.channel;
            return (
                channel?.name?.toLowerCase().includes(keyword) ||
                channel?.youtubeChannelId?.toLowerCase().includes(keyword)
            );
        });
    }, [userChannelsData, search]);

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

    return (
        <div className="flex flex-col gap-4">
            <Input.Search
                placeholder={messages('common.search')}
                allowClear
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
            />

            <AppTable
                className="rounded-lg border"
                columns={columns}
                dataSource={filteredData}
                loading={isLoading}
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
                                    {filteredData.length}{' '}
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
