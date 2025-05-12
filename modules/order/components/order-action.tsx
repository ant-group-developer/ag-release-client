import { cn } from '@/helpers/common';
import { OpenModalProps } from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { Key } from 'react';
import { TYPE_MODAL_ORDER } from '../enums';
import { OrderData } from '../types';
import UsedStatusManySelect from './select/used-status-many-select';

type Props = {
    selectedRowKeys: Key[];
    openModal: OpenModalProps<TYPE_MODAL_ORDER, OrderData>;
    closeModal: () => void;
    typeModal: TYPE_MODAL_ORDER;
    resetSelectedRows: () => void;
};

export default function OrderAction({
    selectedRowKeys,
    resetSelectedRows,
    openModal,
    closeModal,
    typeModal,
}: Props) {
    const messages = useTranslations();
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

            <UsedStatusManySelect
                closeModal={closeModal}
                openModal={openModal}
                selectedRowKeys={selectedRowKeys}
                resetSelectedRows={resetSelectedRows}
                typeModal={typeModal}
            />
        </div>
    );
}
