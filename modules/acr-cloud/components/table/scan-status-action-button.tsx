import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON, SIZE_ICON_SMALL } from '@/constants/common';
import { Dropdown, MenuProps } from 'antd';
import { CircleX, Eye, MoreVertical, ScanSearch, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MouseEventHandler } from 'react';

interface Props {
    showDelete?: boolean;
    showCancel?: boolean;
    showScan?: boolean;
    showDetail?: boolean;

    onShowScan?: MouseEventHandler<HTMLElement>;
    onShowCancel?: MouseEventHandler<HTMLElement>;
    onShowDetail?: MouseEventHandler<HTMLElement>;
    onShowDelete?: MouseEventHandler<HTMLElement>;
}

enum ACTION_BUTTON {
    DELETE = 'delete',
    CANCEL = 'cancel',
    SCAN = 'scan',
    DETAIL = 'detail',
}

export default function ScanStatusAction({
    showDelete,
    showCancel,
    showScan,
    showDetail,
    onShowScan,
    onShowCancel,
    onShowDetail,
    onShowDelete,
}: Props) {
    const messages = useTranslations();
    const items: MenuProps['items'] = [];
    if (showScan) {
        items.push({
            key: ACTION_BUTTON.SCAN,
            label: (
                <div className="flex items-center gap-2">
                    <ScanSearch size={SIZE_ICON_SMALL} />
                    <span>{messages('common.reScan')}</span>
                </div>
            ),
        });
    }

    if (showDetail) {
        items.push({
            key: ACTION_BUTTON.DETAIL,
            label: (
                <div className="flex items-center gap-2">
                    <Eye size={SIZE_ICON_SMALL} />
                    {messages('common.detail')}
                </div>
            ),
        });
    }

    if (showCancel) {
        items.push({
            type: 'divider',
        });
        items.push({
            key: ACTION_BUTTON.CANCEL,
            label: (
                <div className="flex items-center gap-2 text-red-500">
                    <CircleX size={SIZE_ICON_SMALL} />
                    <span>{messages('common.cancel')}</span>
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
                    <Trash size={SIZE_ICON_SMALL} />
                    <span>{messages('common.delete')}</span>
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
            [ACTION_BUTTON.DELETE]: onShowDelete,
            [ACTION_BUTTON.CANCEL]: onShowCancel,
            [ACTION_BUTTON.SCAN]: onShowScan,
            [ACTION_BUTTON.DETAIL]: onShowDetail,
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
        >
            <IconButton>
                <MoreVertical size={SIZE_ICON} />
            </IconButton>
        </Dropdown>
    );
}
