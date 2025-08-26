'use client';

import TenantSwitch from '@/modules/tenant/components/tenant-switch';
import { Drawer, DrawerProps, Layout, SiderProps } from 'antd';
import { useResponsive } from 'antd-style';
import { Scrollbars } from 'react-custom-scrollbars';
import SidebarMenu from './sidebar-menu';

type Props = {
    drawerProps?: DrawerProps;
} & SiderProps;

const { Sider } = Layout;

function Sidebar({ collapsed, drawerProps, ...props }: Props) {
    const responsive = useResponsive();

    if (responsive.desktop) {
        return (
            <Sider
                className="border-r dark:border-zinc-800"
                collapsible
                width={255}
                collapsedWidth={50}
                theme="light"
                collapsed={collapsed}
                trigger={null}
                {...props}
            >
                <div className="h-[calc(100vh-5rem)]">
                    {/* @ts-ignore */}
                    <Scrollbars autoHide>
                        <SidebarMenu />
                    </Scrollbars>
                </div>
            </Sider>
        );
    }

    return (
        <Drawer
            open={collapsed}
            placement="left"
            {...drawerProps}
            title={<TenantSwitch />}
            closeIcon={null}
        >
            <SidebarMenu />
        </Drawer>
    );
}

export default Sidebar;
