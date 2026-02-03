import AppSearch from '@/components/ui/input/search';
import { cn } from '@/helpers/common';
import { Checkbox, Menu, theme } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
type Props = {
    open: boolean;
};

export default function SideMenu({ open }: Props) {
    const { token } = theme.useToken();

    const items: ItemType[] = [
        {
            key: '0',
            type: 'group',
            label: <p className="font-semibold">Filters</p>,
        },
        {
            key: '0.5',
            type: 'divider',
        },
        {
            key: '1',
            label: <p className="font-semibold">Included DSPs</p>,
            children: [
                {
                    key: '1.1',
                    label: <AppSearch />,
                    children: [
                        {
                            key: '1.1.1',
                            label: <Checkbox> Test </Checkbox>,
                        },
                        {
                            key: '1.1.1',
                            label: <Checkbox> Test </Checkbox>,
                        },
                        {
                            key: '1.1.1',
                            label: <Checkbox> Test </Checkbox>,
                        },
                    ],
                },
            ],
        },
        {
            key: '2',
            label: <p className="font-semibold">Labels</p>,
            children: [
                {
                    key: '2.1',
                    label: <AppSearch />,
                },
            ],
        },
        {
            key: '3',
            label: <p className="font-semibold">Artists</p>,
            children: [
                {
                    key: '3.1',
                    label: <AppSearch />,
                },
            ],
        },
        {
            key: '4',
            label: <p className="font-semibold">Releases</p>,
            children: [
                {
                    key: '4.1',
                    label: <AppSearch />,
                },
            ],
        },
        {
            key: '5',
            label: <p className="font-semibold">Tracks</p>,
            children: [
                {
                    key: '5.1',
                    label: <AppSearch />,
                },
            ],
        },
    ];
    return (
        <div
            className={cn(
                'fixed left-0 top-0 w-72 transition-all duration-700 ease-in-out',
                {
                    'w-0': !open,
                }
            )}
        >
            <Menu
                items={items}
                style={{ backgroundColor: token.colorBgContainer }}
                className={cn('custom-filter-menu !mt-12 h-screen', {
                    hidden: !open,
                })}
                mode="inline"
            />
        </div>
    );
}
