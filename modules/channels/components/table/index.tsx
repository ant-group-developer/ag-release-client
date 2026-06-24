import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import TenantSelectActive from '@/components/ui/select/tenant-select-active';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Button } from 'antd';
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
    const { isAdmin } = useAuth();
    const { hasPermission } = usePermission();
    const { updateChannel, isPending } = useUpdateChannel();

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
        {
            title: messages('common.thumbnail'),
            key: 'thumbUrl',
            dataIndex: 'thumbUrl',
            align: 'center',
            width: 90,
            render: (_, record) => (
                <ChannelThumbImage
                    thumbUrl={record.thumbUrl}
                    name={record.name}
                />
            ),
        },
        {
            title: messages('channel.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 350,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'name'
            ),
            render: (value) => (
                <CopyText tooltipProps={{ placement: 'right' }} text={value}>
                    <p className="truncate">{value}</p>
                </CopyText>
            ),
        },
        {
            title: 'YouTube channel ID',
            key: 'youtubeChannelId',
            dataIndex: 'youtubeChannelId',
            ellipsis: true,
            align: 'left',
            width: 240,
            render: (value) =>
                value ? (
                    <CopyText
                        tooltipProps={{ placement: 'right' }}
                        text={value}
                    >
                        <p className="truncate">{value}</p>
                    </CopyText>
                ) : (
                    '-'
                ),
        },
        {
            title: messages('tenant.label'),
            key: 'tenant',
            dataIndex: 'tenant',
            ellipsis: true,
            align: 'left',
            width: 240,
            render: (_, record) => (
                <TenantSelectActive
                    className="!w-full"
                    value={record.tenantId || record.tenant?.id}
                    fallBack={record.tenant?.name}
                    placeholder={messages('tenant.selectTitle')}
                    disabled={!isAdmin && !canUpdate}
                    loading={isPending}
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
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 150,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'createdAt'
            ),
            render: (value) => (
                <span className="truncate text-wrap">
                    {formattedDate(value)}
                </span>
            ),
        },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            align: 'center',
            width: 150,
            sorter: true,
            sortOrder: getSortOrder(
                dataFilter.orderBy,
                dataFilter.fieldOrder,
                'updatedAt'
            ),
            render: (value) => (
                <span className="truncate text-wrap">
                    {formattedDate(value)}
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
                            showUpdate={isAdmin}
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
