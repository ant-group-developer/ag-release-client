import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { formattedDate, getIndex } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { BackupDatabaseLogData } from '../../types';
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
            title: 'Date',
            key: 'date',
            dataIndex: 'date',
            align: 'left',
            width: 150,
            ellipsis: true,
            render: (value, record) => (
                <span className="flex items-center gap-1">
                    <span className="truncate">{formattedDate(value)}</span>
                </span>
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
            title: messages('common.fileName'),
            key: 'fileName',
            dataIndex: 'fileName',
            align: 'left',
            width: 200,
            render: (value, record) => (
                <CustomTooltip title={messages('common.seeMore')}>
                    <span
                        onClick={() => {
                            window.open(record?.fileDir);
                        }}
                        className="truncate hover:underline"
                    >
                        {value}
                    </span>
                </CustomTooltip>
            ),
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
            render: (value) => <span className="truncate">{value}</span>,
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
