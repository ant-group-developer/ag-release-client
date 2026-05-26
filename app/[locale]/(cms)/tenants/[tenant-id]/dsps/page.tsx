'use client';

import SubmitButton from '@/components/ui/button/submit-button';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppProTable from '@/components/ui/table/pro-table';
import { FALLBACK_IMAGE } from '@/constants/common';
import { useActive } from '@/hooks/use-active';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useGetTenantDspAgreements } from '@/modules/tenant/hooks/use-get-tenant';
import { useUpdateTenantDspAgreement } from '@/modules/tenant/hooks/use-update-tenant';
import { TenantDspAgreementData } from '@/modules/tenant/types/data';
import { ProColumns } from '@ant-design/pro-components';
import { Switch, theme, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';

function TenantDsps() {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { active, isActive: isSaving, deActive } = useActive();
    const { isAdmin } = useAuth();

    const value = useParams();
    const tenantId = value['tenant-id'] as string;

    const { dataTenantDspAgreement, isLoading: isLoadingDsps } =
        useGetTenantDspAgreements(tenantId);

    const { updateTenantDspAgreement } = useUpdateTenantDspAgreement();

    const [pendingChanges, setPendingChanges] = useState<
        Record<string, boolean>
    >({});

    const hasChanges = Object.keys(pendingChanges).length > 0;

    const getRowId = (record: any) =>
        record.dspId || record.dsp?.id || record.id;

    const onToggleActive = (dspId: string, checked: boolean) => {
        setPendingChanges((prev) => {
            const originalState = dataTenantDspAgreement.find(
                (d) => getRowId(d) === dspId
            )?.isActive;
            const next = { ...prev };
            if (checked === originalState) {
                delete next[dspId];
            } else {
                next[dspId] = checked;
            }
            return next;
        });
    };

    const onSave = () => {
        active();
        const items = Object.entries(pendingChanges).map(
            ([dspId, isActive]) => ({
                dspId,
                isActive,
            })
        );

        updateTenantDspAgreement({
            tenantId,
            payload: { items },
            onSuccess: () => {
                deActive();
                setPendingChanges({});
            },
            onError: () => {
                deActive();
            },
        });
    };

    const columns: ProColumns<TenantDspAgreementData>[] = [
        {
            title: messages('dsp.name') || 'DPS',
            key: 'name',
            dataIndex: 'dspName',
            ellipsis: true,
            align: 'left',
            width: 200,
            className: '!px-4',
            render: (_, record) => (
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <ImageFallback
                            fallbackSrc={FALLBACK_IMAGE}
                            src={record?.dsp?.picture ?? FALLBACK_IMAGE}
                            alt="dsp"
                            width={40}
                            height={40}
                            className="aspect-square rounded-lg object-cover"
                        />
                    </div>
                    <span title={record?.dsp?.name} className="truncate">
                        {record?.dsp?.name}
                    </span>
                </div>
            ),
        },
        {
            title: messages('roles.isActive') || 'Active',
            key: 'isActive',
            align: 'center',
            width: 100,
            render: (_, record) => {
                const rowId = getRowId(record);
                const isChecked = pendingChanges[rowId] ?? record.isActive;
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Switch
                            checked={isChecked}
                            disabled={!isAdmin}
                            onChange={(val) => onToggleActive(rowId, val)}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <div
                className="mb-4 flex items-center justify-between rounded-lg p-4"
                style={{ background: token.colorBgContainer }}
            >
                <Typography.Title level={5} style={{ margin: 0 }}>
                    {'DSPs'}
                </Typography.Title>
                {isAdmin && (
                    <SubmitButton
                        onClick={onSave}
                        loading={isSaving}
                        disabled={!hasChanges}
                    />
                )}
            </div>

            <AppProTable
                dataSource={dataTenantDspAgreement}
                columns={columns}
                rowKey={getRowId}
                loading={isLoadingDsps}
                pagination={false}
                search={false}
                toolBarRender={false}
                className="rounded-t-lg"
                style={{ backgroundColor: token.colorBgContainer }}
            />
        </div>
    );
}

export default TenantDsps;
