import { Skeleton } from '@/components/ui/skeleton';
import { defaultConfig } from '@/constants/env';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useGetSettingPublic } from '@/modules/setting/hooks/use-get-setting-public';
import { CheckCard } from '@ant-design/pro-components';
import { Avatar, Popover, Spin, Tag } from 'antd';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { SYSTEM_TENANT_ID } from '../constants';
import { useTenantActive } from '../hooks/use-get-tenant';
import { TenantData } from '../types/data';
import { getTenantAvatar, getTenantOwnerEmail } from '../utils';
import TenantTag from './tenant-tag';

type Props = {};

function TenantSwitch({}: Props) {
    const messages = useTranslations();
    const { data, isLoading } = useTenantActive();
    const {
        profile: { tenantId },
    } = useAuth();
    const { update } = useSession();
    const { isAdmin } = useAuth();
    const { settingData: dataConfig } = useGetSettingPublic();
    const website = dataConfig;

    const defaultData = {
        name: website?.name || defaultConfig.APP_SHORT_NAME,
        logo: website?.logo || defaultConfig.APP_LOGO,
        icon: website?.logo || defaultConfig.APP_ICON,
    };

    const [loading, setLoading] = useState(false);

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

    if (isLoading) {
        return (
            <div className="flex h-fit items-center gap-2">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-8 w-40" />
            </div>
        );
    }

    return (
        <div>
            <Popover
                placement="bottomRight"
                trigger={['click']}
                content={
                    <Spin spinning={loading}>
                        <div className="max-h-[30rem] overflow-auto px-1">
                            <CheckCard.Group
                                style={{
                                    display: 'grid',
                                }}
                                onChange={(id) => {
                                    if (typeof id === 'string') {
                                        onSwitchTenant(id);
                                    }
                                }}
                                value={value}
                            >
                                {isAdmin && (
                                    <CheckCard
                                        key={SYSTEM_TENANT_ID}
                                        value={SYSTEM_TENANT_ID}
                                        avatar={getTenantAvatar({
                                            logo: website?.logo,
                                            icon: website?.logo,
                                            name: website?.name,
                                        })}
                                        title={
                                            <p className="flex items-center gap-2">
                                                <span className="font-semibold">
                                                    {website?.name}
                                                </span>
                                                <Tag color="red">
                                                    {messages('system.label')}
                                                </Tag>
                                            </p>
                                        }
                                        style={{
                                            marginInlineEnd: 0,
                                            marginBlockEnd: 8,
                                        }}
                                    />
                                )}
                                {data.items.map((item) => (
                                    <CheckCard
                                        key={item.id}
                                        value={item.id}
                                        avatar={getTenantAvatar({
                                            logo: item.logo,
                                            icon: item.icon,
                                            name: item.name,
                                        })}
                                        title={
                                            <p className="flex items-center gap-2">
                                                <span className="font-semibold">
                                                    {item.name}
                                                </span>
                                                <TenantTag type={item.type} />
                                            </p>
                                        }
                                        description={
                                            <div className="space-y-0.5 truncate text-xs">
                                                <p>
                                                    {messages('tenant.owner')}:{' '}
                                                    {getTenantOwnerEmail(
                                                        item.tenantUser
                                                    )}
                                                </p>
                                                {item.parent && (
                                                    <p>
                                                        {messages(
                                                            'tenant.manager'
                                                        )}
                                                        :{' '}
                                                        <span className="font-semibold">
                                                            {item.parent.name}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        }
                                        style={{
                                            marginInlineEnd: 0,
                                            marginBlockEnd: 8,
                                        }}
                                    />
                                ))}
                            </CheckCard.Group>
                        </div>
                    </Spin>
                }
            >
                <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                    <Avatar
                        src={getTenantAvatar({
                            logo: currentData?.logo,
                            icon: currentData?.icon,
                            name: currentData?.name,
                        })}
                        size={45}
                        shape="square"
                    />
                    {/* <Image
                        src={getTenantAvatar({
                            logo: currentData?.logo,
                            icon: currentData?.icon,
                            name: currentData?.name,
                        })}
                        width={45}
                        height={45}
                        alt={currentData?.name}
                        className="rounded-lg"
                    /> */}
                    <h2 className="flex-1 text-2xl font-bold">
                        {currentData?.name}
                    </h2>
                </div>
            </Popover>
        </div>
    );
}

export default TenantSwitch;
