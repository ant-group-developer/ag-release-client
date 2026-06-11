import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import TenantSelect from '@/components/ui/select/tenant-select';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIndex, getSortOrder } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_CHANNELS } from '../../enums';
import { useUpdateChannel } from '../../hooks/use-update-channel';
import { ChannelDataFilter, ChannelsData } from '../../types';

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
    const { updateChannel, isPending } = useUpdateChannel();

    const handleUpdateTenant = (record: ChannelsData, tenantId: string) => {
        const currentTenantId = record.tenantId || record.tenant?.id;
        if (!isAdmin || !tenantId || tenantId === currentTenantId) return;

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
            title: messages('tenant.label'),
            key: 'tenant',
            dataIndex: 'tenant',
            ellipsis: true,
            align: 'left',
            width: 240,
            render: (_, record) => (
                <TenantSelect
                    className="!w-full"
                    value={record.tenantId || record.tenant?.id}
                    fallBack={record.tenant?.name}
                    placeholder={messages('tenant.selectTitle')}
                    disabled={!isAdmin}
                    loading={isPending}
                    onChange={(tenantId) =>
                        handleUpdateTenant(record, tenantId)
                    }
                />
            ),
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
            render: (_, record) => (
                <ActionButton
                    showDelete
                    onShowDelete={() =>
                        openModal(TYPE_MODAL_CHANNELS.DELETE, record)
                    }
                    showUpdate={isAdmin}
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_CHANNELS.UPDATE, record)
                    }
                />
            ),
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
