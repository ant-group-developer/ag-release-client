import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import CurrenciesSelect from '@/components/ui/select/currencies-select';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, InputNumber, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { TYPE_MODAL_PRICE_TIERS } from '../../enums';
import { useCreatePriceTiers } from '../../hooks/use-create-price-tiers';
import { useUpdatePriceTiers } from '../../hooks/use-update-tiers';
import { PriceTiersData } from '../../types';
import {
    CreatePriceTiersPayload,
    UpdatePriceTiersPayload,
} from '../../types/payload';

type Props = Omit<AppModalProps, 'children'> & {};

export default function PriceTiersFormModal({ ...props }: Props) {
    // hooks
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { active, deActive, isActive } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore<PriceTiersData>((state) => state.dataEdit);

    // const
    const isUpdateForm = typeModal == TYPE_MODAL_PRICE_TIERS.UPDATE;

    // apis
    const { createPriceTiers } = useCreatePriceTiers();
    const { updatePriceTiers } = useUpdatePriceTiers();

    // func
    const handleCreatePriceTiers = (values: any) => {
        try {
            const { ...rest } = values;
            active();

            const payload = {
                ...rest,
            };
            const variables: CreateVariables<CreatePriceTiersPayload> = {
                payload,
                onSuccess: () => {
                    deActive();
                    form.resetFields();
                },
                onError: () => {
                    deActive();
                },
            };
            createPriceTiers(variables);
        } catch (error) {
            deActive();
        }
    };
    const handleUpdatePriceTiers = (values: any) => {
        const variables: UpdateVariables<
            PriceTiersData['id'],
            UpdatePriceTiersPayload
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

        updatePriceTiers(variables);
    };
    const onFinish = (values: any) => {
        const { ...rest } = values;

        const payload: CreatePriceTiersPayload = {
            ...rest,
            isActive: values?.isActive ?? true,
            isDefault: values?.isDefault ?? false,
        };

        active();
        return isUpdateForm
            ? handleUpdatePriceTiers(payload)
            : handleCreatePriceTiers(payload);
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
            title={`${dataEdit?.id ? messages('common.update') : messages('common.create')} ${messages('price.label').toLowerCase()} `}
            onCancel={closeModal}
            onOk={form.submit}
            loading={isActive}
            width={600}
        >
            <div>
                <AppForm
                    form={form}
                    onFinish={onFinish}
                    showSubmit={false}
                    layout="horizontal"
                    disabled={isActive}
                >
                    <AppFormItem
                        name="amount"
                        label={messages('price.label')}
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
                        name="currencyId"
                        label={messages('currencies.label')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <CurrenciesSelect />
                    </AppFormItem>

                    <AppFormItem
                        valuePropName="checked"
                        name="isDefault"
                        label={messages('common.setIsDefault')}
                        required
                    >
                        <Switch defaultChecked={false} />
                    </AppFormItem>

                    <AppFormItem
                        valuePropName="checked"
                        name="isActive"
                        label={messages('status.active')}
                        required
                    >
                        <Switch defaultChecked={true} />
                    </AppFormItem>
                </AppForm>
            </div>
        </AppModal>
    );
}
