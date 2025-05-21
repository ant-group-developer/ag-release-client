import { useParams } from 'next/navigation';
import MenuSidebar, { MenuSidebarProps } from './menu-sidebar';

type Props = {};

export default function SidebarSecondary({}: Props) {
    const params = useParams();
    const releaseId =
        params['release-id'] === undefined ? '' : `/${params['release-id']}`;

    const isDisabledMenuItem = releaseId === '';

    const items: MenuSidebarProps['items'] = [
        {
            title: 'Thông tin chính',
            href: `/releases/detail/core-detail${releaseId}`,
        },
        {
            title: 'Bài hát',
            href: `/releases/detail/tracks${releaseId}`,
            disabled: isDisabledMenuItem,
        },
        {
            title: 'Lên lịch phát hành',
            href: `/releases/detail/schedule${releaseId}`,
            disabled: isDisabledMenuItem,
        },
    ];

    return (
        <div className="fixed h-full w-[256px] border-r p-2">
            <div>
                <div>
                    <MenuSidebar items={items} />
                </div>
            </div>
        </div>
    );
}
