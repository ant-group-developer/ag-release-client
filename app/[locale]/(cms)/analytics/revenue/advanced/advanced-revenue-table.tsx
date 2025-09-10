import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import useModalStore from '@/hooks/use-modal';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';

type Props = Omit<AppTableProps<any>, 'columns'> & {
    pagination?: {
        pageSize: number;
        current: number;
    };
    dataFilter?: any;
};

export const AdvancedRevenueTable = ({ dataFilter, ...props }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const columns: ColumnType<any>[] = [
        {
            title: 'Title',
            dataIndex: 'name',
            key: 'name',
            width: 800,
            fixed: 'left',
        },
        {
            title: 'Artist',
            dataIndex: 'artist',
            key: 'artist',
        },
        {
            title: 'Streams',
            dataIndex: 'streams',
            key: 'streams',
        },
        {
            title: 'Revenue',
            dataIndex: 'revenue',
            key: 'revenue',
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
