import AppConfirm from '@/components/ui/modal/confirm-modal';
import useModalStore, {
    CloseModalProps,
    OpenModalProps,
} from '@/hooks/use-modal';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { Key } from 'react';
import { TYPE_MODAL_PRODUCT } from '../../enums';
import { useRemoveAssignee } from '../../hooks/use-remove-assignee';

type Props = {
    openModal: OpenModalProps<TYPE_MODAL_PRODUCT, any>;
    closeModal: CloseModalProps;
    selectedRowKeys: Key[];
    resetSelectedRows?: () => void;
};

export default function RemoveUserConfirm({
    openModal,
    closeModal,
    selectedRowKeys,
    resetSelectedRows,
}: Props) {
    const messages = useTranslations();

    const typeModal = useModalStore((state) => state.typeModal);

    const { removeAssignee, isPending } = useRemoveAssignee();

    const handleRemoveUser = () => {
        const variable = {
            payload: {
                orderProductIds: selectedRowKeys,
            },
            onSuccess: () => {
                closeModal();
                resetSelectedRows?.();
            },
        };
        removeAssignee(variable);
    };

    return (
        <>
            {selectedRowKeys.length > 0 && (
                <>
                    <Button
                        type="primary"
                        danger
                        onClick={() =>
                            openModal(TYPE_MODAL_PRODUCT.REMOVE_USER, null)
                        }
                    >
                        {messages('common.removeAssignee')}
                    </Button>
                </>
            )}
            {typeModal === TYPE_MODAL_PRODUCT.REMOVE_USER && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    modalTitle={messages('common.assignee')}
                    width={400}
                    onOk={handleRemoveUser}
                    confirmLoading={isPending}
                    paragraph={messages(
                        'product.message.areYouSureRemoveAssignee'
                    )}
                />
            )}
        </>
    );
}
