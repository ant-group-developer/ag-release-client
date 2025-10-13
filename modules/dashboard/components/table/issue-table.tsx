import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedNumber } from '@/helpers/common';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { IssueCountData } from '../../types';

type Props = AppTableProps<IssueCountData> & {};

export default function IssueTable({ ...props }: Props) {
    const messages = useTranslations();
    const column: ColumnType<IssueCountData>[] = [
        {
            title: messages('common.iNo'),
            dataIndex: 'iNo',
            key: 'iNo',
            align: 'center',
            width: 60,
            render: (_, __, index) => (index = index + 1),
        },
        {
            title: messages('issue.label'),
            dataIndex: 'name',
            key: 'name',
            width: 200,
            ellipsis: true,
            render: (value, record) => {
                return <span className="truncate">{record?.nameEn}</span>;
            },
        },

        {
            title: messages('common.total'),
            dataIndex: 'issue',
            key: 'issue',
            width: 100,
            align: 'center',
            render: (value, record) => (
                <span>{formattedNumber(record.total)}</span>
            ),
        },
    ];
    return <AppTable {...props} columns={column} />;
}
