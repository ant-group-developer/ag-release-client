import { cn } from '@/helpers/tailwind';
import { useSideBarMenuItems } from '@/hooks/use-sidebar-menu-items';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { ROUTES_ID } from '../routes';

type MenuItem = Required<MenuProps>['items'][number];

type Props = MenuProps & {
    toggleCollapsed?: () => void;
    toggleSecondMenu?: () => void;
};

function SidebarMenu({ toggleCollapsed, toggleSecondMenu, ...props }: Props) {
    const { items, openKeys, bestActiveLink } = useSideBarMenuItems();

    function pickLevel1AndChildren(items: MenuItem[] = []): MenuItem[] {
        return items.map((item) => {
            if (!item || typeof item !== 'object') return item;

            // Không có children thì giữ nguyên
            // @ts-ignore
            if (!item.children) return item;

            // Chỉ giữ children cấp 2, bỏ sâu hơn
            return {
                ...(item as any),
                children: (item as any).children.map((child: MenuItem) => {
                    if (!child || typeof child !== 'object') return child;

                    // bỏ children của cấp 2
                    const { children: _removed, ...rest } = child as any;
                    return rest as MenuItem;
                }),
            };
        });
    }

    const items2Level = pickLevel1AndChildren(items);

    return (
        <Menu
            onClick={(e) => {
                if (e.key === ROUTES_ID.GENERAL) {
                    toggleSecondMenu?.();
                }
            }}
            defaultOpenKeys={openKeys}
            // triggerSubMenuAction="click"
            {...props}
            className={cn('!border-none', props.className)}
            items={items2Level}
            selectedKeys={bestActiveLink ? [bestActiveLink.href] : []}
        />
    );
}

export default SidebarMenu;
