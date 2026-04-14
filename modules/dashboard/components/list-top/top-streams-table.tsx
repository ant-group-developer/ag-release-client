import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { ORDER } from '@/enums/common';
import { formattedNumber, getIndex } from '@/helpers/common';
import { Avatar } from 'antd';
import { ColumnType } from 'antd/es/table';

type Props = Omit<AppTableProps<any>, 'columns'> & {
    titleHeader?: string;
    dataFilter: any;
    orderByField: string | undefined;
    orderField: ORDER;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function TopStreamsTable({ titleHeader, ...props }: Props) {
    // const messages = useTranslations();
    // const { token } = theme.useToken();

    const columns: ColumnType<any>[] = [
        {
            title: '#',
            dataIndex: 'iNo',
            key: 'iNo',
            width: 20,
            render: (_, __, index) => {
                const rank = getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                );
                return (
                    <span className="text-sm font-bold text-gray-400">
                        {rank.toString().padStart(2, '0')}
                    </span>
                );
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 100,
            render: (value, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        shape="square"
                        size={32}
                        className="flex-shrink-0 rounded-xl"
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${value}`}
                    />
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate font-bold text-gray-900">
                            {value}
                        </span>
                        <span className="truncate text-xs text-gray-400">
                            Solar Echoes • Electronic
                        </span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Streams',
            dataIndex: 'total',
            key: 'total',
            align: 'right',
            width: 50,
            render: (value) => (
                <span className="font-bold text-gray-900">
                    {formattedNumber(value)}
                </span>
            ),
        },
    ];

    return (
        <div>
            <AppTable
                {...props}
                pagination={false}
                columns={columns}
                scroll={{ x: 'max-content', y: 330 }}
            />
        </div>
    );
}
