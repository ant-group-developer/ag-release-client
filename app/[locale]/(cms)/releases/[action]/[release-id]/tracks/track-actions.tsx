import { cn } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { Key } from 'react';

type Props = {
    selectedRowKeys: Key[];
};

export default function TrackActions({ selectedRowKeys }: Props) {
    const openModal = useModalStore((state) => state.openModal);
    const messages = useTranslations();
    return (
        <div
            className={cn(
                'flex grow flex-wrap items-center justify-start gap-2 overflow-hidden font-medium lg:h-12',
                {
                    'h-0 lg:h-0': selectedRowKeys.length === 0,
                    'border-b px-5 py-2': selectedRowKeys.length > 0,
                }
            )}
        >
            <p className="text-sm font-bold">
                {selectedRowKeys.length} {messages('common.selected')}
            </p>
            <div>
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
