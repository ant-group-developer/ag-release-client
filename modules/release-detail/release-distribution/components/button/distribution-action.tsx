import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON, SIZE_ICON_SMALL } from '@/constants/common';
import { Dropdown, MenuProps } from 'antd';
import { Box, MoreVertical, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MouseEventHandler } from 'react';

interface Props {
    showDistribute?: boolean;
    showDelete?: boolean;
    onShowDistribute?: MouseEventHandler<HTMLElement>;
    onShowDelete?: MouseEventHandler<HTMLElement>;
}

enum ACTION_BUTTON {
    Distribute = 'Distribute',
    DELETE = 'delete',
}

export default function DistributionActionButton({
    showDelete,
    showDistribute,
    onShowDistribute,
    onShowDelete,
}: Props) {
    const messages = useTranslations();
    const items: MenuProps['items'] = [];
    if (showDistribute) {
        items.push({
            key: ACTION_BUTTON.Distribute,
            label: (
                <div className="flex items-center gap-2">
                    <Box size={SIZE_ICON_SMALL} />{' '}
                    {messages('distribution.label')}
                </div>
            ),
        });
    }

    if (showDelete) {
        items.push({
            type: 'divider',
        });
        items.push({
            key: ACTION_BUTTON.DELETE,
            danger: true,
            label: (
                <div className="flex items-center gap-2">
                    <X size={SIZE_ICON_SMALL} />
                    <span>{messages('common.takeDown')}</span>
                </div>
            ),
        });
    }

    // Xử lý sự kiện click cho từng menu item
    const handleMenuClick = ({ key }: { key: string }) => {
        const callbacks: Record<
            string,
            MouseEventHandler<HTMLElement> | undefined
        > = {
            [ACTION_BUTTON.Distribute]: onShowDistribute,
            [ACTION_BUTTON.DELETE]: onShowDelete,
        };

        const callback = callbacks[key];
        if (callback) {
            callback(null as any);
        }
    };

    return (
        <Dropdown
            menu={{ items, onClick: handleMenuClick }}
            trigger={['click']}
            placement="topLeft"
        >
            {/* <Tooltip title={messages('common.action')}> */}
            <IconButton>
                <MoreVertical size={SIZE_ICON} />
            </IconButton>
            {/* </Tooltip> */}
        </Dropdown>
    );
}
