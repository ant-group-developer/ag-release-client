import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import InputNumber from '@/components/ui/input/input-number';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateCountry } from '../../hooks/use-create-country';
import { useUpdateCountry } from '../../hooks/use-update-country';
import { CountriesData } from '../../types';
import {
    CreateCountryPayload,
    UpdateCountryPayload,
} from '../../types/payload';

type CountriesFormValues = Omit<
    CountriesData,
    'id' | 'createdAt' | 'updatedAt'
>;

type Props = Omit<AppModalProps, 'children'> & {};

export default function CountriesFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm<CountriesFormValues>();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as CountriesData);
    const isFormUpdate = dataEdit?.id;
    const { createCountry, isPending: createPending } = useCreateCountry();
    const { updateCountry, isPending: updatePending } = useUpdateCountry();
    const { active, deActive, isActive } = useActive();

    const handleCreate = (values: CountriesFormValues) => {
        const variables: CreateVariables<CreateCountryPayload> = {
            payload: {
                ...values,
                regionId: 1,
            },
            onSuccess: () => {
                form.resetFields();
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        createCountry(variables);
    };

    const handleUpdate = (values: CountriesFormValues) => {
        const variables: UpdateVariables<
            CountriesData['id'],
            UpdateCountryPayload
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
        updateCountry(variables);
    };

    const onFinish = (values: CountriesFormValues) => {
        active();
        try {
            return isFormUpdate ? handleUpdate(values) : handleCreate(values);
        } catch (error) {
            deActive();
        }
    };

    function renderTitle() {
        const isUpdate = !!dataEdit?.id;
        return `${isUpdate ? messages('common.update') : messages('common.create')} ${messages('country.label').toLowerCase()}`;
    }
    const titleModal = renderTitle();

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
            title={titleModal}
            open
            onCancel={closeModal}
            onOk={form.submit}
            className="!top-4"
            loading={createPending || updatePending}
        >
            <AppForm
                form={form}
                showSubmit={false}
                onFinish={onFinish}
                layout="vertical"
                disabled={isActive}
            >
                <AppFormItem
                    name="name"
                    label={messages('country.name')}
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
                                field: messages('country.name'),
                            }),
                        },
                    ]}
                >
                    <Input placeholder={messages('country.name')} allowClear />
                </AppFormItem>
                <AppFormItem
                    name="iso3"
                    label="ISO3"
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 3,
                            message: messages('validation.max', {
                                number: 3,
                            }),
                        },
                    ]}
                >
                    <Input placeholder="VNM,USA,IDN..." allowClear />
                </AppFormItem>
                <AppFormItem
                    name="iso2"
                    label="ISO2"
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 2,
                            message: messages('validation.max', {
                                number: 2,
                            }),
                        },
                    ]}
                >
                    <Input placeholder="VI,EN,JP..." allowClear />
                </AppFormItem>
                <AppFormItem
                    name="numericCode"
                    label={messages('common.numericCode')}
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
                        // {
                        //     type: 'number',
                        //     message: messages('validation.mustBeNumber'),
                        // },
                    ]}
                >
                    <InputNumber placeholder="VN:704,US:840..." allowClear />
                </AppFormItem>
                <AppFormItem
                    name="phoneCode"
                    label={messages('common.phoneNumberCode')}
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
                    <InputNumber placeholder="+84,+44..." allowClear />
                </AppFormItem>
                <AppFormItem
                    name="capital"
                    label={messages('common.capital')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 30,
                            message: messages('validation.max', {
                                number: 30,
                            }),
                        },
                    ]}
                >
                    <Input placeholder="HaNoi,Bangkok,Jakarta..." allowClear />
                </AppFormItem>
                <AppFormItem
                    name="currency"
                    label={messages('common.currency')}
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
                    <Input placeholder="VND,USD..." allowClear />
                </AppFormItem>
                <AppFormItem
                    name="currencyName"
                    label={messages('common.currencyName')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 30,
                            message: messages('validation.max', {
                                number: 30,
                            }),
                        },
                    ]}
                >
                    <Input placeholder="Vietnamese dong..." allowClear />
                </AppFormItem>
                <AppFormItem
                    name="currencySymbol"
                    label={messages('common.currencySymbol')}
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
                    <Input placeholder="₫,$..." allowClear />
                </AppFormItem>
                <AppFormItem
                    name="nationality"
                    label={messages('common.nationality')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 30,
                            message: messages('validation.max', {
                                number: 30,
                            }),
                        },
                    ]}
                >
                    <Input placeholder="Quốc tịch" allowClear />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
