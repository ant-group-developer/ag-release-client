import { cn } from '@/helpers/common';
import { OpenModalProps } from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { Key } from 'react';
import { TYPE_MODAL_PRODUCT } from '../enums';
import { ProductData } from '../types';
import RemoveUserConfirm from './form/remove-user-confirm';
import ApproverUserSelect from './select/approver-user-select';
import AssignUserSelect from './select/assignee-user-select';

type Props = {
    selectedRowKeys: Key[];
    openModal: OpenModalProps<TYPE_MODAL_PRODUCT, ProductData>;
    closeModal: () => void;
    typeModal: TYPE_MODAL_PRODUCT;
    resetSelectedRows: () => void;
};

export default function ProductAction({
    selectedRowKeys,
    openModal,
    closeModal,
    typeModal,
    resetSelectedRows,
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

            <AssignUserSelect
                openModal={openModal}
                closeModal={closeModal}
                typeModal={typeModal}
                selectedRowKeys={selectedRowKeys}
                resetSelectedRows={resetSelectedRows}
            />

            <RemoveUserConfirm
                openModal={openModal}
                closeModal={closeModal}
                selectedRowKeys={selectedRowKeys}
                resetSelectedRows={resetSelectedRows}
            />

            <ApproverUserSelect
                openModal={openModal}
                closeModal={closeModal}
                typeModal={typeModal}
                selectedRowKeys={selectedRowKeys}
                resetSelectedRows={resetSelectedRows}
            />
        </div>
    );
}
