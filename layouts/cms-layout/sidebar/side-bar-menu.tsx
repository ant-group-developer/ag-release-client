import { SIZE_ICON } from '@/constants/common';
import { Link, usePathname } from '@/i18n/routing';
import { useCheckPermission } from '@/modules/auth/hooks/use-permission';
import { Menu, MenuProps } from 'antd';
import { useTranslations } from 'next-intl';
import { adminRoutes, AdminRoutesChildType } from '../routes';

type Props = {};

type MenuItem = Required<MenuProps>['items'][number];

function SidebarMenu({}: Props) {
    const pathname = usePathname();
    const messages = useTranslations();
    const { checkPermission } = useCheckPermission();

    const getChildrenRoutes = (children: AdminRoutesChildType[]) => {
        const result = children.filter((item) => {
            return !item.hidden && checkPermission(item.required);
        });
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
            selectedKeys={[`/${pathname.split('/')[1]}`]}
        />
    );
}

export default SidebarMenu;
