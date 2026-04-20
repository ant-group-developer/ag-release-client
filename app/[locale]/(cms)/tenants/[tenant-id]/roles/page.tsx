'use client';

import SubmitButton from '@/components/ui/button/submit-button';
import CopyText from '@/components/ui/copy-text/copy-text';
import AppProTable from '@/components/ui/table/pro-table';
import { useActive } from '@/hooks/use-active';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useGetListRoles } from '@/modules/roles/hooks/use-get-list-roles';
import { RolesData } from '@/modules/roles/types';
import { useTenantRoles } from '@/modules/tenant/hooks/use-get-tenant-roles';
import { useUpdateTenantRoles } from '@/modules/tenant/hooks/use-update-tenant-roles';
import { TenantRoleData } from '@/modules/tenant/types/data';
import { ProColumns } from '@ant-design/pro-components';
import { Badge, Switch, theme, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface RoleToggleState {
    roleId: string;
    isActive: boolean;
}

function TenantRoles() {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { active, isActive, deActive } = useActive();
    const { isAdmin } = useAuth();

    const value = useParams();
    const tenantId = value['tenant-id'] as string;

    const { rolesData, isLoading: isLoadingRoles } = useGetListRoles({
        page: 1,
        pageSize: 100,
    });

    const { dataTenantRoles, isLoading: isLoadingTenantRoles } =
        useTenantRoles(tenantId);

    const { updateTenantRoles } = useUpdateTenantRoles();

    const [toggleStates, setToggleStates] = useState<RoleToggleState[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    const allRoles = useMemo(() => {
        return rolesData?.items ?? [];
    }, [rolesData]);

    // Build toggle states from API data
    useEffect(() => {
        if (allRoles.length > 0) {
            const tenantRoleMap = new Map<string, boolean>();
            dataTenantRoles.forEach((tr: TenantRoleData) => {
                tenantRoleMap.set(tr.role.id, tr.isActive);
            });

            const states: RoleToggleState[] = allRoles.map(
                (role: RolesData) => ({
                    roleId: role.id,
                    isActive: tenantRoleMap.has(role.id)
                        ? tenantRoleMap.get(role.id)!
                        : true,
                })
            );

            setToggleStates(states);
            setHasChanges(false);
        }
    }, [allRoles, dataTenantRoles]);

    const onToggle = (roleId: string, checked: boolean) => {
        setToggleStates((prev) =>
            prev.map((s) =>
                s.roleId === roleId ? { ...s, isActive: checked } : s
            )
        );
        setHasChanges(true);
    };

    const onSave = () => {
        active();
        updateTenantRoles({
            tenantId,
            payload: {
                data: toggleStates,
            },
            onSuccess: () => {
                deActive();
                setHasChanges(false);
            },
            onError: deActive,
        });
    };

    const getChecked = (roleId: string) => {
        return toggleStates.find((s) => s.roleId === roleId)?.isActive ?? true;
    };

    const columns: ProColumns<RolesData>[] = [
        {
            title: messages('roles.name'),
            key: 'name',
            dataIndex: 'name',
            align: 'left',
            width: 150,
            ellipsis: true,
            render: (_, record) => (
                <CopyText
                    text={record?.name}
                    className="flex items-center gap-2"
                >
                    <Badge color={record.color} />
                    <span className="flex-1 truncate">{record?.name}</span>
                </CopyText>
            ),
        },
        {
            title: messages('common.code'),
            key: 'code',
            dataIndex: 'code',
            align: 'left',
            width: 150,
            ellipsis: true,
            render: (_, record) => <CopyText text={record?.code ?? ''} />,
        },
        {
            title: messages('common.note'),
            key: 'note',
            dataIndex: 'note',
            align: 'left',
            width: 300,
            ellipsis: true,
            render: (_, record) => (
                <CopyText text={record?.note ?? ''}>
                    <span className="line-clamp-3 truncate whitespace-pre-line">
                        {record?.note}
                    </span>
                </CopyText>
            ),
        },
        {
            title: messages('roles.isActive'),
            key: 'isActive',
            dataIndex: 'id',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch
                        checked={getChecked(record.id)}
                        disabled={!isAdmin}
                        onChange={(val) => onToggle(record.id, val)}
                    />
                </div>
            ),
        },
    ];

    const isLoadingPage = isLoadingRoles || isLoadingTenantRoles;

    return (
        <div>
            <div
                className="mb-4 flex items-center justify-between rounded-t-lg p-4"
                style={{ background: token.colorBgContainer }}
            >
                <Typography.Title level={5} style={{ margin: 0 }}>
                    {messages('roles.label')}
                </Typography.Title>
                {isAdmin && (
                    <SubmitButton
                        onClick={onSave}
                        loading={isActive}
                        disabled={!hasChanges}
                    />
                )}
            </div>

            <AppProTable
                dataSource={allRoles}
                columns={columns}
                rowKey="id"
                loading={isLoadingPage}
                pagination={false}
                search={false}
                toolBarRender={false}
                className="rounded-t-lg"
                style={{ backgroundColor: token.colorBgContainer }}
            />
        </div>
    );
}

export default TenantRoles;
