import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON, SIZE_ICON_SMALL } from '@/constants/common';
import { Dropdown, DropdownProps, MenuProps } from 'antd';
import { Download, Eye, MoreVertical, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MouseEventHandler } from 'react';

type Props = {
    showDownload?: boolean;
    showDelete?: boolean;
    showDetail?: boolean;
    onShowDetail?: () => void;
    onShowDownload?: () => void;
    onShowDelete?: () => void;
} & DropdownProps;

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
    showDetail,
    onShowDetail,
    onShowDelete,
    onShowDownload,
    ...props
}: Props) {
    const messages = useTranslations();
    const items: MenuProps['items'] = [];
    if (showDownload) {
        items.push({
            key: ACTION_BUTTON.DOWNLOAD,
            label: (
                <div className="flex items-center gap-2">
                    <Download size={SIZE_ICON_SMALL} />
                    {messages('common.download')}
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
            [ACTION_BUTTON.DETAIL]: onShowDetail,
        };

        const callback = callbacks[key];
        if (callback) {
            callback(null as any);
        }
    };

    return (
        <Dropdown
            {...props}
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
