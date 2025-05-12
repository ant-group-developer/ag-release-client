import { SIZE_ICON } from '@/constants/common';
import { Link, usePathname } from '@/i18n/routing';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { usePermission } from '@/modules/auth/hooks/use-permission';
import { Menu, MenuProps } from 'antd';
import { useTranslations } from 'next-intl';
import { adminRoutes, AdminRoutesChildType } from '../routes';

type Props = {};

type MenuItem = Required<MenuProps>['items'][number];

function SidebarMenu({}: Props) {
    const pathname = usePathname();
    const messages = useTranslations();
    const { isAdmin } = useAuth();
    const { checkPermission } = usePermission();

    const getChildrenRoutes = (children: AdminRoutesChildType[]) => {
        // return children;
        if (isAdmin) return children;

        const result = children.filter((item) =>
            checkPermission(item.permission)
        );
        return result;
    };

    const items = adminRoutes.map((item) => {
        const parentItem: MenuItem = {
            key: item.id,
            label: <span className="font-medium">{messages(item.label)}</span>,
            type: 'group',
            children: getChildrenRoutes(item.children)
                .filter((item) => !item.hidden)
                .map((child) => {
                    const getLabel = () => {
                        if (child.external) {
                            return (
                                <a href={child.href} target="_blank">
                                    {messages(child.label)}
                                    {/* {child.label} */}
                                </a>
                            );
                        }

                        return (
                            <Link
                                href={child.href}
                                className="flex items-center font-medium"
                            >
                                <p className="grow font-medium">
                                    {messages(child.label)}
                                    {/* {child.label} */}
                                </p>
                            </Link>
                        );
                    };

                    return {
                        key: child.href,
                        label: getLabel(),
                        icon: (
                            <span className="!mr-2 !text-lg">
                                <child.icon size={SIZE_ICON} />
                            </span>
                        ),
                    };
                }),
        };

        return parentItem;
    });

    return (
        <Menu
            className="!border-none"
            items={items.filter((item) => Number(item.children?.length) > 0)}
            mode="inline"
            selectedKeys={[pathname]}
        />
    );
}

export default SidebarMenu;
