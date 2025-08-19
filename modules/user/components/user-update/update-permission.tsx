import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { PAGE_SIZE } from '@/constants/page-size';
import { SCREEN } from '@/enums/common';
import { useGetListRoles } from '@/modules/roless/hooks/use-get-list-roles';
import { RolePermission, RolesData } from '@/modules/roless/types';
import { Badge } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { UserData } from '../../types/data';

type Props = {
    dataEdit: UserData;
};

function NestedPermissionTable({
    ...props
}: Omit<AppTableProps<RolePermission>, 'columns'>) {
    const messages = useTranslations();

    const columns: ColumnsType<RolePermission> = [
        {
            title: messages('permission.label'),
            dataIndex: 'title',
            width: '50%',
            render: (cell, record) => record.permission.name,
        },
        {
            title: messages('common.code'),
            dataIndex: 'name',
            width: '30%',
            render: (cell, record) => record.permission.code,
        },
        {
            title: messages('common.note'),
            dataIndex: 'note',
            width: '20%',
            render: (cell, record) => record.permission.note,
        },
    ];

    return (
        <div className="p-2">
            <AppTable
                pagination={{
                    pageSize: 5,
                    hideOnSinglePage: true,
                }}
                className="rounded-lg border"
                // bordered
                {...props}
                columns={columns}
                scroll={{
                    x: SCREEN.SM,
                }}
            />
        </div>
    );
}

function UpdatePermission({}: Props) {
    const messages = useTranslations();
    const [dataFilter, setDataFilter] = useState({
        page: 1,
        pageSize: PAGE_SIZE,
    });

    const { rolesData, dataUpdatedAt, refetch, isFetching } =
        useGetListRoles(dataFilter);

    const column: ColumnType<RolesData>[] = [
        {
            title: messages('roles.name'),
            key: 'name',
            dataIndex: 'name',
            align: 'left',
            width: 300,
            ellipsis: true,
            render: (value, record) => (
                <span className="flex items-center gap-1">
                    <Badge color={record?.color} />
                    <span className="truncate">{value}</span>
                </span>
            ),
        },
        // {
        //     title: messages('common.color'),
        //     key: 'color',
        //     dataIndex: 'color',
        //     align: 'left',
        //     width: 100,

        //     render: (value) => <AppColorPicker value={value} disabled />,
        // },
        {
            title: messages('common.note'),
            key: 'note',
            dataIndex: 'note',
            align: 'left',
            width: 350,

            render: (value) => (
                <span className="line-clamp-3 truncate whitespace-pre-line">
                    {value}
                </span>
            ),
        },
    ];

    return (
        <div>
            <AppTable
                size="middle"
                scroll={{
                    x: 0,
                }}
                columns={column}
                expandable={{
                    expandedRowRender: (record) => (
                        <NestedPermissionTable
                            dataSource={record.rolePermissions}
                        />
                    ),
                }}
                dataSource={rolesData.items}
                pagination={{
                    pageSize: dataFilter.pageSize,
                    current: dataFilter.page,
                    total: rolesData.metadata.totalItems,
                }}
            />
        </div>
    );
}

export default UpdatePermission;
