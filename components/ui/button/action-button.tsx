import { SIZE_ICON, SIZE_ICON_SMALL } from '@/constants/common';
import { Dropdown, MenuProps } from 'antd';
import {
    CirclePlay,
    CircleX,
    Download,
    Eye,
    Globe,
    Languages,
    MessageCircleMore,
    MoreVertical,
    Pencil,
    Trash,
    Upload,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MouseEventHandler, ReactNode } from 'react';
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
    showAddTranslate?: boolean;
    showTranslation?: boolean;
    onShowTranslation?: MouseEventHandler<HTMLElement>;
    onShowAddTranslate?: MouseEventHandler<HTMLElement>;
    onShowDownload?: MouseEventHandler<HTMLElement>;
    onShowContinue?: MouseEventHandler<HTMLElement>;
    onShowCancel?: MouseEventHandler<HTMLElement>;
    onShowUpload?: MouseEventHandler<HTMLElement>;
    onShowComment?: MouseEventHandler<HTMLElement>;
    onShowDetail?: MouseEventHandler<HTMLElement>;
    onShowUpdate?: MouseEventHandler<HTMLElement>;
    onShowDelete?: MouseEventHandler<HTMLElement>;

    extraItems?: ActionType[];
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
    SHOW_ADD_TRANSLATE = 'showAddTranslate',
    SHOW_TRANSLATIONS = 'showTranslations',
}

type ActionType = {
    key: string;
    show: boolean;
    label: ReactNode;
    danger?: boolean;
    dividerBefore?: boolean;
};

export default function ActionButton({
    showDelete,
    showDetail,
    showUpdate,
    showComment,
    showUpload,
    showCancel,
    showContinue,
    showDownload,
    showAddTranslate,
    showTranslation,
    onShowTranslation,
    onShowAddTranslate,
    onShowDownload,
    onShowContinue,
    onShowCancel,
    onShowComment,
    onShowDetail,
    onShowUpdate,
    onShowDelete,
    onShowUpload,

    extraItems = [],
}: ActionButtonProps) {
    const messages = useTranslations();

    const actions: ActionType[] = [
        {
            key: ACTION_BUTTON.DOWNLOAD,
            show: !!showDownload,
            label: (
                <div className="flex items-center gap-2">
                    <Download size={SIZE_ICON_SMALL} />
                    {messages('common.download')}
                </div>
            ),
        },
        {
            key: ACTION_BUTTON.COMMENT,
            show: !!showComment,
            label: (
                <div className="flex items-center gap-2">
                    <MessageCircleMore size={SIZE_ICON_SMALL} />
                    {messages('common.comment')}
                </div>
            ),
        },
        {
            key: ACTION_BUTTON.DETAIL,
            show: !!showDetail,
            label: (
                <div className="flex items-center gap-2">
                    <Eye size={SIZE_ICON_SMALL} />
                    {messages('common.detail')}
                </div>
            ),
        },
        {
            key: ACTION_BUTTON.SHOW_ADD_TRANSLATE,
            show: !!showAddTranslate,
            label: (
                <div className="flex items-center gap-2">
                    <Languages size={SIZE_ICON_SMALL} />
                    {messages('common.addTranslate')}
                </div>
            ),
        },
        {
            key: ACTION_BUTTON.SHOW_TRANSLATIONS,
            show: !!showTranslation,
            label: (
                <div className="flex items-center gap-2">
                    <Globe size={SIZE_ICON_SMALL} />
                    {messages('common.translation')}
                </div>
            ),
        },
        {
            key: ACTION_BUTTON.UPDATE,
            show: !!showUpdate,
            label: (
                <div className="flex items-center gap-2">
                    <Pencil size={SIZE_ICON_SMALL} />
                    {messages('common.update')}
                </div>
            ),
        },
        {
            key: ACTION_BUTTON.UPLOAD,
            show: !!showUpload,
            label: (
                <div className="flex items-center gap-2">
                    <Upload size={SIZE_ICON_SMALL} />
                    {messages('common.upload')}
                </div>
            ),
        },
        {
            key: ACTION_BUTTON.CANCEL,
            show: !!showCancel,
            label: (
                <div className="flex items-center gap-2 text-red-500">
                    <CircleX size={SIZE_ICON_SMALL} />
                    <span>{messages('common.cancel')}</span>
                </div>
            ),
        },
        {
            key: ACTION_BUTTON.CONTINUE,
            show: !!showContinue,
            label: (
                <div className="flex items-center gap-2">
                    <CirclePlay size={SIZE_ICON_SMALL} />
                    <span>{messages('status.active')}</span>
                </div>
            ),
        },
        {
            key: ACTION_BUTTON.DELETE,
            show: !!showDelete,
            danger: true,
            label: (
                <div className="flex items-center gap-2">
                    <Trash size={SIZE_ICON_SMALL} />
                    <span>{messages('common.delete')}</span>
                </div>
            ),
            dividerBefore: true,
        },
    ];

    const allItems = [...extraItems, ...actions];

    const items: MenuProps['items'] = [];

    allItems?.forEach((item) => {
        if (item?.show) {
            if (item.dividerBefore && items.length > 0) {
                items.push({ type: 'divider' });
            }
            items.push({
                ...item,
            });
        }
    });

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
            [ACTION_BUTTON.SHOW_ADD_TRANSLATE]: onShowAddTranslate,
            [ACTION_BUTTON.SHOW_TRANSLATIONS]: onShowTranslation,
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
