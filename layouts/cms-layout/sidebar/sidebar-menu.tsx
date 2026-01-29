import { cn } from '@/helpers/tailwind';
import { useSideBarMenuItems } from '@/hooks/use-sidebar-menu-items';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

function SidebarMenu(props: MenuProps) {
    const { items, openKeys, bestActiveLink } = useSideBarMenuItems();
    console.log("🚀 ~ SidebarMenu ~ openKeys:", openKeys)
    return (
        <Menu
            defaultOpenKeys={openKeys}
            // triggerSubMenuAction="click"
            {...props}
            className={cn('!border-none', props.className)}
            items={items}
            selectedKeys={bestActiveLink ? [bestActiveLink.href] : []}
        />
    );
}

export default SidebarMenu;
