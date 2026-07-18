import ActionButton from '@/components/ui/button/action-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate, getIndex } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Tag, Tooltip } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_YOUTUBE_KEYS, YOUTUBE_KEY_STATUS } from '../../enums';
import { YoutubeKeyData } from '../../types';

type Props = Omit<AppTableProps<YoutubeKeyData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
};

export const YoutubeKeysTable = ({ ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case YOUTUBE_KEY_STATUS.ACTIVE:
                return 'success';
            case YOUTUBE_KEY_STATUS.DISABLED:
            case 'inactive':
                return 'error';
            default:
                return 'default';
        }
    };

    const columns: ColumnType<YoutubeKeyData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 60,
            align: 'left',
            render: (_, __, index) =>
                getIndex(
                    props.pagination?.pageSize,
                    props.pagination?.current,
                    index
                ),
        },
        {
            title: messages('youtubeKeys.alias'),
            key: 'alias',
            dataIndex: 'alias',
            ellipsis: true,
            align: 'left',
            width: 200,
            render: (value) => (
                <CopyText tooltipProps={{ placement: 'right' }} text={value}>
                    <p className="truncate font-semibold">{value}</p>
                </CopyText>
            ),
        },
        {
            title: messages('youtubeKeys.keyHint'),
            key: 'keyHint',
            dataIndex: 'keyHint',
            ellipsis: true,
            align: 'left',
            width: 150,
            render: (value) =>
                value ? (
                    <CopyText
                        tooltipProps={{ placement: 'right' }}
                        text={value}
                    >
                        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
                            {value}
                        </code>
                    </CopyText>
                ) : (
                    '-'
                ),
        },
        {
            title: messages('youtubeKeys.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'left',
            width: 120,
            render: (value) => {
                if (!value) return '-';
                const statusColor = getStatusColor(value);
                const translationKey = `status.${value.toLowerCase()}`;
                const label = messages.has(translationKey as any)
                    ? messages(translationKey as any)
                    : value;
                return (
                    <Tag color={statusColor} className="!mr-0 font-medium">
                        {label}
                    </Tag>
                );
            },
        },
        {
            title: messages('youtubeKeys.dailyQuotaLimit'),
            key: 'dailyQuotaLimit',
            dataIndex: 'dailyQuotaLimit',
            align: 'left',
            width: 220,
            render: (value) =>
                value !== undefined ? value.toLocaleString() : '-',
        },
        {
            title: messages('youtubeKeys.unitsConsumedToday'),
            key: 'unitsConsumedToday',
            dataIndex: 'unitsConsumedToday',
            align: 'left',
            width: 180,
            render: (value) =>
                value !== undefined ? value.toLocaleString() : '-',
        },
        {
            title: messages('youtubeKeys.unitsRemaining'),
            key: 'unitsRemaining',
            dataIndex: 'unitsRemaining',
            align: 'left',
            width: 140,
            render: (value) =>
                value !== undefined ? value.toLocaleString() : '-',
        },
        {
            title: messages('youtubeKeys.consecutiveErrorCount'),
            key: 'consecutiveErrorCount',
            dataIndex: 'consecutiveErrorCount',
            align: 'left',
            width: 240,
            render: (value) => (
                <span className={value > 0 ? 'font-bold text-red-500' : ''}>
                    {value}
                </span>
            ),
        },
        {
            title: messages('youtubeKeys.lastUsedAt'),
            key: 'lastUsedAt',
            dataIndex: 'lastUsedAt',
            align: 'left',
            width: 180,
            render: (value) => (value ? formattedDate(value) : '-'),
        },
        {
            title: messages('youtubeKeys.lastResetAt'),
            key: 'lastResetAt',
            dataIndex: 'lastResetAt',
            align: 'left',
            width: 180,
            render: (value) => (value ? formattedDate(value) : '-'),
        },
        {
            title: messages('youtubeKeys.lastError'),
            key: 'lastError',
            dataIndex: 'lastError',
            ellipsis: true,
            align: 'left',
            width: 250,
            render: (value) =>
                value ? (
                    <Tooltip title={value} placement="topLeft">
                        <span className="block cursor-help truncate text-red-500">
                            {value}
                        </span>
                    </Tooltip>
                ) : (
                    '-'
                ),
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'left',
            width: 180,
            render: (value) => (value ? formattedDate(value) : '-'),
        },
        {
            title: messages('common.updatedAt'),
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            align: 'left',
            width: 180,
            render: (value) => (value ? formattedDate(value) : '-'),
        },
        {
            key: 'actions',
            align: 'center',
            width: 80,
            fixed: 'right',
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    onShowUpdate={() =>
                        openModal(TYPE_MODAL_YOUTUBE_KEYS.UPDATE, record)
                    }
                />
            ),
        },
    ];

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={columns}
            rowClassName={'group cursor-pointer'}
            className="[&_td]:whitespace-nowrap [&_th]:whitespace-nowrap"
        />
    );
};
