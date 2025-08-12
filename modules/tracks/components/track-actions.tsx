import { cn } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { TYPE_MODAL_TRACK } from '@/modules/releases/enums';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { Key } from 'react';

type Props = {
    selectedRowKeys: Key[];
    resetSelectedRows: () => void;
};

export default function TrackActions({
    selectedRowKeys,
    resetSelectedRows,
}: Props) {
    const openModal = useModalStore((state) => state.openModal);
    const messages = useTranslations();
    const { isAdmin } = useAuth();
    return (
        <div
            className={cn(
                'flex grow flex-wrap items-center justify-start gap-2 overflow-hidden font-medium transition-all duration-300 lg:h-12',
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
                    type="primary"
                    onClick={() => openModal(TYPE_MODAL_TRACK.ACR_CLOUD_SCAN)}
                >
                    {messages('tracks.scan')}
                </Button>
            </div>
        </div>
    );
}
