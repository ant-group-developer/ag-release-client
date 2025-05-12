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

export default function AssignUserSelect({
    openModal,
    closeModal,
    selectedRowKeys,
    typeModal,
    resetSelectedRows,
}: Props) {
    const messages = useTranslations();
    const [form] = useForm();
    // const option = [
    //     { value: '0552f9c2-8f9b-4916-854e-23a70258b2c4', label: 'ANT - Điệp' },
    //     {
    //         value: '07e55f68-db98-46f0-b4a2-16b624e5c64a',
    //         label: 'ANT - BOD Đạt',
    //     },
    //     { value: '0c47d0d7-0465-4eda-b446-f204f9187e58', label: 'ANT - Nhân' },
    // ];

    const { assignUser, isPending } = useAssignUser();

    const handleAssignee = (value: string) => {
        const variable: UserAssignPayload = {
            payload: {
                assigneeId: value,
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
        handleAssignee(value.userAssign);
    };

    return (
        <>
            {selectedRowKeys.length > 0 && (
                <>
                    <Button
                        onClick={() =>
                            openModal(TYPE_MODAL_PRODUCT.ASSIGN_USER, null)
                        }
                        type="primary"
                    >
                        {messages('common.selectAssignee')}
                    </Button>
                </>
            )}
            {typeModal === TYPE_MODAL_PRODUCT.ASSIGN_USER && (
                <AppModal
                    open
                    onCancel={closeModal}
                    title={messages('common.assignee')}
                    width={400}
                    onOk={form.submit}
                    confirmLoading={isPending}
                    cancelButtonProps={{ disabled: isPending }}
                >
                    <Form form={form} onFinish={onFinish}>
                        <FormItem
                            name="userAssign"
                            className="userAssign"
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
