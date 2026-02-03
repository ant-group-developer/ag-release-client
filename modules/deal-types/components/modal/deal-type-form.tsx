import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateDealType } from '../../hooks/use-create';
import { useUpdateDealType } from '../../hooks/use-update';
import { DealTypeData } from '../../types';
import {
    CreateDealTypePayload,
    UpdateDealTypePayload,
} from '../../types/payloads';

type Props = Omit<AppModalProps, 'children'> & {};

export default function DealTypeFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    // const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as DealTypeData);
    const { active, isActive, deActive } = useActive();
    const isUpdateModal = dataEdit?.id;

    const { createDealType } = useCreateDealType();
    const { updateDealType } = useUpdateDealType();

    const handleUpdate = (value: any) => {
        const variables: UpdateVariables<
            DealTypeData['id'],
            UpdateDealTypePayload
        > = {
            id: dataEdit?.id,
            payload: {
                ...value,
                requiresConnection: !!value?.requiresConnection,
            },
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        updateDealType(variables);
    };

    const handleCreate = (value: any) => {
        const variables: CreateVariables<CreateDealTypePayload> = {
            payload: {
                ...value,
                requiresConnection: !!value?.requiresConnection,
            },
            onSuccess: () => {
                deActive();
                form.resetFields();
            },
            onError: () => {
                deActive();
            },
        };
        createDealType(variables);
    };

    const onFinish = async (values: any) => {
        const { ...res } = values;
        active();
        const payloadValues = {
            ...res,
        };
        return isUpdateModal
            ? handleUpdate(payloadValues)
            : handleCreate(payloadValues);
    };

    useEffect(() => {
        const initialData = {
            ...dataEdit,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit]);

    return (
        <AppModal
            width={600}
            {...props}
            className="!top-4"
            title={`${isUpdateModal ? messages('common.update') : messages('common.create')} ${messages('dealType.label').toLowerCase()}`}
            open
            onOk={form.submit}
            loading={isActive}
        >
            <AppForm
                form={form}
                onFinish={onFinish}
                showSubmit={false}
                layout="vertical"
                disabled={isActive}
            >
                <AppFormItem
                    name="name"
                    label={`${messages('common.name')}`}
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
                                field: messages('common.name'),
                            }),
                        },
                    ]}
                >
                    <Input allowClear />
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
                    <Input allowClear />
                </AppFormItem>

                <AppFormItem
                    name="requiresConnection"
                    label={messages('dealType.requiredConnection')}
                    valuePropName="checked"
                >
                    <Switch />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
