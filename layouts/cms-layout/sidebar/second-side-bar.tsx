'use client';

import { SIZE_ICON } from '@/constants/common';
import { useSideBarMenuItems } from '@/hooks/use-sidebar-menu-items';
import TenantSwitch from '@/modules/tenant/components/tenant-switch';
import type { DrawerProps, MenuProps, SiderProps } from 'antd';
import { Button, Drawer, Layout, Menu, Typography } from 'antd';
import { useResponsive } from 'antd-style';
import { ChevronLeft } from 'lucide-react';
import { Scrollbars } from 'react-custom-scrollbars';

type Props = {
    drawerProps?: DrawerProps;
} & SiderProps;

const { Sider } = Layout;

type Item = Required<MenuProps>['items'][number];

// item có children (submenu / group)
const hasChildren = (
    item: Item | null | undefined
): item is Exclude<Item, null | undefined> & { children: Item[] } => {
    return (
        !!item &&
        typeof item === 'object' &&
        'children' in item &&
        Array.isArray((item as any).children)
    );
};

function SecondSidebar({ collapsed, drawerProps, ...props }: Props) {
    const responsive = useResponsive();

    const { items } = useSideBarMenuItems();

    const systemGroup = items.find((i) => i?.key === 'system');

    const generalItem = hasChildren(systemGroup)
        ? systemGroup.children.find((c) => c?.key === 'general')
        : undefined;

    const generalChildren = hasChildren(generalItem)
        ? generalItem.children
        : [];

    if (responsive.desktop) {
        return (
            <Sider
                className="dark:border-zinc-800"
                collapsible
                width={255}
                collapsedWidth={0}
                theme="light"
                collapsed={collapsed}
                trigger={null}
                {...props}
            >
                <div className="h-[calc(100vh-5rem)]">
                    {/* @ts-ignore */}
                    <Scrollbars autoHide>
                        <div className="flex items-center justify-between border-b p-2">
                            <Typography>General</Typography>
                            <Button
                                type="text"
                                icon={
                                    <div>
                                        <ChevronLeft size={SIZE_ICON} />
                                    </div>
                                }
                            />
                        </div>
                        <Menu mode="inline" items={generalChildren} />
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
            <Menu mode="inline" items={generalChildren} />
        </Drawer>
    );
}

export default SecondSidebar;
