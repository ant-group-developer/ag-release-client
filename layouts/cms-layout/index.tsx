'use client';

import AppLoader from '@/components/app-loader';
import { LOCAL_STORAGE_KEY } from '@/enums/common';
import { useActive } from '@/hooks/use-active';
import usePermissionStore from '@/hooks/use-permission-store';
import { useRouter } from '@/i18n/routing';
import Forbidden from '@/modules/auth/components/forbidden';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useCheckPermission } from '@/modules/auth/hooks/use-permission';
import AudioPlayer from '@/modules/releases/components/release-detail/release-tracks/audio-player';
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

    const { isLoading, permission } = useAuth();
    const { checkCanAccessCurrentRoute } = useCheckPermission();

    const setPermission = usePermissionStore((state) => state.setPermission);

    useEffect(() => {
        setPermission(permission);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(permission)]);

    useEffect(() => {
        localStorage.setItem(
            LOCAL_STORAGE_KEY.OPEN_SIDE_BAR,
            JSON.stringify(isActive)
        );
    }, [isActive]);

    const getChildren = () => {
        if (isLoading) {
            return <AppLoader className="bg-white" />;
        }

        if (checkCanAccessCurrentRoute()) {
            return children;
        }

        return <Forbidden className="min-h-fit py-24" />;
    };

    return (
        <SocketProvider accessToken={accessToken}>
            <div className="mx-auto max-w-[150rem] overflow-x-hidden border-x border-l-0">
                <Layout>
                    <Header
                        collapsed={isActive}
                        toggleCollapsed={toggleActive}
                    />
                    <Layout>
                        <Sidebar
                            collapsed={isActive}
                            onBreakpoint={changeActive}
                            trigger={null}
                            drawerProps={{
                                onClose: toggleActive,
                            }}
                        />
                        <Layout>
                            <div className="relative h-[calc(100vh-4rem)] overflow-y-hidden">
                                <Content>{getChildren()}</Content>
                                <AudioPlayer />
                            </div>
                        </Layout>
                    </Layout>
                </Layout>
            </div>
        </SocketProvider>
    );
}
