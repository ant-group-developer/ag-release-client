'use client';

import { useMediaQuery } from '@/hooks/use-media';
import { Layout, SiderProps } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import SidebarMenu from './side-bar-menu';

type Props = {} & SiderProps;

const { Sider } = Layout;

function Sidebar({ collapsed, onBreakpoint, ...props }: Props) {
    const { isSmallDevice } = useMediaQuery();

    return (
        <Sider
            className="border-r dark:border-zinc-800"
            collapsible
            width={255}
            collapsedWidth={isSmallDevice ? 0 : 50}
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

export default Sidebar;
