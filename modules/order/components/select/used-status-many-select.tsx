import AppModal from '@/components/ui/modal/normal-modal';
import { CloseModalProps, OpenModalProps } from '@/hooks/use-modal';
import { Button, Form, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { useTranslations } from 'next-intl';
import { Key } from 'react';
import { TYPE_MODAL_ORDER, USED_STATUS } from '../../enums';
import { useUpdateUsedStatus } from '../../hooks/use-update-used-status';
import { UpdateUsedStatus } from '../../types/update-order';

type Props = {
    openModal: OpenModalProps<TYPE_MODAL_ORDER, any>;
    closeModal: CloseModalProps;
    selectedRowKeys: Key[];
    typeModal?: TYPE_MODAL_ORDER;
    resetSelectedRows?: () => void;
};

export default function UsedStatusManySelect({
    openModal,
    closeModal,
    selectedRowKeys,
    typeModal,
    resetSelectedRows,
}: Props) {
    const messages = useTranslations();
    const [form] = useForm();

    const { updateUsedStatus, isPending } = useUpdateUsedStatus();

    const handleSelectUsedStatus = (value: any) => {
        const variable: UpdateUsedStatus = {
            payload: {
                listOrderIds: selectedRowKeys,
                usedStatus: value?.usedStatus,
            },
            onSuccess: () => {
                form.resetFields();
                closeModal();
                resetSelectedRows?.();
            },
        };
        updateUsedStatus(variable);
    };

    const onFinish = (value: any) => {
        handleSelectUsedStatus(value);
    };

    const options = [
        {
            label: messages('common.used'),
            value: USED_STATUS.USED,
        },
        {
            label: messages('common.notUsed'),
            value: USED_STATUS.NOT_USED,
        },
        {
            label: messages('common.unknown'),
            value: null,
        },
    ];

    return (
        <>
            {selectedRowKeys.length > 0 && (
                <>
                    <Button
                        onClick={() => {
                            openModal(TYPE_MODAL_ORDER.USED_STATUS);
                        }}
                        type="primary"
                    >
                        {messages('validation.selectUsedStatus')}
                    </Button>
                </>
            )}

            {typeModal === TYPE_MODAL_ORDER.USED_STATUS && (
                <AppModal
                    open
                    onCancel={closeModal}
                    title={messages('validation.selectUsedStatus')}
                    width={400}
                    onOk={form.submit}
                    confirmLoading={isPending}
                    cancelButtonProps={{ disabled: isPending }}
                >
                    <Form form={form} onFinish={onFinish}>
                        <FormItem
                            name="usedStatus"
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: messages('validation.select'),
                            //     },
                            // ]}
                        >
                            <Select
                                options={options}
                                className="!mb-[10px] w-full"
                                placeholder={messages(
                                    'validation.selectUsedStatus'
                                )}
                            />
                        </FormItem>
                    </Form>
                </AppModal>
            )}
        </>
    );
}
