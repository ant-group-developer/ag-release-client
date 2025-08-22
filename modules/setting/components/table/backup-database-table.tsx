import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { formattedDate, formatTime, getIndex } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { BackupDatabaseLogData } from '@/modules/backup-dabatase/types';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
type Props = Omit<AppTableProps<BackupDatabaseLogData>, 'columns'> & {
    pagination: {
        pageSize: number;
        current: number;
    };
};

export const BackupDatabaseLogTable = ({ ...props }: Props) => {
    const messages = useTranslations();
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
            render: (value, record) => (
                <CustomTooltip title={messages('common.seeMore')}>
                    <span
                        onClick={() => {
                            window.open(record?.urlDrive);
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
            align: 'left',
            width: 100,
            render: (value) => <span className="truncate">{value}</span>,
        },
        {
            title: messages('file.fileSize'),
            key: 'fileSize',
            dataIndex: 'fileSize',
            align: 'left',
            width: 100,
            render: (value) => <span className="truncate">{value}</span>,
        },
        {
            title: 'elapsed Time',
            key: 'elapsedTime',
            dataIndex: 'elapsedTime',
            align: 'left',
            width: 100,
            render: (value) => (
                <span className="truncate">{formatTime(value)}</span>
            ),
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 80,
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
            width: 80,
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
            render: (_, record) => <ActionButton showDownload />,
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
