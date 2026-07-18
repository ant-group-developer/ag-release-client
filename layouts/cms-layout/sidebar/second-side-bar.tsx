'use client';

import { SIZE_ICON } from '@/constants/common';
import { useSideBarMenuItems } from '@/hooks/use-sidebar-menu-items';
import type { DrawerProps, SiderProps } from 'antd';
import { Button, Drawer, Layout, Menu, theme, Typography } from 'antd';
import { useResponsive } from 'antd-style';
import { MenuItemGroupType, MenuItemType } from 'antd/es/menu/interface';
import { ChevronLeft } from 'lucide-react';
import { Scrollbars } from 'react-custom-scrollbars';
import { ROUTES_ID } from '../routes';

type Props = {
    drawerProps?: DrawerProps;
    toggleCollapsed?: () => void;
} & SiderProps;

const { Sider } = Layout;

function SecondSidebar({
    collapsed,
    drawerProps,
    toggleCollapsed,
    ...props
}: Props) {
    const responsive = useResponsive();

    const { items, bestActiveLink } = useSideBarMenuItems();

    const { token } = theme.useToken();

    const systemGroup = items?.find((i) => i?.key === ROUTES_ID.SYSTEM);

    const generalItem = systemGroup?.children?.find(
        (item): item is MenuItemGroupType<MenuItemType> =>
            !!item && item.key === ROUTES_ID.GENERAL
    );
    const generalChildren = generalItem?.children ?? [];

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
                <div className="h-[calc(100vh-4rem)]">
                    {/* @ts-ignore */}
                    <Scrollbars autoHide>
                        <div className="flex items-center justify-between border-b p-2 dark:border-zinc-800">
                            <Typography
                                style={{
                                    color: token?.colorTextDescription,
                                }}
                            >
                                {!collapsed && generalItem?.label}
                            </Typography>
                            <Button
                                onClick={() => toggleCollapsed?.()}
                                type="text"
                                icon={
                                    <div>
                                        <ChevronLeft
                                            size={SIZE_ICON}
                                            style={{
                                                color: token?.colorTextDescription,
                                            }}
                                        />
                                    </div>
                                }
                            />
                        </div>
                        <Menu
                            mode="inline"
                            items={generalChildren}
                            selectedKeys={
                                bestActiveLink ? [bestActiveLink.href] : []
                            }
                        />
                    </Scrollbars>
                </div>
            </Sider>
        );
    }

    return (
        <Drawer
            width={330}
            open={!collapsed}
            placement="left"
            {...drawerProps}
            // title={<TenantSwitch />}
        >
            <Menu
                mode="inline"
                items={generalChildren}
                selectedKeys={bestActiveLink ? [bestActiveLink.href] : []}
            />
        </Drawer>
    );
}

export default SecondSidebar;
