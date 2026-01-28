import { Skeleton } from '@/components/ui/skeleton';
import AppTable from '@/components/ui/table/normal-table';
import { defaultConfig } from '@/constants/env';
import { removeEmptyChildren } from '@/helpers/array';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useGetSettingPublic } from '@/modules/setting/hooks/use-get-setting-public';
import { Avatar, Modal, Space, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { SYSTEM_TENANT_ID } from '../constants';
import { TENANT_TYPE } from '../enums';
import { useTenantActive } from '../hooks/use-get-tenant';
import { TenantData } from '../types/data';
import { getTenantAvatar, getTenantOwnerEmail } from '../utils';
import TenantTag from './tenant-tag';

type Props = {};

interface TenantTableRecord extends TenantData {
    isSystem?: boolean;
}

function TenantSwitch({}: Props) {
    const messages = useTranslations();
    const { data, isLoading } = useTenantActive();
    console.log(data);
    const {
        profile: { tenantId },
    } = useAuth();
    const { update } = useSession();
    const { isAdmin } = useAuth();
    const { settingData: dataConfig } = useGetSettingPublic();
    const website = dataConfig?.website;

    const defaultData = {
        name: website?.name || defaultConfig.APP_SHORT_NAME,
        logo: website?.logo || defaultConfig.APP_LOGO,
        icon: website?.logo || defaultConfig.APP_ICON,
    };

    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [value, setValue] = useState<TenantData['id']>(tenantId);
    const currentData =
        data.items.find((item) => item.id === value) || defaultData;

    const onSwitchTenant = (tenantId: string) => {
        setLoading(true);
        update({ tenantId })
            .then(() => {
                window.location.reload();
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        setValue(tenantId);
    }, [tenantId]);

    const columns: ColumnsType<TenantTableRecord> = [
        {
            title: messages('tenant.name'),
            dataIndex: 'name',
            key: 'name',
            width: 150,
            render: (name: string, record) => (
                <Space className="flex items-center gap-2">
                    <Avatar
                        src={getTenantAvatar({
                            logo: record.logo,
                            icon: record.icon,
                            name: record.name,
                        })}
                        size={36}
                        shape="square"
                    />
                    <Typography.Text>{name}</Typography.Text>
                </Space>
            ),
        },
        {
            title: messages('tenant.owner'),
            dataIndex: 'ownerEmail',
            key: 'ownerEmail',
            width: 150,
            render: (cell, record) => {
                const ownerEmail = getTenantOwnerEmail(record.tenantUser);
                return ownerEmail;
            },
        },
        {
            title: messages('tenant.type.title'),
            dataIndex: 'type',
            key: 'type',
            width: 80,
            render: (cell, record) =>
                record.isSystem ? (
                    <Tag color="red">{messages('system.label')}</Tag>
                ) : (
                    record.type && <TenantTag type={record.type} />
                ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex h-fit items-center gap-2">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-8 w-40" />
            </div>
        );
    }

    const dataSource: TenantTableRecord[] = [...data.items];

    if (isAdmin) {
        dataSource.unshift({
            id: SYSTEM_TENANT_ID,
            name: website?.name || defaultConfig.APP_SHORT_NAME,
            logo: website?.logo ?? undefined,
            icon: website?.logo ?? undefined,
            title: null,
            type: TENANT_TYPE.WHITE_LABEL,
            parent: null,
            tenantUser: [],
            isSystem: true,
            email: '',
            isActive: false,
            children: [],
            tenantUserCount: 0,
            maxLabels: 0,
        });
    }

    return (
        <div>
            <div
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                onClick={() => setModalOpen(true)}
            >
                <Avatar
                    src={getTenantAvatar({
                        logo: currentData?.logo,
                        icon: currentData?.icon,
                        name: currentData?.name,
                    })}
                    size={45}
                    shape="square"
                />
                <h2 className="flex-1 text-2xl font-bold">
                    {currentData?.name}
                </h2>
            </div>

            <Modal
                title={messages('tenant.selectTitle')}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width={1000}
            >
                <AppTable
                    dataSource={removeEmptyChildren(dataSource)}
                    columns={columns}
                    loading={loading}
                    pagination={false}
                    rowClassName={(record) =>
                        record.id === value ? 'bg-blue-50 dark:bg-blue-950' : ''
                    }
                    onRow={(record) => ({
                        onClick: () => onSwitchTenant(record.id),
                        className: 'cursor-pointer',
                    })}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [value],
                        onChange: (keys) => onSwitchTenant(keys[0] as string),
                    }}
                    scroll={{ y: 500, x: 'max-content' }}
                />
            </Modal>
        </div>
    );
}

export default TenantSwitch;
