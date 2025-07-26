import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON, SIZE_ICON_SMALL } from '@/constants/common';
import { Dropdown, MenuProps } from 'antd';
import { Download, MoreVertical, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MouseEventHandler } from 'react';

type Props = {
    showDownload?: boolean;
    onShowDownload?: () => void;
    showDelete?: boolean;
    onShowDelete?: () => void;
};

enum ACTION_BUTTON {
    COMMENT = 'comment',
    DETAIL = 'detail',
    UPDATE = 'update',
    DELETE = 'delete',
    UPLOAD = 'upload',
    CANCEL = 'cancel',
    CONTINUE = 'continue',
    DOWNLOAD = 'download',
}

export default function TrackActionButton({
    showDelete,
    showDownload,
    onShowDelete,
    onShowDownload,
}: Props) {
    const messages = useTranslations();
    const items: MenuProps['items'] = [];
    if (showDownload) {
        items.push({
            key: 'download',
            label: (
                <div className="flex items-center gap-2">
                    <Download size={SIZE_ICON_SMALL} />
                    {messages('common.download')}
                </div>
            ),
        });
    }
    if (showDelete) {
        items.push({
            type: 'divider',
        });
        items.push({
            key: 'delete',
            danger: true,
            label: (
                <div className="flex items-center gap-2">
                    <Trash size={SIZE_ICON_SMALL} />
                    <span>{messages('common.delete')}</span>
                </div>
            ),
        });
    }

    const handleMenuClick = ({ key }: { key: string }) => {
        const callbacks: Record<
            string,
            MouseEventHandler<HTMLElement> | undefined
        > = {
            [ACTION_BUTTON.DELETE]: onShowDelete,
            [ACTION_BUTTON.DOWNLOAD]: onShowDownload,
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
