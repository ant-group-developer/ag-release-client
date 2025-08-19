import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { getIndex } from '@/helpers/common';
import { useGetListPermission } from '@/modules/permission/hooks/use-get-list-permission';
import { PermissionData } from '@/modules/permission/types';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = Omit<AppTableProps<PermissionData>, 'columns'> & {};

export default function PermissionTableItemForm({ ...props }: Props) {
    const { permissionData, dataUpdatedAt, refetch, isFetching } =
        useGetListPermission({ pageSize: 999 });
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const messages = useTranslations();
    const column: ColumnType<PermissionData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            render: (_, __, index) => getIndex(pageSize, currentPage, index),
        },
        {
            title: messages('permission.name'),
            key: 'name',
            dataIndex: 'name',
            align: 'left',
            width: 150,
            render: (value) => (
                <span className="truncate text-wrap">{value}</span>
            ),
        },
        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: 'code',
            align: 'left',
            width: 150,
            render: (value) => (
                <span className="truncate text-wrap">{value}</span>
            ),
        },
        {
            title: messages('common.note'),
            key: 'note',
            dataIndex: 'note',
            align: 'left',
            width: 250,
            render: (value) => (
                <span className="line-clamp-3 truncate whitespace-pre-line">
                    {value}
                </span>
            ),
        },
    ];
    return (
        <AppTable
            {...props}
            loading={isFetching}
            dataSource={permissionData.items}
            columns={column}
            scroll={{
                x: 'max-content',
            }}
            pagination={{
                pageSize: pageSize,
                current: currentPage,
                onChange: (page) => setCurrentPage(page),
            }}
        />
    );
}
