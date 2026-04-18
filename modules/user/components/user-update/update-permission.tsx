import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { RolePermission, RolesData } from '@/modules/roles/types';
import { useTenantActive } from '@/modules/tenant/hooks/use-get-tenant';
import { Alert, Badge, Button, Select, Tooltip } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { Key, useEffect, useMemo, useState } from 'react';
import { useAssignableRoles, useUserRole } from '../../hooks/use-get-user';
import { useUpdateUserRole } from '../../hooks/use-update-user';
import { UserData } from '../../types/data';
import {
    checkCanAccessTenantAll,
    checkIsSystemAdmin,
    checkIsTenantOwnerOrAdmin,
} from '../../utils/role';

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
    const { isSystemTenant } = useAuth();
    const { data: tenantActive } = useTenantActive();
    const tenantId = tenantActive?.items?.[0]?.id || '';

    const [selectedTenantId, setSelectedTenantId] = useState<
        string | undefined
    >(undefined);

    const activeTenantId = isSystemTenant
        ? selectedTenantId
        : tenantActive?.items?.[0]?.id || '';

    const isSystemAdmin = checkIsSystemAdmin(dataEdit.type);
    const tenantUserType = dataEdit.tenantUser?.find(
        (tu) => tu.tenant.id === activeTenantId
    )?.type as any;
    const isTenantOwnerOrAdmin = checkIsTenantOwnerOrAdmin(tenantUserType);
    const canAccessTenantAll = checkCanAccessTenantAll(
        dataEdit.type,
        tenantUserType
    );

    const { data: assignableRoles } = useAssignableRoles(
        isSystemTenant ? selectedTenantId : undefined
    );

    const { updateUserRole, isPending } = useUpdateUserRole();

    const { data } = useUserRole(
        userId,
        isSystemTenant ? selectedTenantId : undefined
    );

    const assignableRoleIds = useMemo(
        () => assignableRoles.map((item) => item.id),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(assignableRoles.map((item) => item.id))]
    );

    const userRoleIds = useMemo(
        () => data.map((item) => item.id),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(data.map((item) => item.id))]
    );

    useEffect(() => {
        if (canAccessTenantAll) {
            setSelectedKeys(assignableRoleIds);
        } else {
            setSelectedKeys(userRoleIds);
        }
    }, [userRoleIds, canAccessTenantAll, assignableRoleIds]);

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
            userId,
            payload: {
                roleIds: selectedKeys as string[],
                ...(isSystemTenant && { tenantId: selectedTenantId }),
            },
        });
    };

    const isTableDisabled =
        (isSystemTenant && !selectedTenantId) || canAccessTenantAll;

    return (
        <div className="flex flex-col gap-4">
            {isSystemTenant && (
                <div className="flex flex-col gap-2 rounded-lg border bg-gray-50/50 p-4">
                    <span className="text-sm font-medium">
                        {messages('tenant.selectTitle', {
                            defaultMessage: 'Select Workspace',
                        })}
                    </span>
                    <Select
                        placeholder={messages('tenant.selectTitle', {
                            defaultMessage: 'Select Workspace',
                        })}
                        allowClear
                        value={selectedTenantId}
                        onChange={setSelectedTenantId}
                        options={dataEdit.tenantUser?.map((tu) => ({
                            label: tu.tenant.name,
                            value: tu.tenant.id,
                        }))}
                        className="w-full"
                    />
                    {dataEdit.tenantUser?.length === 0 && (
                        <Alert
                            type="info"
                            showIcon
                            className="mt-2"
                            message={messages(
                                'user.grantPermission.noTenants',
                                {
                                    defaultMessage:
                                        'This user is not assigned to any tenant.',
                                }
                            )}
                        />
                    )}
                    {(dataEdit.tenantUser?.length ?? 0) > 0 &&
                        !selectedTenantId && (
                            <Alert
                                type="warning"
                                showIcon
                                className="mt-2"
                                message={messages(
                                    'user.grantPermission.selectWorkspaceHint',
                                    {
                                        defaultMessage:
                                            "Please select a workspace to view or manage this user's roles and permissions.",
                                    }
                                )}
                            />
                        )}
                </div>
            )}
            {!isSystemTenant && isSystemAdmin && (
                <Alert
                    type="success"
                    showIcon
                    message={messages('user.grantPermission.systemAdminAlert', {
                        defaultMessage:
                            'This user is a System Admin and automatically inherits all active capabilities.',
                    })}
                />
            )}
            {!isSystemTenant && isTenantOwnerOrAdmin && (
                <Alert
                    type="success"
                    showIcon
                    message={messages('user.grantPermission.tenantOwnerAlert', {
                        defaultMessage:
                            'This user is a Tenant Owner/Admin and automatically inherits all active capabilities.',
                    })}
                />
            )}

            <Tooltip
                title={
                    isTableDisabled
                        ? messages('user.grantPermission.disabledTooltip', {
                              defaultMessage:
                                  'Role assignment is disabled in this context.',
                          })
                        : ''
                }
            >
                <AppTable
                    className="rounded-lg border"
                    scroll={{
                        x: 0,
                        y: 'calc(100vh - 350px)',
                    }}
                    columns={column}
                    expandable={{
                        expandedRowRender: (record) => (
                            <NestedPermissionTable
                                dataSource={record.rolePermissions}
                            />
                        ),
                    }}
                    dataSource={assignableRoles as any}
                    rowSelection={{
                        selectedRowKeys: selectedKeys,
                        onChange: (value) => setSelectedKeys(value),
                        getCheckboxProps: () => ({
                            disabled: isTableDisabled,
                        }),
                    }}
                />
            </Tooltip>

            {!isTableDisabled && (
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
