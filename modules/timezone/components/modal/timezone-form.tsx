import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateTimezone } from '../../hooks/use-create-timezone';
import { useUpdateTimezone } from '../../hooks/use-update-timezone';
import { TimezoneData } from '../../types';
import {
    CreateTimezonePayload,
    UpdateTimezonePayload,
} from '../../types/payload';

type TimezoneFormValues = Omit<TimezoneData, 'id' | 'createdAt' | 'updatedAt'>;

type Props = Omit<AppModalProps, 'children'> & {};

export default function TimezoneFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm<TimezoneFormValues>();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as TimezoneData);
    const isUpdateForm = !!dataEdit?.id;
    const { active, deActive, isActive } = useActive();

    const { createTimezone } = useCreateTimezone();
    const { updateTimezone } = useUpdateTimezone();

    const handleCreateTimezone = (values: TimezoneFormValues) => {
        const variables: CreateVariables<CreateTimezonePayload> = {
            payload: values,
            onSuccess: () => {
                form.resetFields();
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        createTimezone(variables);
    };

    const handleUpdateTimezone = (values: TimezoneFormValues) => {
        const variables: UpdateVariables<
            TimezoneData['id'],
            UpdateTimezonePayload
        > = {
            id: dataEdit?.id,
            payload: values,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        updateTimezone(variables);
    };

    const onfinish = (values: TimezoneFormValues) => {
        active();
        return isUpdateForm
            ? handleUpdateTimezone(values)
            : handleCreateTimezone(values);
    };

    const modalTitle = () => {
        return `${isUpdateForm ? messages('common.update') : messages('common.create')} ${messages('timezone.label').toLocaleLowerCase()}`;
    };

    useEffect(() => {
        const initialData = {
            ...dataEdit,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit]);

    return (
        <AppModal
            width={500}
            {...props}
            title={modalTitle()}
            open
            onCancel={closeModal}
            onOk={form.submit}
            loading={isActive}
        >
            <AppForm
                form={form}
                showSubmit={false}
                onFinish={onfinish}
                layout="vertical"
            >
                <AppFormItem
                    name="name"
                    label={messages('timezone.name')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 100,
                            message: messages('validation.max', {
                                number: 100,
                            }),
                        },
                    ]}
                >
                    <Input placeholder={messages('timezone.name')} allowClear />
                </AppFormItem>
                <AppFormItem
                    name="utc"
                    label="UTC"
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 10,
                            message: messages('validation.max', {
                                number: 10,
                            }),
                        },
                    ]}
                >
                    <Input placeholder="UTC+7, UTC-4..." allowClear />
                </AppFormItem>
                <AppFormItem
                    name="zone"
                    label={messages('timezone.zone')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 100,
                            message: messages('validation.max', {
                                number: 100,
                            }),
                        },
                    ]}
                >
                    <Input placeholder={messages('timezone.zone')} allowClear />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
