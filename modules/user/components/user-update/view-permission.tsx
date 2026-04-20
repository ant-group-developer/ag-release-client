import AppTable from '@/components/ui/table/normal-table';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useTenantActive } from '@/modules/tenant/hooks/use-get-tenant';
import { Alert, Input, Select, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useUserPermission } from '../../hooks/use-get-user';
import { UserData, UserPermissionData } from '../../types/data';
import {
    checkCanAccessTenantAll,
    checkIsSystemAdmin,
    checkIsTenantOwnerOrAdmin,
} from '../../utils/role';

type Props = {
    dataEdit: UserData;
};

function ViewPermission({ dataEdit }: Props) {
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

    const { data, isLoading } = useUserPermission(
        userId,
        isSystemTenant ? selectedTenantId : undefined
    );

    const [search, setSearch] = useState('');

    const filteredData = useMemo(() => {
        if (!search.trim()) return data;
        const keyword = search.toLowerCase();
        return data.filter(
            (item: UserPermissionData) =>
                item.name?.toLowerCase().includes(keyword) ||
                item.code?.toLowerCase().includes(keyword)
        );
    }, [data, search]);

    const columns: ColumnsType<UserPermissionData> = [
        {
            title: messages('permission.label'),
            dataIndex: 'name',
            width: '35%',
            ellipsis: true,
        },
        {
            title: messages('common.code'),
            dataIndex: 'code',
            width: '35%',
            ellipsis: true,
            render: (value) => <Tag className="font-mono text-xs">{value}</Tag>,
        },
        {
            title: messages('common.note'),
            dataIndex: 'note',
            width: '30%',
            ellipsis: true,
            render: (value) => (
                <span className="line-clamp-2 whitespace-pre-line">
                    {value}
                </span>
            ),
        },
    ];

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

            <Input.Search
                placeholder={messages('common.search')}
                allowClear
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
            />

            <AppTable
                className="rounded-lg border"
                columns={columns}
                dataSource={filteredData}
                loading={isLoading}
                scroll={{ x: 0, y: 'calc(100vh - 420px)' }}
                summary={() => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell
                                index={0}
                                colSpan={3}
                                className="text-xs text-gray-400"
                            >
                                {messages('common.total')}: {data.length}{' '}
                                {messages('permission.label').toLowerCase()}
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
        </div>
    );
}

export default ViewPermission;
