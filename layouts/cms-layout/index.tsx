'use client';

import AppLoader from '@/components/app-loader';
import { LOCAL_STORAGE_KEY } from '@/enums/common';
import { useActive } from '@/hooks/use-active';
import usePermissionStore from '@/hooks/use-permission-store';
import Forbidden from '@/modules/auth/components/forbidden';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useCheckPermission } from '@/modules/auth/hooks/use-permission';
import AudioPlayer from '@/modules/releases/components/release-detail/release-tracks/audio-player';
import { Layout } from 'antd';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import Content from './content';
import Header from './header';
import Sidebar from './sidebar';
import SecondSidebar from './sidebar/second-side-bar';

type Props = {
    children: ReactNode;
};

export default function CMSLayout({ children }: Props) {
    // const router = useRouter();

    const { isActive, toggleActive, changeActive } = useActive(
        typeof window === 'undefined'
            ? false
            : localStorage.getItem(LOCAL_STORAGE_KEY.OPEN_SIDE_BAR) === 'true'
    );

    const {
        isActive: isActiveSecondMenu,
        toggleActive: toggleActiveSecondMenu,
        changeActive: changeActiveSecondMenu,
    } = useActive(true);

    const { permission, isLoading } = useAuth();
    const { checkCanAccessCurrentRoute } = useCheckPermission();
    const canAccessCurrentRoute = checkCanAccessCurrentRoute();

    const { data: sessionData } = useSession();

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
        if (canAccessCurrentRoute) {
            return children;
        }

        return <Forbidden className="min-h-fit py-24" />;
    };

    return (
        // <SocketProvider accessToken={accessToken}>
        <div className="mx-auto max-w-[150rem] overflow-x-hidden border-x !border-r-0 border-l-0">
            <Layout>
                <Header
                    collapsed={isActive}
                    toggleCollapsed={() => {
                        toggleActive();
                        // toggleActiveSecondMenu();
                    }}
                />
                <Layout>
                    <Sidebar
                        collapsed={isActive}
                        onBreakpoint={changeActive}
                        trigger={null}
                        drawerProps={{
                            onClose: toggleActive,
                        }}
                        toggleCollapsed={toggleActive}
                        toggleSecondMenu={toggleActiveSecondMenu}
                        setCollapsedSecondMenu={changeActiveSecondMenu}
                    />

                    <SecondSidebar
                        collapsed={isActiveSecondMenu}
                        // onBreakpoint={changeActiveSecondMenu}
                        trigger={null}
                        drawerProps={{
                            onClose: toggleActiveSecondMenu,
                            zIndex: 1001,
                        }}
                        toggleCollapsed={toggleActiveSecondMenu}
                    />

                    <Layout>
                        <div
                        // id='layout-scroll'
                        // className="h-[calc(100vh-4rem)] overflow-y-auto"
                        >
                            <Content>{getChildren()}</Content>
                            <AppLoader
                                className="bg-white"
                                loading={isLoading || !!sessionData?.error}
                            />
                            <AudioPlayer />
                        </div>
                    </Layout>
                </Layout>
            </Layout>
        </div>
        // </SocketProvider>
    );
}
