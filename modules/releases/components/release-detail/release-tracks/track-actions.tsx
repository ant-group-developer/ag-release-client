import { cn } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import { Button, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { Key } from 'react';

type Props = {
    selectedRowKeys: Key[];
};

export default function TrackActions({ selectedRowKeys }: Props) {
    const openModal = useModalStore((state) => state.openModal);
    const { token } = theme.useToken();
    const messages = useTranslations();
    return (
        <div
            className={cn(
                'flex grow flex-wrap items-center justify-start gap-2 overflow-hidden rounded-lg font-medium lg:h-12',
                {
                    'h-0 lg:h-0': selectedRowKeys.length === 0,
                    'mb-2 px-4': selectedRowKeys.length > 0,
                }
            )}
            style={{
                backgroundColor: token?.colorBgContainer,
            }}
        >
            <span className="inline-block min-w-20 text-sm font-bold">
                {selectedRowKeys.length} {messages('common.selected')}
            </span>
            <div className="flex gap-2">
                {/* <Button
                    type="primary"
                    onClick={() => openModal(TYPE_MODAL_TRACK.BULK_UPDATE)}
                >
                    {messages('track.action.bulkUpdate')}
                </Button> */}
                <Button
                    danger
                    type="primary"
                    onClick={() => openModal(TYPE_MODAL_TRACK.BULK_DELETE)}
                >
                    {messages('track.action.deleteTracks')}
                </Button>
            </div>
        </div>
    );
}
