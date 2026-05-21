'use client';

import SubmitButton from '@/components/ui/button/submit-button';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppProTable from '@/components/ui/table/pro-table';
import { FALLBACK_IMAGE } from '@/constants/common';
import { useActive } from '@/hooks/use-active';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useGetListDspSimple } from '@/modules/dsp/hooks/use-get-list-simple-dsp';
import { DspData } from '@/modules/dsp/types';
import { useTenantDsp } from '@/modules/tenant/hooks/use-get-tenant';
import { useUpdateTenantDsp } from '@/modules/tenant/hooks/use-update-tenant';
import { TenantDspData } from '@/modules/tenant/types/data';
import { ProColumns } from '@ant-design/pro-components';
import { Switch, theme, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface DspToggleState {
    dspId: string;
    isActive: boolean;
    isDefault: boolean;
}

function TenantDsps() {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { active, isActive: isSaving, deActive } = useActive();
    const { isAdmin } = useAuth();

    const value = useParams();
    const tenantId = value['tenant-id'] as string;

    const { dspData, isLoading: isLoadingDsps } = useGetListDspSimple();

    const { dataTenantDsp, isLoading: isLoadingTenantDsps } =
        useTenantDsp(tenantId);

    const { updateTenantDsp } = useUpdateTenantDsp();

    const [toggleStates, setToggleStates] = useState<DspToggleState[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    const allDsps = useMemo(() => {
        return dspData ?? [];
    }, [dspData]);

    // Build toggle states from API data
    useEffect(() => {
        if (allDsps.length > 0) {
            const tenantDspMap = new Map<
                string,
                { isActive: boolean; isDefault: boolean }
            >();
            dataTenantDsp.forEach((td: TenantDspData) => {
                tenantDspMap.set(td.dsp.id, {
                    isActive: td.isActive,
                    isDefault: td.isDefault ?? false,
                });
            });

            const states: DspToggleState[] = allDsps.map((dsp: DspData) => ({
                dspId: dsp.id,
                isActive: tenantDspMap.has(dsp.id)
                    ? tenantDspMap.get(dsp.id)!.isActive
                    : false,
                isDefault: tenantDspMap.has(dsp.id)
                    ? tenantDspMap.get(dsp.id)!.isDefault
                    : false,
            }));

            setToggleStates(states);
            setHasChanges(false);
        }
    }, [allDsps, dataTenantDsp]);

    const onToggleActive = (dspId: string, checked: boolean) => {
        setToggleStates((prev) =>
            prev.map((s) =>
                s.dspId === dspId
                    ? {
                          ...s,
                          isActive: checked,
                          isDefault: checked ? s.isDefault : false,
                      }
                    : s
            )
        );
        setHasChanges(true);
    };

    const onToggleDefault = (dspId: string, checked: boolean) => {
        setToggleStates((prev) =>
            prev.map(
                (s) =>
                    s.dspId === dspId
                        ? {
                              ...s,
                              isDefault: checked,
                              isActive: checked ? true : s.isActive,
                          }
                        : { ...s, isDefault: checked ? false : s.isDefault } // Assuming only one can be default
            )
        );
        setHasChanges(true);
    };

    const onSave = () => {
        active();
        return;
        updateTenantDsp({
            payload: {
                tenantId,
                data: toggleStates,
            },
            onSuccess: () => {
                deActive();
                setHasChanges(false);
            },
            onError: deActive,
        });
    };

    const getState = (dspId: string) => {
        return (
            toggleStates.find((s) => s.dspId === dspId) ?? {
                isActive: false,
                isDefault: false,
                dspId,
            }
        );
    };

    const columns: ProColumns<DspData>[] = [
        {
            title: messages('dsp.name') || 'Name',
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            align: 'left',
            width: 200,
            className: '!px-4',
            render: (_, record) => (
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <ImageFallback
                            fallbackSrc={FALLBACK_IMAGE}
                            src={record?.picture ?? FALLBACK_IMAGE}
                            alt="dsp"
                            width={40}
                            height={40}
                            className="aspect-square rounded-lg object-cover"
                        />
                    </div>
                    <span title={record?.name} className="truncate">
                        {record?.name}
                    </span>
                </div>
            ),
        },
        {
            title: messages('common.code') || 'Code',
            key: 'code',
            dataIndex: 'code',
            align: 'left',
            width: 150,
            ellipsis: true,
        },
        {
            title: messages('roles.isActive') || 'Active',
            key: 'isActive',
            dataIndex: 'id',
            align: 'center',
            width: 100,
            render: (_, record) => {
                const state = getState(record.id);
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Switch
                            checked={state.isActive}
                            disabled={!isAdmin}
                            onChange={(val) => onToggleActive(record.id, val)}
                        />
                    </div>
                );
            },
        },
        {
            title: 'Default',
            key: 'isDefault',
            dataIndex: 'id',
            align: 'center',
            width: 100,
            className: '!pr-6',
            render: (_, record) => {
                const state = getState(record.id);
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Switch
                            checked={state.isDefault}
                            disabled={!isAdmin}
                            onChange={(val) => onToggleDefault(record.id, val)}
                        />
                    </div>
                );
            },
        },
    ];

    const isLoadingPage = isLoadingDsps || isLoadingTenantDsps;

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
                dataSource={allDsps}
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

export default TenantDsps;
