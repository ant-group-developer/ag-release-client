'use client';

import TenantSwitch from '@/modules/tenant/components/tenant-switch';
import { Drawer, DrawerProps, Layout, SiderProps } from 'antd';
import { useResponsive } from 'antd-style';
import { Scrollbars } from 'react-custom-scrollbars';
import SidebarMenu from './sidebar-menu';

type Props = {
    drawerProps?: DrawerProps;
    toggleCollapsed?: () => void;
    toggleSecondMenu?: () => void;
} & SiderProps;

const { Sider } = Layout;

function Sidebar({
    collapsed,
    drawerProps,
    toggleCollapsed,
    toggleSecondMenu,
    ...props
}: Props) {
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
                        <SidebarMenu
                            toggleCollapsed={toggleCollapsed}
                            toggleSecondMenu={toggleSecondMenu}
                        />
                    </Scrollbars>
                </div>
            </Sider>
        );
    }

    return (
        <Drawer
            width={330}
            open={collapsed}
            placement="left"
            {...drawerProps}
            title={<TenantSwitch />}
        >
            <SidebarMenu mode="inline" toggleSecondMenu={toggleSecondMenu} />
        </Drawer>
    );
}

export default Sidebar;
