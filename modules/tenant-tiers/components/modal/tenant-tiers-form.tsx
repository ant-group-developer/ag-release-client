import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppColorPicker from '@/components/ui/colorPicker/app-color-picker';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { MAX_NAME_LENGTH, MAX_NOTE_LENGTH } from '@/constants/validate';
import { getCodeFormatted } from '@/helpers/string';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input, InputNumber } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateTenantTiers } from '../../hooks/use-create';
import { useUpdateTenantTiers } from '../../hooks/use-update';
import { TenantTiersData } from '../../types';
import {
    CreateTenantTiersPayload,
    UpdateTenantTiersPayload,
} from '../../types/payloads';

type Props = Omit<AppModalProps, 'children'> & {};

export default function TenantTiersFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore(
        (state) => state.dataEdit as TenantTiersData
    );
    const { active, isActive, deActive } = useActive();
    const isUpdateModal = dataEdit?.id;

    const { createTenantTiers } = useCreateTenantTiers();
    const { updateTenantTiers } = useUpdateTenantTiers();

    const handleUpdate = (value: any) => {
        const variables: UpdateVariables<
            TenantTiersData['id'],
            UpdateTenantTiersPayload
        > = {
            id: dataEdit?.id,
            payload: value,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        updateTenantTiers(variables);
    };

    const handleCreate = (value: any) => {
        const variables: CreateVariables<CreateTenantTiersPayload> = {
            payload: value,
            onSuccess: () => {
                deActive();
                form.resetFields();
            },
            onError: () => {
                deActive();
            },
        };
        createTenantTiers(variables);
    };

    const onFinish = async (values: any) => {
        const { color, ...res } = values;
        active();
        const hexString =
            typeof color === 'string' ? color : color?.toHexString();
        const payloadValues = {
            ...res,
            color: hexString,
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
            title={`${isUpdateModal ? messages('common.update') : messages('common.create')} ${messages('tenantTier.label').toLowerCase()}`}
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
                    name="nameVi"
                    label={`${messages('tenantTier.name')} Vi`}
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
                                field: messages('tenantTier.name'),
                            }),
                        },
                    ]}
                >
                    <Input allowClear />
                </AppFormItem>
                <AppFormItem
                    name="nameEn"
                    label={`${messages('tenantTier.name')} En`}
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
                                field: messages('tenantTier.name'),
                            }),
                        },
                    ]}
                >
                    <Input
                        allowClear
                        onChange={(e) => {
                            const value = e.target.value;
                            form.setFieldValue('code', getCodeFormatted(value));
                        }}
                    />
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
                    name="minScore"
                    label={messages('common.minScore')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <InputNumber className="!w-full" />
                </AppFormItem>
                <AppFormItem
                    name="maxScore"
                    label={messages('common.maxScore')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <InputNumber className="!w-full" />
                </AppFormItem>
                <AppFormItem
                    name="color"
                    label={messages('common.color')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <AppColorPicker />
                </AppFormItem>
                <AppFormItem
                    name="description"
                    label={messages('common.description')}
                    rules={[
                        {
                            max: MAX_NOTE_LENGTH,
                            message: messages('validation.stringMax', {
                                max: MAX_NOTE_LENGTH,
                                field: messages('common.description'),
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
            </AppForm>
        </AppModal>
    );
}
