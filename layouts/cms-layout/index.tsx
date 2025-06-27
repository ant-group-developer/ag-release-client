'use client';

import AppLoader from '@/components/app-loader';
import { LOCAL_STORAGE_KEY } from '@/enums/common';
import { useActive } from '@/hooks/use-active';
import usePermissionStore from '@/hooks/use-permission';
import { useRouter } from '@/i18n/routing';
import Forbidden from '@/modules/auth/components/forbidden';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { usePermission } from '@/modules/auth/hooks/use-permission';
import SocketProvider from '@/providers/socket';
import { Layout } from 'antd';
import { ReactNode, useEffect } from 'react';
import Content from './content';
import Header from './header';
import Sidebar from './sidebar';

type Props = {
    children: ReactNode;
    accessToken?: string;
};

export default function CMSLayout({ children, accessToken }: Props) {
    const router = useRouter();

    const { isActive, toggleActive, changeActive } = useActive(
        typeof window === 'undefined'
            ? false
            : localStorage.getItem(LOCAL_STORAGE_KEY.OPEN_SIDE_BAR) === 'true'
    );

    const { isAdmin, isLoading, permission } = useAuth();
    const { getPermission } = usePermission();
    const { canAccessCurrentRoute, routeCanAccess } = getPermission();

    const setPermission = usePermissionStore((state) => state.setPermission);

    // useEffect(() => {
    //     function verify() {
    //         if (isLoading) return;

    //         if (isAdmin) return;

    //         if (canAccessCurrentRoute) return;

    //         if (routeCanAccess) {
    //             return router.push(routeCanAccess.href);
    //         }

    //         return router.push(APP_ROUTES.FORBIDDEN);
    //     }

    //     verify();
    // }, [isLoading, isAdmin, canAccessCurrentRoute, routeCanAccess, router]);

    useEffect(() => {
        setPermission(permission, isAdmin);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(permission), isAdmin]);

    useEffect(() => {
        localStorage.setItem(
            LOCAL_STORAGE_KEY.OPEN_SIDE_BAR,
            JSON.stringify(isActive)
        );
    }, [isActive]);

    const getChildren = () => {
        // if (isLoading) {
        //     return <AppLoader className="bg-white" />;
        // }

        // if (canAccessCurrentRoute) {
        return (
            <Layout>
                <Header collapsed={isActive} toggleCollapsed={toggleActive} />
                <Layout>
                    <Sidebar
                        collapsed={isActive}
                        onBreakpoint={changeActive}
                        trigger={null}
                    />
                    <Layout>
                        <div className="relative h-[calc(100vh-4rem)] overflow-y-hidden">
                            <Content>{children}</Content>
                        </div>
                    </Layout>
                </Layout>
            </Layout>
        );
        // }

        if (routeCanAccess) {
            return <AppLoader className="bg-white" />;
        }

        return <Forbidden />;
    };

    return (
        <SocketProvider accessToken={accessToken}>
            <div className="mx-auto max-w-[150rem] overflow-x-hidden border-x border-l-0">
                {getChildren()}
            </div>
        </SocketProvider>
    );
}
