'use client';

import { SIZE_ICON_SMALL } from '@/constants/common';
import { APP_ROUTES } from '@/enums/routes';
import { getAvatarPlaceholder } from '@/helpers/common';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import { Link, usePathname } from '@/i18n/routing';
import { tenantQueryKeys } from '@/modules/tenant/constants';
import { TENANT_TABS } from '@/modules/tenant/enums';
import { useTenantDetail } from '@/modules/tenant/hooks/use-get-tenant';
import {
    getTenantDetailRoute,
    getTenantOwnerEmail,
} from '@/modules/tenant/utils';
import { Avatar, ConfigProvider, Spin, Tabs, TabsProps, theme } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { PropsWithChildren } from 'react';

function TenantDetailLayout({ children }: PropsWithChildren) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const pathname = usePathname();
    const tabKey = pathname.split('/').pop();

    const value = useParams();
    const tenantId = value['tenant-id'] as string;
    const { dataTenant } = useTenantDetail(tenantId);

    const { isLoading } = useLoadingStatus({
        queryKeys: [tenantQueryKeys.detail(tenantId)],
        mutationKeys: [tenantQueryKeys.all],
    });

    const items: TabsProps['items'] = [
        {
            key: TENANT_TABS.INFO,
            label: (
                <Link
                    href={getTenantDetailRoute(tenantId, TENANT_TABS.INFO)}
                    className=""
                >
                    {messages('common.coreInfo')}
                </Link>
            ),
        },
        {
            key: TENANT_TABS.USER,
            label: (
                <Link href={getTenantDetailRoute(tenantId, TENANT_TABS.USER)}>
                    {messages('user.label')}
                </Link>
            ),
        },
        {
            key: TENANT_TABS.RELEASE,
            label: (
                <Link
                    href={getTenantDetailRoute(tenantId, TENANT_TABS.RELEASE)}
                >
                    {messages('releases.label')}
                </Link>
            ),
        },
        {
            key: TENANT_TABS.TRACK,
            label: (
                <Link href={getTenantDetailRoute(tenantId, TENANT_TABS.TRACK)}>
                    {messages('tracks.label')}
                </Link>
            ),
        },
        {
            key: TENANT_TABS.INTEGRATION,
            label: (
                <Link
                    href={getTenantDetailRoute(
                        tenantId,
                        TENANT_TABS.INTEGRATION
                    )}
                >
                    {messages('integration.label')}
                </Link>
            ),
        },
    ];

    return (
        <Spin spinning={isLoading}>
            <div className="mx-auto max-w-screen-2xl px-2">
                <div
                    className="sticky top-0 z-10"
                    style={{
                        background: token.colorBgContainer,
                    }}
                >
                    <Link
                        href={APP_ROUTES.TENANT}
                        className="flex w-fit items-center gap-1 py-2 hover:underline"
                    >
                        <ArrowLeft size={SIZE_ICON_SMALL} />
                        {messages('tenant.back')}
                    </Link>
                    <div className="mb-5 mt-3 flex gap-5">
                        <Avatar
                            src={dataTenant.logo || dataTenant.icon}
                            size={64}
                            shape="square"
                        >
                            {getAvatarPlaceholder(dataTenant.name)}
                        </Avatar>
                        <div className="h-full">
                            <h1 className="text-3xl font-bold">
                                {dataTenant.name}
                            </h1>
                            <p style={{ color: token.colorTextSecondary }}>
                                {messages('tenant.owner')}:{' '}
                                {getTenantOwnerEmail(dataTenant.tenantUser)}
                            </p>
                        </div>
                    </div>

                    <ConfigProvider
                        theme={{
                            components: {
                                Tabs: {
                                    horizontalMargin: '0 0 0 0',
                                },
                            },
                        }}
                    >
                        <Tabs items={items} activeKey={tabKey} />
                    </ConfigProvider>
                </div>
                {children}
            </div>
        </Spin>
    );
}

export default TenantDetailLayout;
