import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import {
    convertSecondsToTime,
    formatFileSize,
    formattedDate,
    getIndex,
    getSortOrder,
} from '@/helpers/common';
import { getIntlCodeByBackupStatus } from '@/helpers/intl';
import { useApiNotify } from '@/hooks/use-api-notify';
import useModalStore from '@/hooks/use-modal';
import {
    BackupDatabaseLogData,
    BackupDatabaseLogDataFilter,
} from '@/modules/backup-dabatase/types';
import { Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { STATUS_BACKUP } from '../../enums';
type Props = Omit<AppTableProps<BackupDatabaseLogData>, 'columns'> & {
    dataFilter: BackupDatabaseLogDataFilter;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export const BackupDatabaseLogTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const { handleError } = useApiNotify();
    const openModal = useModalStore((state) => state.openModal);

    const column: ColumnType<BackupDatabaseLogData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },

        {
            title: messages('common.fileName'),
            key: 'fileName',
            dataIndex: 'fileName',
            align: 'left',
            width: 200,
            ellipsis: true,
            render: (value, record) => (
                <CustomTooltip title={value}>
                    <span
                        onClick={() => {
                            if (!record.urlFolderR2) return;
                            window.open(
                                record?.urlFolderR2,
                                '_blank',
                                'noopener,noreferrer'
                            );
                        }}
                        className="truncate hover:underline"
                    >
                        {value}
                    </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            width: 100,
            render: (value, record) => {
                let color = '';
                switch (record?.status) {
                    case STATUS_BACKUP.SUCCESS:
                        color = 'green';
                        break;
                    case STATUS_BACKUP.FAILED:
                        color = 'red';
                        break;
                    case STATUS_BACKUP.RUNNING:
                        color = 'blue';
                        break;
                    default:
                        break;
                }
                return (
                    <span className="truncate">
                        <Tag color={color}>
                            {messages(getIntlCodeByBackupStatus(value))}
                        </Tag>
                    </span>
                );
            },
        },
        {
            title: messages('file.fileSize'),
            key: 'fileSize',
            dataIndex: 'fileSize',
            align: 'center',
            width: 100,
            render: (value) => (
                <span className="truncate">{formatFileSize(value)}</span>
            ),
        },
        {
            title: 'Elapsed Time',
            key: 'elapsedTime',
            dataIndex: 'elapsedTime',
            align: 'center',
            width: 100,
            render: (value) => (
                <span className="truncate">{convertSecondsToTime(value)}</span>
            ),
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 130,
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
            key: 'actions',
            align: 'center',
            width: 50,
            render: (_, record) => {
                if (record?.status !== STATUS_BACKUP.SUCCESS || !record?.urlR2)
                    return;

                return (
                    <ActionButton
                        showDownload={
                            record?.status === STATUS_BACKUP.SUCCESS &&
                            !!record?.urlR2
                        }
                        onShowDownload={async () => {
                            try {
                                const linkDownload = record?.urlR2;
                                window.open(
                                    linkDownload,
                                    '_blank',
                                    'noopener,noreferrer'
                                );
                            } catch (error) {
                                handleError(error);
                            }
                        }}
                    />
                );
            },
        },
    ];

    return (
        <AppTable
            key="main"
            {...props}
            pagination={false}
            columns={column}
            rowClassName={'group cursor-pointer'}
        />
    );
};
