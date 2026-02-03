import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON } from '@/constants/common';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_RELEASE } from '@/modules/releases/enums';
import { Dropdown, MenuProps } from 'antd';
import { EllipsisVertical } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Props = {};

enum OPTIONS_MENU {
    DISTRIBUTE = 'distribute',
    DELETE = 'delete',
}

export default function OptionsMenu({}: Props) {
    const messages = useTranslations();
    const params = useParams();
    const openModal = useModalStore((state) => state.openModal);
    const releaseId = params['release-id'];
    const { active, isActive, deActive } = useActive();
    const items: MenuProps['items'] = [
        {
            key: OPTIONS_MENU.DISTRIBUTE,
            label: (
                <p className="!min-w-20"> {messages('common.distribute')}</p>
            ),
        },
        {
            key: OPTIONS_MENU.DELETE,
            danger: true,
            label: messages('common.delete'),
        },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        switch (key) {
            case OPTIONS_MENU.DISTRIBUTE:
                active();

                break;
            case OPTIONS_MENU.DELETE:
                active();
                openModal(TYPE_MODAL_RELEASE.DELETE);
                break;

            default:
                break;
        }
    };

    return (
        <Dropdown
            menu={{ items, onClick: handleMenuClick }}
            trigger={['click']}
            placement="bottomRight"
        >
            <IconButton shape="circle">
                <EllipsisVertical size={SIZE_ICON} />
            </IconButton>
        </Dropdown>
    );
}
