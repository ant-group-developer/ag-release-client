import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { useGetListRoles } from '@/modules/roles/hooks/use-get-list-roles';
import { RolePermission, RolesData } from '@/modules/roles/types';
import { Badge, Button } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { Key, useEffect, useState } from 'react';
import { useUserRole } from '../../hooks/use-get-user';
import { useUpdateUserRole } from '../../hooks/use-update-user';
import { UserData } from '../../types/data';
import { checkCanAccessTenantAll } from '../../utils/role';

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
                    showSizeChanger: false,
                }}
                className="rounded-lg border"
                {...props}
                columns={columns}
                scroll={{
                    x: 0,
                }}
            />
        </div>
    );
}

function UpdatePermission({ dataEdit }: Props) {
    const messages = useTranslations();

    const userId = dataEdit.id;
    const canAccessTenantAll = checkCanAccessTenantAll(
        dataEdit.type,
        dataEdit.tenantUser[0]?.type
    );

    const { rolesData } = useGetListRoles({
        pageSize: 999,
    });
    const { updateUserRole, isPending } = useUpdateUserRole();

    const { data } = useUserRole(userId);
    useEffect(() => {
        setSelectedKeys(data.map((item) => item.id));
    }, [data]);

    const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

    const column: ColumnType<RolesData>[] = [
        {
            title: messages('roles.name'),
            key: 'name',
            dataIndex: 'name',
            align: 'left',
            width: 180,
            ellipsis: true,
            render: (value, record) => (
                <span className="flex items-center gap-1">
                    <Badge color={record?.color} />
                    <span className="truncate">{value}</span>
                </span>
            ),
        },
        {
            title: messages('common.note'),
            key: 'note',
            dataIndex: 'note',
            align: 'left',
            width: 370,
            render: (value) => (
                <span className="line-clamp-3 truncate whitespace-pre-line">
                    {value}
                </span>
            ),
        },
    ];

    const onSubmit = () => {
        updateUserRole({
            payload: {
                userId: userId,
                roleIds: selectedKeys as string[],
            },
        });
    };

    return (
        <div>
            <AppTable
                className="rounded-lg border"
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
                    pageSize: 15,
                    total: rolesData.metadata.totalItems,
                }}
                rowSelection={{
                    selectedRowKeys: selectedKeys,
                    onChange: (value) => setSelectedKeys(value),
                }}
            />
            {!canAccessTenantAll && (
                <div className="mt-2 text-right">
                    <Button
                        type="primary"
                        onClick={onSubmit}
                        loading={isPending}
                    >
                        {messages('common.submit')}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default UpdatePermission;
