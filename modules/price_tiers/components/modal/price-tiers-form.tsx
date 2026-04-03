import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import CurrenciesSelect from '@/components/ui/select/currencies-select';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input, InputNumber, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { TYPE_MODAL_PRICE_TIERS } from '../../enums';
import { useBulkUpdatePriceTiers } from '../../hooks/use-bulk-update-tiers';
import { useCreatePriceTiers } from '../../hooks/use-create-price-tiers';
import { useUpdatePriceTiers } from '../../hooks/use-update-tiers';
import { PriceTiersData } from '../../types';
import {
    CreatePriceTiersPayload,
    UpdatePriceTiersOrderPayload,
    UpdatePriceTiersPayload,
} from '../../types/payload';
import PriceTierTypeSelect from '../select/price-tier-type-select';

type Props = Omit<AppModalProps, 'children'> & {
    selectedRowKeys?: React.Key[];
    onSuccess?: () => void;
};

export default function PriceTiersFormModal({
    selectedRowKeys = [],
    onSuccess,
    ...props
}: Props) {
    // hooks
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { active, deActive, isActive } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore<PriceTiersData>((state) => state.dataEdit);

    // const
    const isUpdateForm = typeModal === TYPE_MODAL_PRICE_TIERS.UPDATE;
    const isBulkUpdate = typeModal === TYPE_MODAL_PRICE_TIERS.BULK_UPDATE;

    // apis
    const { createPriceTiers } = useCreatePriceTiers();
    const { updatePriceTiers } = useUpdatePriceTiers();
    const { updatePriceTiersOrder } = useBulkUpdatePriceTiers();

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

    const handleBulkUpdatePriceTiers = (values: any) => {
        if (selectedRowKeys.length === 0) return;

        const filteredValues = Object.keys(values).reduce((acc: any, key) => {
            const value = values[key];
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        if (Object.keys(filteredValues).length === 0) {
            closeModal();
            return;
        }

        const payload = selectedRowKeys.map((item) => ({
            id: item,
            ...filteredValues,
        }));
        const variables: UpdatePriceTiersOrderPayload = {
            priceTiers: payload,
            onSuccess: () => {
                deActive();
                onSuccess?.();
                closeModal();
            },
            onError: () => {
                deActive();
            },
        };

        updatePriceTiersOrder(variables);
    };

    const onFinish = (values: any) => {
        const { ...rest } = values;

        const payload: CreatePriceTiersPayload = {
            ...rest,
            isActive: values?.isActive ?? true,
            isDefault: values?.isDefault ?? false,
        };

        active();
        switch (typeModal) {
            case TYPE_MODAL_PRICE_TIERS.UPDATE:
                handleUpdatePriceTiers(payload);
                break;
            case TYPE_MODAL_PRICE_TIERS.CREATE:
                handleCreatePriceTiers(payload);
                break;
            case TYPE_MODAL_PRICE_TIERS.BULK_UPDATE:
                handleBulkUpdatePriceTiers(rest);
                break;
            default:
                break;
        }
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
            title={
                isBulkUpdate
                    ? messages('common.bulkUpdate')
                    : `${dataEdit?.id ? messages('common.update') : messages('common.create')} ${messages('price.label').toLowerCase()} `
            }
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
                        rules={[
                            {
                                required: !isBulkUpdate ? true : false,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <InputNumber className="!w-full" />
                    </AppFormItem>

                    <AppFormItem
                        name="code"
                        label={messages('common.code')}
                        rules={[
                            {
                                required: !isBulkUpdate ? true : false,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input />
                    </AppFormItem>

                    <AppFormItem
                        name="ciCode"
                        label={messages('price.ciCode')}
                        rules={[
                            {
                                required: !isBulkUpdate ? true : false,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input />
                    </AppFormItem>

                    <AppFormItem
                        name="type"
                        label={messages('price.type')}
                        rules={[
                            {
                                required: !isBulkUpdate ? true : false,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <PriceTierTypeSelect className="w-full" />
                    </AppFormItem>

                    <AppFormItem
                        name="currencyId"
                        label={messages('currencies.label')}
                        rules={[
                            {
                                required: !isBulkUpdate ? true : false,
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
                    >
                        <Switch
                            defaultChecked={false}
                            onChange={(checked) => {
                                if (checked) {
                                    form.setFieldValue('isActive', true);
                                }
                            }}
                        />
                    </AppFormItem>

                    <AppFormItem
                        valuePropName="checked"
                        name="isActive"
                        label={messages('status.active')}
                    >
                        <Switch
                            defaultChecked={true}
                            onChange={(checked) => {
                                if (!checked) {
                                    form.setFieldValue('isDefault', false);
                                }
                            }}
                        />
                    </AppFormItem>
                </AppForm>
            </div>
        </AppModal>
    );
}
