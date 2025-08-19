import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { TYPE_MODAL_CURRENCIES } from '../../enums';
import { useCreateCurrency } from '../../hooks/use-create-currency';
import { useUpdateCurrency } from '../../hooks/use-update-currency';
import { CurrenciesData } from '../../types';
import {
    CreateCurrenciesPayload,
    UpdateCurrenciesPayload,
} from '../../types/payload';

type Props = Omit<AppModalProps, 'children'> & {};

export default function CurrenciesFormModal({ ...props }: Props) {
    // hooks
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { active, deActive, isActive } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore<CurrenciesData>((state) => state.dataEdit);

    // const
    const isUpdateForm = typeModal == TYPE_MODAL_CURRENCIES.UPDATE;

    // apis
    const { createCurrency } = useCreateCurrency();
    const { updateCurrency } = useUpdateCurrency();

    // func
    const handleCreateCurrency = (values: any) => {
        try {
            const { ...rest } = values;
            active();

            const payload = {
                ...rest,
            };
            const variables: CreateVariables<CreateCurrenciesPayload> = {
                payload,
                onSuccess: () => {
                    deActive();
                    form.resetFields();
                },
                onError: () => {
                    deActive();
                },
            };
            createCurrency(variables);
        } catch (error) {
            deActive();
        }
    };
    const handleUpdateCurrency = (values: any) => {
        const variables: UpdateVariables<
            CurrenciesData['id'],
            UpdateCurrenciesPayload
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

        updateCurrency(variables);
    };
    const onFinish = (values: any) => {
        const { ...rest } = values;

        const payload: CreateCurrenciesPayload = {
            ...rest,
        };

        active();
        return isUpdateForm
            ? handleUpdateCurrency(payload)
            : handleCreateCurrency(payload);
    };

    useEffect(() => {
        const initialData = {
            ...dataEdit,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit, isUpdateForm, form]);

    return (
        <AppModal
            open
            {...props}
            title={`${dataEdit?.id ? messages('common.update') : messages('common.create')} ${messages('currencies.label').toLowerCase()} `}
            onCancel={closeModal}
            onOk={form.submit}
            loading={isActive}
        >
            <div>
                <AppForm
                    form={form}
                    onFinish={onFinish}
                    showSubmit={false}
                    layout="vertical"
                    disabled={isActive}
                >
                    <AppFormItem
                        name="name"
                        label={messages('currencies.name')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                            {
                                max: 100,
                                message: messages('validation.stringMax', {
                                    max: 100,
                                    field: messages('currencies.name'),
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
                                max: 3,
                                message: messages('validation.stringMax', {
                                    max: 3,
                                    field: messages('common.code'),
                                }),
                            },
                            {
                                min: 3,
                                message: messages('validation.stringMin', {
                                    min: 3,
                                    field: messages('common.code'),
                                }),
                            },
                        ]}
                    >
                        <Input allowClear />
                    </AppFormItem>
                </AppForm>
            </div>
        </AppModal>
    );
}
