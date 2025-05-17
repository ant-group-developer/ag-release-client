import MenuSidebar, { MenuSidebarProps } from './menu-sidebar';

type Props = {};

export default function SidebarSecondary({}: Props) {
    const items: MenuSidebarProps['items'] = [
        {
            title: 'Phát hành',
        },
        {
            title: 'Bài hát',
        },
        {
            title: 'Lịch trình',
        },
    ];

    return (
        <div className="w-[256px] border-r p-2">
            <div>
                <div>
                    <MenuSidebar items={items} />
                </div>
            </div>
        </div>
    );
}
