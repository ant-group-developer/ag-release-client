import AppModal from '@/components/ui/modal/normal-modal';
import { CloseModalProps, OpenModalProps } from '@/hooks/use-modal';
import UserSelect from '@/modules/user/components/user-select';
import { Button, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { useTranslations } from 'next-intl';
import { Key } from 'react';
import { TYPE_MODAL_PRODUCT } from '../../enums';
import { useAssignUser } from '../../hooks/use-assignee';
import { UserAssignPayload } from '../../types';

type Props = {
    openModal: OpenModalProps<TYPE_MODAL_PRODUCT, any>;
    closeModal: CloseModalProps;
    selectedRowKeys: Key[];
    typeModal?: TYPE_MODAL_PRODUCT;
    resetSelectedRows?: () => void;
};

export default function ApproverUserSelect({
    openModal,
    closeModal,
    selectedRowKeys,
    typeModal,
    resetSelectedRows,
}: Props) {
    const messages = useTranslations();
    const [form] = useForm();

    const { assignUser, isPending } = useAssignUser();

    const handleAssignee = (value: string) => {
        const variable: UserAssignPayload = {
            payload: {
                approverId: value,
                listOrderProductId: selectedRowKeys,
            },
            onSuccess: () => {
                form.resetFields();
                closeModal();
                resetSelectedRows?.();
            },
        };
        assignUser(variable);
    };

    const onFinish = (value: any) => {
        handleAssignee(value.userApprover);
    };

    return (
        <>
            {selectedRowKeys.length > 0 && (
                <>
                    <Button
                        onClick={() =>
                            openModal(TYPE_MODAL_PRODUCT.APPROVER_USER, null)
                        }
                        type="primary"
                    >
                        {messages('select.approver')}
                    </Button>
                </>
            )}
            {typeModal === TYPE_MODAL_PRODUCT.APPROVER_USER && (
                <AppModal
                    open
                    onCancel={closeModal}
                    title={messages('common.approver')}
                    width={400}
                    onOk={form.submit}
                    confirmLoading={isPending}
                    cancelButtonProps={{ disabled: isPending }}
                >
                    <Form form={form} onFinish={onFinish}>
                        <FormItem
                            name="userApprover"
                            className=""
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <UserSelect />
                        </FormItem>
                    </Form>
                </AppModal>
            )}
        </>
    );
}
