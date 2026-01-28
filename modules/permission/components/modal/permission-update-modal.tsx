'use client';
import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { MAX_NAME_LENGTH, MAX_NOTE_LENGTH } from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { UpdateVariables } from '@/types/api';
import { Form, Input, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useUpdatePermission } from '../../hooks/use-update-permission';
import { PermissionData } from '../../types';
import { UpdatePermissionPayload } from '../../types/payload';

type Props = Omit<AppModalProps, 'children'>;

export default function PermissionUpdateModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { active, deActive, isActive } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<PermissionData>((state) => state.dataEdit);

    const { updatePermission } = useUpdatePermission();

    const handleUpdatePermission = (values: any) => {
        const variables: UpdateVariables<
            PermissionData['id'],
            UpdatePermissionPayload
        > = {
            id: dataEdit?.id,
            payload: values,
            onSuccess: () => {
                deActive();
                closeModal();
            },
            onError: () => {
                deActive();
            },
        };
        updatePermission(variables);
    };

    const onFinish = (values: any) => {
        active();
        handleUpdatePermission(values);
    };

    useEffect(() => {
        if (dataEdit) {
            form.setFieldsValue({ ...dataEdit });
        }
    }, [dataEdit, form]);

    return (
        <AppModal
            open
            width={650}
            {...props}
            title={`${messages('common.update')} ${messages('permission.label').toLowerCase()}`}
            onCancel={closeModal}
            onOk={form.submit}
            loading={isActive}
        >
            <div className="max-h-[580px] overflow-auto">
                <AppForm
                    form={form}
                    onFinish={onFinish}
                    showSubmit={false}
                    layout="horizontal"
                    disabled={isActive}
                >
                    <AppFormItem
                        name="name"
                        label={messages('permission.name')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                            {
                                max: MAX_NAME_LENGTH,
                                message: messages('validation.stringMax', {
                                    max: MAX_NAME_LENGTH,
                                    field: messages('permission.name'),
                                }),
                            },
                        ]}
                    >
                        <Input allowClear showCount />
                    </AppFormItem>
                    <AppFormItem
                        name="code"
                        label={messages('common.code')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                            {
                                max: MAX_NAME_LENGTH,
                                message: messages('validation.stringMax', {
                                    max: MAX_NAME_LENGTH,
                                    field: messages('common.code'),
                                }),
                            },
                        ]}
                    >
                        <Input allowClear showCount />
                    </AppFormItem>
                    <AppFormItem
                        className="!mb-6"
                        name="note"
                        label={messages('common.note')}
                        rules={[
                            {
                                max: MAX_NOTE_LENGTH,
                                message: messages('validation.stringMax', {
                                    max: MAX_NOTE_LENGTH,
                                    field: messages('common.note'),
                                }),
                            },
                        ]}
                    >
                        <TextArea
                            autoSize={{
                                minRows: 3,
                                maxRows: 7,
                            }}
                            showCount
                        />
                    </AppFormItem>
                    <AppFormItem
                        name="isActive"
                        label={messages('permission.isActive')}
                        valuePropName="checked"
                    >
                        <Switch />
                    </AppFormItem>
                </AppForm>
            </div>
        </AppModal>
    );
}
