import ActionButton from '@/components/ui/button/action-button';
import TenantSelectActive from '@/components/ui/select/tenant-select-active';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Button, Space, Switch, Tooltip, Typography, theme } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_CHANNELS } from '../../enums';
import { useUpdateChannel } from '../../hooks/use-update-channel';
import { ChannelDataFilter, ChannelsData } from '../../types';
import ChannelThumbImage from '../image/channel-thumb-image';
import ChannelStatusTag from '../tag/channel-status-tag';

type Props = Omit<AppTableProps<ChannelsData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
    dataFilter: ChannelDataFilter;
};

export const ChannelsTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { token } = theme.useToken();
    const { isAdmin } = useAuth();
    const { hasPermission } = usePermission();
    const { updateChannel, isPending, variables } = useUpdateChannel();

    const canDelete = hasPermission(PERMISSION.CHANNEL.DELETE);
    const canUpdate = hasPermission(PERMISSION.CHANNEL.UPDATE);

    const handleUpdateTenant = (record: ChannelsData, tenantId: string) => {
        updateChannel({
            id: record.id,
            payload: {
                tenantId,
            },
        });
    };

    const column: ColumnType<ChannelsData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props.pagination?.pageSize,
                    props.pagination?.current,
                    index
                ),
        },
        // {
        //     title: messages('common.thumbnail'),
        //     key: 'thumbUrl',
        //     dataIndex: 'thumbUrl',
        //     align: 'center',
        //     width: 90,
        //     render: (_, record) => (
        //         <div className="flex justify-center">
        //             <ChannelThumbImage
        //                 thumbUrl={record.thumbUrl}
        //                 name={record.name}
        //             />
        //         </div>
        //     ),
        // },
        {
            title: messages('channel.label'),
            key: 'channel.name',
            dataIndex: 'channel.name',
            ellipsis: true,
            align: 'left',
            width: 300,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'channel.name'
            ),
            render: (_, record) => {
                const youtubeUrl = record.youtubeChannelId
                    ? `https://www.youtube.com/channel/${record.youtubeChannelId}`
                    : undefined;

                return (
                    <Space className="max-w-full">
                        <ChannelThumbImage
                            thumbUrl={record.thumbUrl}
                            name={record.name}
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
                                        {record.name}
                                    </Typography.Link>
                                </Tooltip>
                            ) : (
                                <span className="truncate">{record.name}</span>
                            )}
                            <span
                                data-stop-row-click="true"
                                className="inline-block align-middle"
                            >
                                <Typography.Text
                                    copyable={{
                                        text: record.name,
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
            title: 'YouTube channel ID',
            key: 'youtubeChannelId',
            dataIndex: 'youtubeChannelId',
            ellipsis: true,
            align: 'left',
            width: 300,
            render: (value) => {
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
            title: messages('tenant.label'),
            key: 'tenant.name',
            dataIndex: 'tenant.name',
            ellipsis: true,
            align: 'left',
            width: 240,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'tenant.name'
            ),
            render: (_, record) => (
                <TenantSelectActive
                    className="!w-full"
                    value={record.tenantId || record.tenant?.id}
                    fallBack={record.tenant?.name}
                    placeholder={messages('tenant.selectTitle')}
                    disabled={!isAdmin && !canUpdate}
                    loading={isPending && variables?.id === record.id}
                    onChange={(tenantId) =>
                        handleUpdateTenant(record, tenantId)
                    }
                />
            ),
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            width: 120,
            render: (value) => <ChannelStatusTag status={value} />,
        },
        {
            title: messages('common.isActive'),
            key: 'isActive',
            dataIndex: 'isActive',
            align: 'center',
            width: 120,
            render: (value, record) => (
                <Switch
                    checked={value ?? true}
                    disabled={!isAdmin && !canUpdate}
                    loading={isPending && variables?.id === record.id}
                    onChange={(checked) =>
                        updateChannel({
                            id: record.id,
                            payload: {
                                isActive: checked,
                            },
                        })
                    }
                />
            ),
        },
        {
            title: messages('common.history'),
            key: 'history',
            align: 'center',
            width: 100,
            render: (_, record) => {
                const count =
                    record.historyCount ??
                    record.historiesCount ??
                    record.histories?.length ??
                    0;

                return (
                    <Button
                        type="link"
                        disabled={count === 0}
                        onClick={() =>
                            openModal(TYPE_MODAL_CHANNELS.HISTORY, record)
                        }
                    >
                        {count}
                    </Button>
                );
            },
        },
        {
            title: messages('common.createdAt'),
            key: 'channel.createdAt',
            dataIndex: 'channel.createdAt',
            align: 'center',
            width: 150,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'channel.createdAt'
            ),
            render: (_, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(record.createdAt)}
                </span>
            ),
        },
        {
            title: messages('common.updatedAt'),
            key: 'channel.updatedAt',
            dataIndex: 'channel.updatedAt',
            align: 'center',
            width: 150,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'channel.updatedAt'
            ),
            render: (_, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(record.updatedAt)}
                </span>
            ),
        },
        {
            key: 'actions',
            align: 'center',
            width: 50,
            fixed: 'right',
            render: (_, record) => {
                return (
                    <PermissionGate
                        anyOf={[
                            PERMISSION.CHANNEL.UPDATE,
                            PERMISSION.CHANNEL.DELETE,
                        ]}
                    >
                        <ActionButton
                            showDelete={canDelete}
                            onShowDelete={() =>
                                openModal(TYPE_MODAL_CHANNELS.DELETE, record)
                            }
                            showUpdate={canUpdate}
                            onShowUpdate={() =>
                                openModal(TYPE_MODAL_CHANNELS.UPDATE, record)
                            }
                        />
                    </PermissionGate>
                );
            },
        },
    ];

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group cursor-pointer'}
        />
    );
};
