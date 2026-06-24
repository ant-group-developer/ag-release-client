import { cn } from '@/helpers/tailwind';
import { useSideBarMenuItems } from '@/hooks/use-sidebar-menu-items';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { RightOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { ConfigProvider, Menu } from 'antd';
import { ROUTES_ID } from '../routes';
type MenuItem = Required<MenuProps>['items'][number];

type Props = MenuProps & {
    toggleCollapsed?: () => void;
    toggleSecondMenu?: () => void;
    setCollapsedSecondMenu?: (value: boolean) => void;
};

function SidebarMenu({
    toggleCollapsed,
    toggleSecondMenu,
    setCollapsedSecondMenu,
    ...props
}: Props) {
    const { items, openKeys, bestActiveLink } = useSideBarMenuItems();
    const { isDark } = useThemeMode();

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

                    const isGeneral = (child as any).key === ROUTES_ID.GENERAL;
                    // bỏ children của cấp 2
                    const { children: _removed, ...rest } = child as any;

                    //  custom label cho GENERAL ở level 2
                    if (isGeneral) {
                        return {
                            ...rest,
                            label: (
                                <span className="">
                                    <span className="mr-24">
                                        {(child as any).label}
                                    </span>

                                    <RightOutlined style={{ fontSize: 12 }} />
                                </span>
                            ),
                        } as MenuItem;
                    }

                    return rest as MenuItem;
                }),
            };
        });
    }

    const items2Level = pickLevel1AndChildren(items);

    return (
        <ConfigProvider
            theme={{
                components: {
                    Menu: {
                        itemSelectedColor: isDark ? '#fff' : '#1890ff',
                    },
                },
            }}
        >
            <Menu
                onClick={(e) => {
                    if (e.key === ROUTES_ID.GENERAL) {
                        toggleSecondMenu?.();
                    } else {
                        setCollapsedSecondMenu?.(true);
                    }
                }}
                defaultOpenKeys={openKeys}
                // triggerSubMenuAction="click"
                {...props}
                className={cn('!border-none', props.className)}
                items={items2Level}
                selectedKeys={bestActiveLink ? [bestActiveLink.href] : []}
            />
        </ConfigProvider>
    );
}

export default SidebarMenu;
