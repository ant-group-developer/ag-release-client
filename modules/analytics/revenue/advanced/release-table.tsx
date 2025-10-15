import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedNumber } from '@/helpers/common';
import { ColumnType } from 'antd/es/table';

type Props = Omit<AppTableProps<any>, 'columns'> & {
    pagination?: {
        pageSize: number;
        current: number;
    };
    dataFilter?: any;
};

export const AnalyticReleaseTable = ({ dataFilter, ...props }: Props) => {
    const columns: ColumnType<any>[] = [
        {
            title: 'Release',
            dataIndex: 'name',
            key: 'name',
            width: 600,
            fixed: 'left',
        },
        {
            title: 'Artist',
            dataIndex: 'artist',
            key: 'artist',
            width: 200,
        },
        {
            title: 'Streams',
            dataIndex: 'streams',
            key: 'streams',
            align: 'center',
            width: 200,
            render(value, record, index) {
                return <span>{formattedNumber(record?.streams)}</span>;
            },
        },
        {
            title: 'Revenue',
            dataIndex: 'revenue',
            key: 'revenue',
            align: 'center',
            width: 200,
            render(value, record, index) {
                return <span>${formattedNumber(record?.revenue)}</span>;
            },
        },
    ];

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={columns}
            rowClassName={'group cursor-pointer'}
        />
    );
};
