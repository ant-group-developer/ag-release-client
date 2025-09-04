import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { ORDER } from '@/enums/common';
import { formattedNumber, getIndex } from '@/helpers/common';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';

type Props = Omit<AppTableProps<any>, 'columns'> & {
    titleHeader: string;
    dataFilter: any;
    orderByField: string | undefined;
    orderField: ORDER;
    pagination: {
        pageSize: number;
        current: number;
    };
};

export default function TopTable({ titleHeader, ...props }: Props) {
    const messages = useTranslations();
    const columns: ColumnType<any>[] = [
        {
            title: messages('common.iNo'),
            dataIndex: 'iNo',
            key: 'iNo',
            align: 'center',
            width: 60,
            render: (_, __, index) =>
                getIndex(
                    props.pagination.pageSize,
                    props.pagination.current,
                    index
                ),
        },
        {
            title: messages('common.name'),
            dataIndex: 'name',
            key: 'name',
            width: 200,
            ellipsis: true,
            render: (value) => <span className="truncate">{value}</span>,
        },

        {
            title: messages('common.views'),
            dataIndex: 'total',
            key: 'total',
            width: 100,
            render: (value) => <span>{formattedNumber(value)}</span>,
        },
    ];

    return (
        <div>
            <p className="px-6 py-4 pb-4 text-left text-base font-bold">
                {titleHeader}
            </p>
            <AppTable
                {...props}
                pagination={false}
                columns={columns}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
}
