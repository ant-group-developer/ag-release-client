import { useAuth } from '@/modules/auth/hooks/use-auth';
import UserSelect from '@/modules/user/components/user-select';
import { DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Popconfirm, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
    useAddChannelAccess,
    useGetChannelAccess,
    useRemoveChannelAccess,
} from '../../hooks/use-channel-access';
import { ChannelAccessData } from '../../types';

type Props = {
    channelId: string;
};

export default function ChannelAccessTab({ channelId }: Props) {
    const messages = useTranslations();
    const { isAdmin, isTenantOwnerOrAdmin } = useAuth();
    const canManageAccess = isAdmin || isTenantOwnerOrAdmin;

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const { accessList, isFetching, isLoading } =
        useGetChannelAccess(channelId);
    const { addAccess, isPending: isAdding } = useAddChannelAccess({
        channelId,
    });
    const { removeAccess, isPending: isRemoving } = useRemoveChannelAccess({
        channelId,
    });

    const handleAddUser = () => {
        if (!selectedUserId) return;
        addAccess(
            { userIds: [selectedUserId] },
            {
                onSuccess: () => {
                    setSelectedUserId(null);
                },
            }
        );
    };

    const handleRemoveUser = (record: ChannelAccessData) => {
        if (!record.id) return;
        removeAccess(record.id);
    };

    const columns: ColumnsType<ChannelAccessData> = [
        {
            title: messages('user.label'),
            key: 'user',
            render: (_, record) => {
                const user = record.user;
                const name = user?.name;
                const email = user?.email;
                const avatar = user?.avatar;
                return (
                    <Space size="middle">
                        <Avatar src={avatar}>
                            {name ? name.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                        <div>
                            <Typography.Text strong>{name}</Typography.Text>
                            {email && (
                                <div>
                                    <Typography.Text
                                        type="secondary"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {email}
                                    </Typography.Text>
                                </div>
                            )}
                        </div>
                    </Space>
                );
            },
        },
    ];

    if (canManageAccess) {
        columns.push({
            title: messages('common.action'),
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Popconfirm
                    title={messages('remove.confirmTitle')}
                    description={messages('remove.confirmMessage', {
                        value: record.user?.name || record.user?.email || '',
                    })}
                    onConfirm={() => handleRemoveUser(record)}
                    okText={messages('common.remove')}
                    cancelText={messages('common.cancel')}
                    okButtonProps={{ danger: true, loading: isRemoving }}
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        disabled={isRemoving}
                    />
                </Popconfirm>
            ),
        });
    }

    return (
        <div className="flex flex-col gap-4 py-2">
            {canManageAccess && (
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <UserSelect
                            value={selectedUserId}
                            onChange={(value) =>
                                setSelectedUserId(value as string)
                            }
                            placeholder={messages('user.select')}
                            allowClear
                        />
                    </div>
                    <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        onClick={handleAddUser}
                        loading={isAdding}
                        disabled={!selectedUserId}
                    >
                        {messages('common.add')}
                    </Button>
                </div>
            )}

            <Table
                rowKey="id"
                columns={columns}
                dataSource={accessList}
                loading={isFetching || isLoading}
                pagination={false}
                size="small"
                scroll={{ y: '45vh' }}
            />
        </div>
    );
}
