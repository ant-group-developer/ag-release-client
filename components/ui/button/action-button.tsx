import { SIZE_ICON, SIZE_ICON_SMALL } from '@/constants/common';
import { Dropdown, MenuProps } from 'antd';
import {
    CirclePlay,
    CircleX,
    Download,
    Eye,
    MessageCircleMore,
    MoreVertical,
    Pencil,
    Trash,
    Upload,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MouseEventHandler } from 'react';
import IconButton from './icon-button';

export interface ActionButtonProps {
    showComment?: boolean;
    showDetail?: boolean;
    showUpdate?: boolean;
    showDelete?: boolean;
    showUpload?: boolean;
    showCancel?: boolean;
    showContinue?: boolean;
    showDownload?: boolean;
    onShowDownload?: MouseEventHandler<HTMLElement>;
    onShowContinue?: MouseEventHandler<HTMLElement>;
    onShowCancel?: MouseEventHandler<HTMLElement>;
    onShowUpload?: MouseEventHandler<HTMLElement>;
    onShowComment?: MouseEventHandler<HTMLElement>;
    onShowDetail?: MouseEventHandler<HTMLElement>;
    onShowUpdate?: MouseEventHandler<HTMLElement>;
    onShowDelete?: MouseEventHandler<HTMLElement>;
}

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

export default function ActionButton({
    showDelete,
    showDetail,
    showUpdate,
    showComment,
    showUpload,
    showCancel,
    showContinue,
    showDownload,
    onShowDownload,
    onShowContinue,
    onShowCancel,
    onShowComment,
    onShowDetail,
    onShowUpdate,
    onShowDelete,
    onShowUpload,
}: ActionButtonProps) {
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
    if (showComment) {
        items.push({
            key: ACTION_BUTTON.COMMENT,
            label: (
                <div className="flex items-center gap-2">
                    <MessageCircleMore size={SIZE_ICON_SMALL} />{' '}
                    {messages('common.comment')}
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
    if (showUpdate) {
        items.push({
            key: ACTION_BUTTON.UPDATE,
            label: (
                <div className="flex items-center gap-2">
                    <Pencil size={SIZE_ICON_SMALL} />
                    {messages('common.update')}
                </div>
            ),
        });
    }
    if (showUpload) {
        items.push({
            key: ACTION_BUTTON.UPLOAD,
            label: (
                <div className="flex items-center gap-2">
                    <Upload size={SIZE_ICON_SMALL} />
                    {messages('common.upload')}
                </div>
            ),
        });
    }
    if (showCancel) {
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

    if (showContinue) {
        items.push({
            key: ACTION_BUTTON.CONTINUE,
            label: (
                <div className="flex items-center gap-2">
                    <CirclePlay size={SIZE_ICON_SMALL} />
                    <span>{messages('status.active')}</span>
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
            [ACTION_BUTTON.COMMENT]: onShowComment,
            [ACTION_BUTTON.DETAIL]: onShowDetail,
            [ACTION_BUTTON.UPDATE]: onShowUpdate,
            [ACTION_BUTTON.DELETE]: onShowDelete,
            [ACTION_BUTTON.UPLOAD]: onShowUpload,
            [ACTION_BUTTON.CANCEL]: onShowCancel,
            [ACTION_BUTTON.CONTINUE]: onShowContinue,
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
        >
            <IconButton>
                <MoreVertical size={SIZE_ICON} />
            </IconButton>
        </Dropdown>
    );
}
